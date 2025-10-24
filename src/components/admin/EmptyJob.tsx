import Image from "next/image";
import React from "react";

function EmptyJob() {
  return (
    <>
      <Image
        src="/admin/svg/no-job-opening.svg"
        alt="No job opening"
        width={300}
        height={300}
      />
      <div className="flex flex-col gap-1 text-center">
        <h4 className="font-bold text-heading-s text-neutral-90">
          No job openings available
        </h4>
        <p className="text-l">
          Create a job opening now and start the candidate process
        </p>
      </div>
      <button className="bg-secondary-main text-l font-bold py-1.5 px-4 mt-4 rounded-lg">
        Create a new job
      </button>
    </>
  );
}

export default EmptyJob;
