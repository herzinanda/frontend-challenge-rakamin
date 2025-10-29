"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../../context/AuthContext';
import {
  fetchJobDetailsAndApplicants,
  JobPosting,
  Applicant,
} from '../../../../lib/jobService';
import { Breadcrumbs } from '@/components/admin/Breadcrumbs';
import { CandidateTable } from '@/components/admin/candidates/CandidateTable';
import { EmptyCandidates } from '@/components/admin/candidates/EmptyCandidates';

interface PageData {
  job: JobPosting;
  applicants: Applicant[];
}

export default function ManageCandidatePage() {
  const router = useRouter();
  const params = useParams();
  const { jobId } = params;
  const { loading: authLoading, isAdmin } = useAuth();
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!isAdmin) {
        router.push('/login');
        return;
      }
    }
  }, [authLoading, isAdmin, router]);

  useEffect(() => {
    if (typeof jobId !== 'string' || (!authLoading && !isAdmin)) {
      if (typeof jobId !== 'string') {
        setLoading(false);
        setError('Invalid Job ID.');
      }
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchJobDetailsAndApplicants(jobId);
        setData(result);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to fetch job details.');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && isAdmin) {
      loadData();
    }
  }, [jobId, authLoading, isAdmin]);
  const breadcrumbItems = [
    { label: 'Job list', href: '/dashboard' },
    { label: 'Manage Candidate' },
  ];


  if (authLoading) {
    return <div className="p-6">Loading session...</div>;
  }

  if (loading) {
    return <div className="p-6">Loading candidate data...</div>;
  }

  if (error) {
    return <div className="p-6 text-danger-main">Error: {error}</div>;
  }

  if (!data || !data.job) {
    return <div className="p-6">Job not found.</div>;
  }

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <Breadcrumbs items={breadcrumbItems} />

      <h1 className="text-xl font-bold text-neutral-90">
        {data.job.job_name}
      </h1>

      <div className="mt-4">
        {data.applicants.length === 0 ? (
          <EmptyCandidates />
        ) : (
          <CandidateTable applicants={data.applicants} />
        )}
      </div>
    </div>
  );
}

