"use client";

import React from 'react';
import Image from 'next/image';
import { JobPosting } from '@/lib/jobService';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import Button from '../ui/Button';

interface ApplicantJobDetailProps {
  job: JobPosting;
}

export const ApplicantJobDetail: React.FC<ApplicantJobDetailProps> = ({
  job,
}) => {
  const { profile, loading } = useAuth(); // Dapatkan status login
  const router = useRouter();
  const pathname = usePathname(); // Dapatkan URL saat ini

  const salaryDisplay = `Rp${job.min_salary?.toLocaleString('id-ID') || 'N/A'} - Rp${job.max_salary?.toLocaleString('id-ID') || 'N/A'}`;

  const descriptionHtml =
    job.job_description ||
    '<ul><li>Informasi pekerjaan tidak tersedia.</li><li>Silakan hubungi rekruter untuk detail lebih lanjut.</li></ul>';

  const handleApplyClick = () => {
    if (loading) return; // Jangan lakukan apa-apa jika auth masih loading

    if (profile) {
      router.push(`/jobs/${job.id}/apply`);
    } else {
      router.push(`/login?redirect=/jobs/${job.id}/apply`);
    }
  };

  return (
    <div className="relative h-full rounded-lg border border-neutral-300 bg-white">
      <div className="h-full overflow-y-auto p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Image
              src="/admin/avatar-1.png" // Ganti dengan logo perusahaan jika ada
              alt={`${job.department || 'Rakamin'} logo`}
              width={64}
              height={64}
              className="rounded-lg"
            />
            <div>
              <span className="rounded bg-blue-100 px-2 py-0.5 text-sm font-medium text-blue-800">
                Full-time
              </span>
              <h2 className="mt-2 text-xl font-bold text-neutral-100">
                {job.job_name}
              </h2>
              <p className="text-l text-neutral-80">
                {job.department || 'Rakamin'}
              </p>
            </div>
          </div>

          <Button
            variant={loading ? 'disabled' : 'primary'}
            size="large"
            onClick={handleApplyClick}
            disabled={loading}
          >
            Apply
          </Button>
        </div>

        <div className="mt-6 border-y border-neutral-200 py-4">
          <p className="text-m font-medium text-neutral-600">Salary Range</p>
          <p className="text-l font-bold text-neutral-100">{salaryDisplay}</p>
        </div>

        <div className="prose prose-sm mt-6 max-w-none text-neutral-80">
          <h4 className="font-bold">Job Description</h4>
          <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
        </div>
      </div>
    </div>
  );
};

