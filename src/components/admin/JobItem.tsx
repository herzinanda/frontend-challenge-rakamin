import React from 'react'

function JobItem({ title, status, date, salary }) {

    const statusClasses = {
    Active: 'bg-success-surface text-success-main border border-success-border',
    Inactive: 'bg-danger-surface text-danger-main border border-danger-border',
    Draft: 'bg-warning-surface text-warning-main border border-warning-border',
  };

  return (
    <div className="p-1 sm:p-4 bg-neutral-10 rounded-lg shadow-[0_4px_8px_0_rgba(0,0,0,0.10)] space-y-3 w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div className="flex items-center gap-3">
          <span className={`px-4 py-1 rounded-lg text-sm font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-700'}`}>
            {status}
          </span>
          <span className="text-m text-neutral-90 border border-neutral-40 py-1 px-4 rounded-lg">started on {date}</span>
        </div>
        <button className="bg-primary-main hover:bg-primary-hover text-neutral-10 text-sm font-bold py-2 px-4 rounded-lg w-full sm:w-auto">
          Manage Job
        </button>
      </div>
      <h3 className="text-xl font-bold text-neutral-100">{title}</h3>
      <p className="text-l text-neutral-80">{salary}</p>
    </div>
  )
}

export default JobItem