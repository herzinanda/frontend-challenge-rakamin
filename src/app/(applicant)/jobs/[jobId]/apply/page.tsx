"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { fetchJobConfig, fetchJobDetailsAndApplicants, JobPosting, ProfileFieldConfig, submitApplication } from '@/lib/jobService'; // <-- TAMBAH submitApplication

import { SimpleWebcamCapture } from '@/components/applicant/SimpleWebcamCapture';
import Button from '@/components/ui/Button';
import Label from '@/components/ui/Label';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';

const GENDER_OPTIONS = [
  { value: 'female', label: 'She/Her (Female)' },
  { value: 'male', label: 'He/Him (Male)' },
  { value: 'other', label: 'Other' }

];

const DOMICILE_OPTIONS = [
  { value: 'jakarta', label: 'Jakarta' },
  { value: 'bandung', label: 'Bandung' },
  { value: 'surabaya', label: 'Surabaya' },
  { value: 'yogyakarta', label: 'Yogyakarta' },
  { value: 'semarang', label: 'Semarang' },
  { value: 'lainnya', label: 'Lainnya' },
];

export default function ApplyJobPage() {
  const { profile, session, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const jobId = params?.jobId as string;

  const [jobDetails, setJobDetails] = useState<JobPosting | null>(null);
  const [formConfig, setFormConfig] = useState<ProfileFieldConfig[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isCaptureModalOpen, setIsCaptureModalOpen] = useState(false);
  const [capturedImageDataUrl, setCapturedImageDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !profile) {
      const currentPath = window.location.pathname;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [authLoading, profile, router]);

  useEffect(() => {
    if (jobId && profile && session) {
      const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
          const [jobResult, configResult] = await Promise.all([
             fetchJobDetailsAndApplicants(jobId),
             fetchJobConfig()
          ]);

          setJobDetails(jobResult.job);
          setFormConfig(configResult);

          const initialData: Record<string, any> = {};
          configResult.forEach(field => {
              if (field.id === 'full_name' && profile?.full_name) {
                  initialData[field.id] = profile.full_name;
              } else if (field.id === 'email' && session?.user?.email) {
                  initialData[field.id] = session.user.email;
              }
              else {
                  initialData[field.id] = '';
              }
          });
          setFormData(initialData);


        } catch (err: any) {
          console.error("Error loading apply page data:", err);
          setError(err.message || 'Failed to load job details or form configuration.');
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }
  }, [jobId, profile, session]);

  const handleFormChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    let validationError = null;
    for (const field of formConfig) {
      if (field.mandatory && !formData[field.id]) {
        if (field.id === 'photo_profile' && !capturedImageDataUrl) {
           validationError = `Field "${field.label}" is required. Please take a picture.`;
           break;
        } else if (field.id !== 'photo_profile') {
           validationError = `Field "${field.label}" is required.`;
           break;
        }
      }
    }

    if (validationError) {
      setError(validationError);
      setIsSubmitting(false);
      return;
    }


    try {
      if (!profile?.id) {
        throw new Error("User not authenticated. Please re-login.");
      }
      
      await submitApplication(
        jobId,
        profile.id,
        formData,
        capturedImageDataUrl,
        formConfig
      );

      alert('Application Submitted Successfully!');
      router.push('/');
    } catch (err: any) {
      console.error("Submission error:", err);
      setError(err.message || 'Failed to submit application.');
    } finally {
      setIsSubmitting(false);
    }
  };

   const openCaptureModal = () => setIsCaptureModalOpen(true);
   const closeCaptureModal = () => setIsCaptureModalOpen(false);
   const handlePhotoCaptured = (imageDataUrl: string) => {
       setCapturedImageDataUrl(imageDataUrl);
       closeCaptureModal();
       setFormData(prev => ({ ...prev, photo_profile: 'captured' }));
   };


  // --- Render Kondisional ---
  if (authLoading || loading) {
    return <div className="p-6">Loading application form...</div>;
  }

  if (error) {
     return <div className="p-6 text-red-600">Error: {error}</div>;
  }

   if (!profile) {
      return <div className="p-6">Redirecting to login...</div>;
   }

   if (!jobDetails) {
       return <div className="p-6 text-red-600">Error: Job details not found.</div>;
   }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg my-10">
      <Button variant="neutral" size="small" onClick={() => router.back()} className="mb-4">
        &larr; Back
      </Button>

      <h1 className="text-2xl font-bold mb-2">Apply {jobDetails.job_name} at Rakamin</h1>
       <div className="text-sm text-neutral-600 mb-6 flex items-center gap-1">
          <span className="text-red-500">*</span> This field required to fill
       </div>


      <form onSubmit={handleSubmit} className="space-y-6">
         {formConfig.map((field) => {
            const fieldId = field.id;
            const fieldLabel = field.label;
            const fieldMandatory = field.mandatory;
            const fieldName = field.id;

            let fieldComponent;

            switch (fieldId) {
              case 'photo_profile':
                fieldComponent = (
                  <div key={fieldId}>
                    <Label htmlFor={fieldId} required={fieldMandatory}>
                      {fieldLabel}
                    </Label>
                    <div className="mt-2 flex items-center gap-4">
                      <img
                        src={capturedImageDataUrl || 'https://placehold.co/100x100/EFEFEF/AAAAAA?text=No+Photo'}
                        alt="Profile Preview"
                        className="w-24 h-24 rounded-full object-cover border"
                        onError={(e) => (e.currentTarget.src = 'https://placehold.co/100x100/EFEFEF/AAAAAA?text=Error')}
                      />
                      <Button type="button" variant="secondary" onClick={openCaptureModal} className="flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path d="M14.1667 15.8334H16.25C17.7083 15.8334 18.75 14.7917 18.75 13.3334V7.50002C18.75 5.25002 16.9167 3.41669 14.6667 3.41669H12.825C12.35 3.41669 11.9 3.14169 11.7083 2.73335L11.2583 1.70835C10.8 0.691688 9.85833 0 8.80833 0H6.25C5.2 0 4.25833 0.691688 3.80833 1.70835L3.35833 2.73335C3.16667 3.14169 2.71667 3.41669 2.24167 3.41669H1.25C0.558333 3.41669 0 3.97502 0 4.66669V5.41669C0 6.10835 0.558333 6.66669 1.25 6.66669H1.66667C1.66667 6.66669 1.66667 6.66669 1.675 6.66669H14.6667C15.9583 6.66669 17.0833 7.79169 17.0833 9.16669V13.3334C17.0833 14.7084 15.9583 15.8334 14.6667 15.8334H14.1667Z" transform="translate(0.625 2.08331)" fill="#01959F"/>
                          <path d="M6.25 18.3333H3.75C2.29167 18.3333 1.25 17.2917 1.25 15.8333V10C1.25 9.30835 1.80833 8.75 2.5 8.75C3.19167 8.75 3.75 9.30835 3.75 10V15.8333C3.75 16.1417 4.00833 16.4167 4.375 16.4167H6.25C6.94167 16.4167 7.5 17.025 7.5 17.7083C7.5 18.0833 7.15833 18.3333 6.25 18.3333Z" transform="translate(0.625 2.08331)" fill="#01959F"/>
                        </svg>
                        {capturedImageDataUrl ? 'Retake Picture' : 'Take a Pitcure'}
                      </Button>
                    </div>
                    {field.mandatory && !capturedImageDataUrl && (
                        <p className="text-xs text-red-500 mt-1">Photo is required.</p>
                    )}
                  </div>
                );
                break;
              
              case 'date_of_birth':
                fieldComponent = (
                  <div key={fieldId}>
                    <Label htmlFor={fieldId} required={fieldMandatory}>
                      {fieldLabel}
                    </Label>
                    <Input
                      id={fieldId}
                      name={fieldName}
                      type="text"
                      placeholder="DD January YYYY"
                      onFocus={(e) => (e.target.type = 'date')}
                      onBlur={(e) => { if (!e.target.value) { e.target.type = 'text'; }}}
                      value={formData[fieldName] || ''}
                      onChange={(e) => handleFormChange(fieldName, e.target.value)}
                      required={fieldMandatory}
                      className="mt-1"
                    />
                  </div>
                );
                break;

              case 'gender':
                fieldComponent = (
                  <div key={fieldId}>
                    <Label htmlFor={fieldId} required={fieldMandatory}>
                      {fieldLabel}
                    </Label>
                    <div className="mt-2 flex items-center gap-6">
                      {GENDER_OPTIONS.map((option) => (
                        <div key={option.value} className="flex items-center">
                          <input
                            type="radio"
                            id={`${fieldId}-${option.value}`}
                            name={fieldName}
                            value={option.value}
                            checked={formData[fieldName] === option.value}
                            onChange={(e) => handleFormChange(fieldName, e.target.value)}
                            className="h-4 w-4 text-primary-main border-neutral-50 focus:ring-primary-main"
                            required={fieldMandatory}
                          />
                          <label htmlFor={`${fieldId}-${option.value}`} className="ml-2 block text-sm text-neutral-90">
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                );
                break;
              
              case 'domicile':
                fieldComponent = (
                  <div key={fieldId}>
                    <Label htmlFor={fieldId} required={fieldMandatory} id={`${fieldId}-label`}>
                      {fieldLabel}
                    </Label>
                    <Select
                      labelId={`${fieldId}-label`}
                      options={DOMICILE_OPTIONS}
                      value={formData[fieldName] || ''}
                      onChange={(value) => handleFormChange(fieldName, value)}
                      placeholder="Choose your domicile"
                    />
                  </div>
                );
                break;

              case 'phone_number':
                fieldComponent = (
                  <div key={fieldId}>
                    <Label htmlFor={fieldId} required={fieldMandatory}>
                      {fieldLabel}
                    </Label>
                    <Input
                      id={fieldId}
                      name={fieldName}
                      type="tel"
                      placeholder="81X XXXX XXXX"
                      prefix="+62"
                      value={formData[fieldName] || ''}
                      onChange={(e) => handleFormChange(fieldName, e.target.value)}
                      required={fieldMandatory}
                      className="mt-1"
                    />
                  </div>
                );
                break;

              case 'linkedin_link':
                fieldComponent = (
                  <div key={fieldId}>
                    <Label htmlFor={fieldId} required={fieldMandatory}>
                      {fieldLabel}
                    </Label>
                    <Input
                      id={fieldId}
                      name={fieldName}
                      type="text"
                      placeholder="https://linkedin.com/in/username" 
                      value={formData[fieldName] || ''}
                      onChange={(e) => handleFormChange(fieldName, e.target.value)}
                      required={fieldMandatory}
                      className="mt-1"
                    />
                  </div>
                );
                break;
              
              case 'full_name':
              case 'email':
              default:
                fieldComponent = (
                  <div key={fieldId}>
                    <Label htmlFor={fieldId} required={fieldMandatory}>
                      {fieldLabel}
                    </Label>
                    <Input
                      id={fieldId}
                      name={fieldName}
                      type={fieldId === 'email' ? 'email' : 'text'}
                      placeholder={
                        fieldId === 'full_name' ? 'Budi Yanto' :
                        fieldId === 'email' ? 'Enter your email address' :
                        `Enter your ${fieldLabel.toLowerCase()}`
                      }
                      value={formData[fieldName] || ''}
                      onChange={(e) => handleFormChange(fieldName, e.target.value)}
                      required={fieldMandatory}
                      className="mt-1"
                    />
                  </div>
                );
            }

           return (
             <div key={field.id}>
                {fieldComponent}
                {field.mandatory && !formData[field.id] && (
                     <p className="text-xs text-red-500 mt-1">This field is required.</p>
                 )}
             </div>
           );

         })}

         {error && <p className="text-red-600 text-sm">{error}</p>}

         <div className="pt-4">
           <Button
             type="submit"
             variant="primary"
             width="full"
             disabled={isSubmitting}
           >
             {isSubmitting ? 'Submitting...' : 'Submit Application'}
           </Button>
         </div>
      </form>

       {/* Modal untuk Webcam Capture */}
        <Modal isOpen={isCaptureModalOpen} onClose={closeCaptureModal} title="" > {/* Sembunyikan title default modal */}
           <SimpleWebcamCapture
             onCapture={handlePhotoCaptured}
             onClose={closeCaptureModal}
           />
        </Modal>

    </div>
  );
}



