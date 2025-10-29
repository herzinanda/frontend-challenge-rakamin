"use client";

import React from 'react';
import Image from 'next/image';

export const EmptyCandidates: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full pt-16">
      <Image
        src="/admin/svg/no-candidates.svg"
        alt="No candidates found"
        width={300}
        height={300}
        className="mb-6"
        onError={(e) => {
          e.currentTarget.src = "https://placehold.co/300x300/F0F4F8/9AA5B8?text=No+Candidates";
        }}
      />
      <h3 className="text-xl font-bold text-neutral-90 mb-2">
        No candidates found
      </h3>
      <p className="text-m text-neutral-70">
        Share your job vacancies so that more candidates will apply.
      </p>
    </div>
  );
};

