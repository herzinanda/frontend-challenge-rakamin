"use client";

import EmptyJob from "@/components/admin/EmptyJob";
// Jalur impor diubah dari alias @/ menjadi jalur relatif
import { useAuth } from "../../../context/AuthContext";
import { fetchAdminJobs, JobPosting } from "../../../lib/jobService"; // <-- IMPORT BARU

import Image from "next/image"; // Impor Next.js standar, biarkan
import { useRouter } from "next/navigation"; // Impor Next.js standar, biarkan
import { useEffect, useState } from "react"; // <-- IMPORT useState
import JobItem from "@/components/admin/JobItem";
import SearchBar from "@/components/admin/SearchBar";
import CreateJobCard from "@/components/admin/CreateJobCard";

export default function Home() {
  const { profile, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();

  const [jobs, setJos] = useState<JobPosting[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState<string | null>(null);

  const loadJobs = async () => {
    setJobsLoading(true);
    setJobsError(null);
    try {
      const data = await fetchAdminJobs();
      setJobs(data);
    } catch (err: any) {
      setJobsError(err.message);
    } finally {
      setJobsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!isAdmin) {
        router.push("/login");
      } else {
        loadJobs();
      }
    }
  }, [authLoading, isAdmin, router]);

  if (authLoading) {
    return (
      <div className="text-center mt-20">Loading session...</div>
    );
  }
  const renderDashboardContent = () => {
    if (jobsLoading) {
      return (
        <div className="text-center mt-10">Loading job data...</div>
      );
    }

    if (jobsError) {
      return (
        <div className="text-center mt-10 text-red-600">
          <strong>Error fetching jobs:</strong> {jobsError}
        </div>
      );
    }

    if (jobs.length === 0) {
      return (
        <EmptyJob 
          onJobCreated={loadJobs}
        />
      );
    }

    return jobs.map((job) => (
      <JobItem key={job.id} {...job} />
    ));
  };
  if (isAdmin && profile) {
    return (
      <div className="mt-9 flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-3/4 space-y-6">
          <SearchBar></SearchBar>
          <div className="flex flex-col w-full items-center gap-4">
            {renderDashboardContent()}
          </div>
        </div>
        <div className="w-full lg:w-1/4 lg:self-start sticky top-16">
          <CreateJobCard 
            onJobCreated={loadJobs}
          />
        </div>
      </div>
    );
  }

  return null;
}

