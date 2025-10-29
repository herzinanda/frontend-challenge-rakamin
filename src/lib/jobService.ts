import { supabase } from './supabaseClient';

export interface JobPosting {
  id: string;
  created_at: string;
  job_name: string; 
  department: string;
  job_status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  min_salary?: number; 
  max_salary?: number; 
  job_description?: string;
}

export interface Applicant {
  id: string;
  created_at: string;
  user_id: string | null; 
  profile_data: { 
    key: string;
    value: string;
    label: string;
  }[];
}

export interface JobWithApplicants {
  job: JobPosting;
  applicants: Applicant[];
}

export interface ProfileFieldConfig {
  id: string; 
  label: string; 
  mandatory: boolean;
  order_index: number;
}


// SERVICE UNTUK ADMIN

export const fetchAdminJobs = async (): Promise<JobPosting[]> => {
  const { data, error } = await supabase
    .from('job_postings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin jobs:', error.message);
    throw new Error(error.message);
  }

  return (data as JobPosting[]) || [];
};

// SERVICE UNTUK ADMIN (Manage Candidate Page)

export const fetchJobDetailsAndApplicants = async (
  jobId: string
): Promise<JobWithApplicants> => { 
  const { data, error } = await supabase
    .from('job_postings')
    .select(
      `
      *,
      job_applications (
        id,
        created_at,
        user_id,
        profile_data
      )
    `
    )
    .eq('id', jobId)
    .single(); 

  if (error) {
    console.error('Error fetching job details and applicants:', error.message);
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error('Job not found.');
  }

  const { job_applications, ...jobData } = data;

  const job: JobPosting = jobData as JobPosting;
  const applicants: Applicant[] = job_applications as Applicant[];

  if (applicants && applicants.length > 0) {
    applicants.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  return { job, applicants: applicants || [] }; 
};


// SERVICE UNTUK APPLICANT & ADMIN

export const fetchJobConfig = async (): Promise<ProfileFieldConfig[]> => {
  const { data, error } = await supabase
    .from('profile_field_config')
    .select('*')
    .order('order_index', { ascending: true }); 

  if (error) {
    console.error('Error fetching job config:', error.message);
    throw new Error(error.message);
  }
  return (data as ProfileFieldConfig[]) || []; // Pastikan selalu array
}

// SERVICE FOR APPLICANT (Job Listing Page)

export const fetchActiveJobs = async (): Promise<JobPosting[]> => {
  const { data, error } = await supabase
    .from('job_postings')
    .select('*')
    .eq('job_status', 'ACTIVE') // <-- DIPASTIKAN HURUF BESAR
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching active jobs:', error.message);
    throw new Error(error.message); 
  }

  return (data as JobPosting[]) || []; 
};

export const submitApplication = async (
  jobId: string,
  userId: string,
  formData: Record<string, any>,
  capturedImageDataUrl: string | null,
  formConfig: ProfileFieldConfig[] 
): Promise<any> => {
  
  console.log("Formatting profile data for submission...");

  const profileData = formConfig
    .map(field => {
      let valueToStore: string = '';

      if (field.id === 'photo_profile') {
        valueToStore = capturedImageDataUrl || '';
      } else {
        valueToStore = formData[field.id] || '';
      }

      return {
        key: field.id,
        label: field.label,
        value: valueToStore,
      };
    })
    .filter(data => data.value !== '' || data.key === 'photo_profile');

  console.log("Submitting to Supabase:", { jobId, userId, profileData });

  const { data, error } = await supabase
    .from('job_applications')
    .insert([
      {
        job_id: jobId,
        user_id: userId,
        profile_data: profileData,
      }
    ])
    .select();

  if (error) {
    console.error('Error submitting application:', error.message);
    throw new Error(`Failed to submit: ${error.message}`);
  }

  console.log("Submission successful:", data);
  return data;
};

