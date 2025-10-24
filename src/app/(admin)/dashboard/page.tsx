import CreateJobCard from "@/components/admin/CreateJobCard";
import EmptyJob from "@/components/admin/EmptyJob";
import JobItem from "@/components/admin/JobItem";
import SearchBar from "@/components/admin/SearchBar";
import Image from "next/image";

export default function Home() {
  const jobs = [
    {
      id: 1,
      title: "Front End Developer",
      status: "Active",
      date: "1 Oct 2025",
      salary: "Rp7.000.000 - Rp8.000.000",
    },
    {
      id: 2,
      title: "Data Scientist",
      status: "Inactive",
      date: "2 Oct 2025",
      salary: "Rp7.000.000 - Rp12.500.000",
    },
    {
      id: 3,
      title: "Product Manager",
      status: "Draft",
      date: "3 Sep 2025",
      salary: "Rp7.000.000 - Rp12.500.000",
    },
    {
      id: 4,
      title: "Back End Developer",
      status: "Active",
      date: "4 Oct 2025",
      salary: "Rp7.000.000 - Rp8.000.000",
    },
    {
      id: 5,
      title: "UI/UX Designer",
      status: "Active",
      date: "5 Oct 2025",
      salary: "Rp7.000.000 - Rp8.000.000",
    },
    {
      id: 6,
      title: "DevOps Engineer",
      status: "Inactive",
      date: "6 Oct 2025",
      salary: "Rp7.000.000 - Rp12.500.000",
    },
  ];

  return (
    <div className="mt-9 flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-3/4 space-y-6">
        <SearchBar></SearchBar>
        <div className="flex flex-col w-full items-center gap-4">
          {jobs.length === 0 ? (
            <EmptyJob></EmptyJob>
          ) : (
            jobs.map((job) => <JobItem key={job.id} {...job} />)
          )}
        </div>
      </div>
      <div className="w-full lg:w-1/4 lg:self-start sticky top-16">
          <CreateJobCard></CreateJobCard>
      </div>
    </div>
  );
}
