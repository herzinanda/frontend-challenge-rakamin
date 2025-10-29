"use client";

import { ApplicantJobDetail } from '@/components/applicant/ApplicantJobDetail';
import { ApplicantJobListItem } from '@/components/applicant/ApplicantJobListItem';
import { EmptyJobListing } from '@/components/applicant/EmptyJobListing';
import { fetchActiveJobs, JobPosting } from '@/lib/jobService';
import React, { useState, useEffect } from 'react';

export default function ApplicantHomePage() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const activeJobs = await fetchActiveJobs();
        setJobs(activeJobs);

        if (activeJobs.length > 0) {
          setSelectedJob(activeJobs[0]);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch jobs.');
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  const handleJobSelect = (job: JobPosting) => {
    setSelectedJob(job);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-neutral-600">
        Loading job openings...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-600">
        Error: {error}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <EmptyJobListing />
      </main>
    );
  }

  return (
    <main className="flex h-[calc(100vh-80px)] overflow-hidden">
      <div className="w-full max-w-sm flex-shrink-0 overflow-y-auto border-r border-neutral-300 p-4">
        <div className="space-y-3">
          {jobs.map((job) => (
            <ApplicantJobListItem
              key={job.id}
              job={job}
              onSelect={handleJobSelect}
              isSelected={selectedJob?.id === job.id}
            />
          ))}
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-6">
        <div className="relative h-full">
          {selectedJob ? (
            <ApplicantJobDetail job={selectedJob} />
          ) : (
            <div className="flex h-full items-center justify-center rounded-lg border border-neutral-300 bg-white">
              <p className="text-neutral-600">
                Select a job from the left to see details.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

