"use client";

import Image from 'next/image';
import React from 'react';

export const EmptyJobListing: React.FC = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center rounded-lg border border-neutral-300 bg-white p-12">
      <Image
        src="/admin/svg/no-job-opening.svg"
        alt="No job openings"
        width={300}
        height={300}
        className="mb-6"
      />
      <h2 className="text-xl font-bold text-neutral-900">
        No job openings available
      </h2>
      <p className="mt-1 text-l text-neutral-600">
        Please wait for the next batch of openings.
      </p>
    </div>
  );
};

