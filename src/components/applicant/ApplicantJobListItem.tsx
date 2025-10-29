"use client";

import React from 'react';
import { JobPosting } from '@/lib/jobService';

interface ApplicantJobListItemProps {
  job: JobPosting;
  onSelect: (job: JobPosting) => void;
  isSelected: boolean;
}

export const ApplicantJobListItem: React.FC<ApplicantJobListItemProps> = ({
  job,
  onSelect,
  isSelected,
}) => {
  const salaryDisplay = `Rp${job.min_salary?.toLocaleString('id-ID') || 'N/A'} - Rp${job.max_salary?.toLocaleString('id-ID') || 'N/A'}`;
  const borderClasses = isSelected
    ? 'border-primary-main ring-2 ring-primary-main'
    : 'border-neutral-300';

  return (
    <button
      onClick={() => onSelect(job)}
      className={`flex w-full items-start gap-4 rounded-lg border bg-white p-4 text-left transition-all hover:shadow-md ${borderClasses}`}
    >
      <div className="flex-shrink-0">
        <img
          src="https://placehold.co/48x48/00A991/FFFFFF?text=R"
          alt={`${job.department || 'Rakamin'} logo`}
          width={48}
          height={48}
          className="rounded-lg"
          loading="lazy"
        />
      </div>

      <div className="w-full space-y-1">
        <h3 className="font-bold text-l text-neutral-100">{job.job_name}</h3>
        <p className="text-m text-neutral-80">{job.department || 'Rakamin'}</p>
        <p className="text-m text-neutral-60">Jakarta Selatan</p>
        <p className="pt-2 font-medium text-m text-neutral-80">
          {salaryDisplay}
        </p>
      </div>
    </button>
  );
};

