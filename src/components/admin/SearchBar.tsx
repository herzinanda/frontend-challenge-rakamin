import React from "react";

function SearchBar() {
  return (
    <div className="relative w-full">
      <input
        type="search"
        id="search-dropdown"
        className="block p-2.5 w-full z-20 text-m bg-neutral-10 border-2 border-neutral-30 text-neutral-70 focus:outline-primary-main rounded-lg"
        placeholder="Search by job details"
        required
      />
      <button
        type="submit"
        className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-primary-main"
      >
        <svg
          className="w-4 h-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
        <span className="sr-only">Search</span>
      </button>
    </div>
  );
}

export default SearchBar;
