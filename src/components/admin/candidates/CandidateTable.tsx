"use client";

import React from 'react';
import { Applicant } from '@/lib/jobService';
import { format } from 'date-fns';

interface CandidateTableProps {
  applicants: Applicant[];
}

export const CandidateTable: React.FC<CandidateTableProps> = ({ applicants }) => {
  const headers = [
    'Nama Lengkap',
    'Email Address',
    'Phone Numbers',
    'Date of Birth',
    'Domicile',
    'Gender',
    'Link Linkedin',
  ];

  const getApplicantValue = (
    profile_data: Applicant['profile_data'],
    key: string
  ): string => {
    const attribute = profile_data.find((attr) => attr.key === key);
    return attribute?.value || '-';
  };

  const formatBirthDate = (dateString: string): string => {
    if (!dateString || dateString === '-') return '-';
    try {
      return format(new Date(dateString), 'dd MMMM yyyy');
    } catch (error) {
      console.warn('Invalid date format:', dateString);
      return dateString;
    }
  };

  return (
    <div className="w-full border border-neutral-30 rounded-lg bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-30">
          <thead className="bg-neutral-20">
            <tr>
              <th
                scope="col"
                className="sticky left-0 z-10 px-4 py-3 bg-neutral-20"
              >
                <span className="sr-only">Select row</span>
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-primary-main rounded border-neutral-50 focus:ring-primary-main"
                />
              </th>

              <th
                scope="col"
                className="sticky left-12 z-10 px-4 py-3 bg-neutral-20 text-left text-xs font-medium text-neutral-70 uppercase tracking-wider"
              >
                {headers[0]}
              </th>

              {headers.slice(1).map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-70 uppercase tracking-wider whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-neutral-30">
            {applicants.map((applicant) => (
              <tr key={applicant.id} className="hover:bg-neutral-50">
                <td className="sticky left-0 z-0 px-4 py-4 bg-white whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-primary-main rounded border-neutral-50 focus:ring-primary-main"
                  />
                </td>

                <td className="sticky left-12 z-0 px-4 py-4 bg-white whitespace-nowrap text-sm font-medium text-neutral-900">
                  {getApplicantValue(applicant.profile_data, 'full_name')}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                  {getApplicantValue(applicant.profile_data, 'email')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                  {getApplicantValue(applicant.profile_data, 'phone')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                  {formatBirthDate(getApplicantValue(applicant.profile_data, 'date_of_birth'))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                  {getApplicantValue(applicant.profile_data, 'domicile')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                  {getApplicantValue(applicant.profile_data, 'gender')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-main hover:underline">
                  <a 
                    href={getApplicantValue(applicant.profile_data, 'linkedin_link')} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {getApplicantValue(applicant.profile_data, 'linkedin_link')}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

