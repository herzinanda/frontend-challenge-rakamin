"use client";

import React from 'react';
import { JobPosting } from '@/lib/jobService';
import Button from '../ui/Button';

const formatSalaryRange = (min?: number, max?: number): string => {
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  if (min && max) {
    return `${formatter.format(min)} - ${formatter.format(max)}`;
  }
  if (min) {
    return `Mulai dari ${formatter.format(min)}`;
  }
  if (max) {
    return `Hingga ${formatter.format(max)}`;
  }
  return 'Gaji tidak ditampilkan';
};

const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch (error) {
    console.warn('Invalid date string:', dateString);
    return 'Invalid date';
  }
};

const JobItem: React.FC<JobPosting> = ({
  id,
  job_name,
  job_status,
  created_at,
  min_salary,
  max_salary,
}) => {
  const statusClasses = {
    ACTIVE: 'bg-success-surface text-success-main border border-success-border',
    INACTIVE: 'bg-danger-surface text-danger-main border border-danger-border',
    DRAFT: 'bg-warning-surface text-warning-main border border-warning-border',
  };

  const formattedDate = formatDate(created_at);
  const formattedSalary = formatSalaryRange(min_salary, max_salary);

  return (
    <div className="p-1 sm:p-4 bg-neutral-10 rounded-lg shadow-[0_4px_8px_0_rgba(0,0,0,0.10)] space-y-3 w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div className="flex items-center gap-3">
          <span
            className={`px-4 py-1 rounded-lg text-sm font-medium ${
              statusClasses[job_status] || 'bg-gray-100 text-gray-700'
            }`}
          >
            {job_status}
          </span>
          <span className="text-m text-neutral-90 border border-neutral-40 py-1 px-4 rounded-lg">
            started on {formattedDate}
          </span>
        </div>
        
        <Button
          variant="primary"
          size="small"
          href={`/manage/${id}`}
        >
          Manage Job
        </Button>

      </div>
      <h3 className="text-xl font-bold text-neutral-100">{job_name}</h3>
      <p className="text-l text-neutral-80">{formattedSalary}</p>
    </div>
  );
};

export default JobItem;

