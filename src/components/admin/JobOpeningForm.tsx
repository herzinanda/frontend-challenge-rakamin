"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient'; 
import { OptionSelector, OptionValue } from '../ui/OptionSelector';
import Button from '../ui/Button';
import Label from '../ui/Label';
import Input from '../ui/Input';
import Select from '../ui/Select';
import HorizontalLine from '../ui/HorizontalLine';

const jobTypeOptions = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
];

interface JobFormState {
  jobName: string;
  jobType: string;
  jobDescription: string;
  candidates: string;
  minSalary: string;
  maxSalary: string;
}

type ProfileSettingsState = Record<string, OptionValue>;

interface ProfileFieldConfig {
  id: string; 
  label: string; 
  mandatory: boolean; 
  order_index: number;
}

const parseCurrency = (value: string): number => {
  return parseInt(value.replace(/\./g, ''), 10) || 0;
};

interface JobOpeningFormProps {
  onClose: () => void;
}

export const JobOpeningForm: React.FC<JobOpeningFormProps> = ({ onClose }) => {
  const [jobForm, setJobForm] = useState<JobFormState>({
    jobName: '',
    jobType: '',
    jobDescription: '',
    candidates: '1',
    minSalary: '',
    maxSalary: '',
  });

  const [profileFields, setProfileFields] = useState<ProfileFieldConfig[]>([]);
  const [settings, setSettings] = useState<ProfileSettingsState>({});
  
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoadingConfig(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('profile_field_config')
          .select('*')
          .order('order_index', { ascending: true });

        if (error) throw error;

        setProfileFields(data || []);

        const initialSettings = (data || []).reduce((acc, field) => {
          acc[field.id] = field.mandatory ? 'mandatory' : 'mandatory'; 
          return acc;
        }, {} as ProfileSettingsState);

        setSettings(initialSettings);

      } catch (err: any) {
        console.error('Failed to fetch profile config:', err.message);
        setError('Failed to load form settings. Please try again.');
      } finally {
        setLoadingConfig(false);
      }
    };

    fetchConfig();
  }, []);

  const handleJobFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setJobForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleJobTypeChange = (value: string) => {
    setJobForm((prev) => ({ ...prev, jobType: value }));
  };

  const handleSettingChange = (fieldId: string, value: OptionValue) => {
    setSettings((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const jobPostingData = {
        job_name: jobForm.jobName,
        job_type: jobForm.jobType,
        job_description: jobForm.jobDescription,
        candidates_needed: parseInt(jobForm.candidates, 10) || 1,
        min_salary: parseCurrency(jobForm.minSalary),
        max_salary: parseCurrency(jobForm.maxSalary),
        profile_requirements: settings
      };

      const { error } = await supabase
        .from('job_postings')
        .insert(jobPostingData);

      if (error) throw error;

      console.log('Successfully posted job!');
      onClose();

    } catch (err: any) {
      console.error('Failed to submit job posting:', err.message);
      setError(`Failed to post job: ${err.message}. (Pastikan Anda sudah login jika RLS aktif)`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      className="space-y-4 max-h-[70vh] overflow-y-auto p-1"
      onSubmit={handleSubmit}
    >
      
      <div className="flex flex-col gap-2">
        <Label htmlFor="jobName" required>
          Job Name
        </Label>
        <Input
          type="text"
          id="jobName"
          placeholder="Ex. Front End Engineer"
          value={jobForm.jobName}
          onChange={handleJobFormChange}
          disabled={submitting}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label id="jobType-label" htmlFor="jobType" required>
          Job Type
        </Label>
        <Select
          labelId="jobType-label"
          options={jobTypeOptions}
          value={jobForm.jobType}
          onChange={handleJobTypeChange}
          placeholder="Select job type"
          disabled={submitting}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="jobDescription" required>
          Job Description
        </Label>
        <Input
          as="textarea"
          id="jobDescription"
          rows={4}
          placeholder="Ex."
          value={jobForm.jobDescription}
          onChange={handleJobFormChange}
          disabled={submitting}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="candidates" required>
          Number of Candidate Needed
        </Label>
        <Input
          type="number"
          id="candidates"
          placeholder="Ex. 2"
          value={jobForm.candidates}
          onChange={handleJobFormChange}
          disabled={submitting}
        />
      </div>
      <HorizontalLine />
      <div className="flex flex-col gap-2">
        <Label className="mb-2" htmlFor="minSalary">
          Job Salary (Otomatis hapus titik)
        </Label>
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="minSalary">Minimum Estimated</Label>
            <Input
              type="text"
              id="minSalary"
              prefix="Rp"
              placeholder="7.000.000"
              aria-label="Minimum Estimated Salary"
              value={jobForm.minSalary}
              onChange={handleJobFormChange}
              disabled={submitting}
            />
          </div>
          <span className="text-neutral-40">–</span>
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="maxSalary">Maximum Estimated</Label>
            <Input
              type="text"
              id="maxSalary"
              prefix="Rp"
              placeholder="8.000.000"
              aria-label="Maximum Estimated Salary"
              value={jobForm.maxSalary}
              onChange={handleJobFormChange}
              disabled={submitting}
            />
          </div>
        </div>
      </div>
      <HorizontalLine />

      <div className="border border-neutral-30 rounded-lg bg-white">
        <div className="p-6">
          <h3 className="text-md font-bold text-neutral-90 mb-6">
            Minimum Profile Information Required
          </h3>

          {loadingConfig && <div className="text-neutral-60">Loading settings...</div>}

          {error && !submitting && (
            <div className="text-red-600 bg-red-50 p-4 rounded-md">
              {error}
            </div>
          )}

          {!loadingConfig && (
            <div className="space-y-4">
              {profileFields.map((field, index) => (
                <React.Fragment key={field.id}>
                  {index > 0 && <hr className="bg-neutral-40 h-px border-0" />}
                  <div className="flex items-center justify-between py-2">
                    <span className="text-md text-neutral-90">
                      {field.label}
                    </span>
                    <OptionSelector
                      value={settings[field.id] || 'off'}
                      onChange={(value) => handleSettingChange(field.id, value)}
                      isMandatory={field.mandatory} 
                      disabled={submitting}
                    />
                  </div>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && submitting && (
        <div className="text-red-600 text-sm text-right">
          {error}
        </div>
      )}
      <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-white py-4">
        <Button
          type="button"
          variant="secondary" 
          onClick={onClose}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={loadingConfig || submitting}
        >
          {submitting ? 'Posting...' : 'Post Job'}
        </Button>
      </div>
    </form>
  );
};

