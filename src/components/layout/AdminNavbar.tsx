import Image from "next/image";
import React from "react";

function AdminNavbar() {
  return (
    <nav className="relative top-0 bg-neutral-10 border-b border-b-neutral-40 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px">
      <div className="mx-auto px-1 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* <div className="flex flex-1 items-center justify-between sm:items-stretch sm:justify-between text-black"> */}
          <h1 className="text-xl font-bold">Job Lists</h1>
          <Image
            src="/avatar-1.jpg"
            alt="Avatar"
            width={28}
            height={28}
            className="rounded-full border border-neutral-40"
          />
          {/* </div> */}
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;
