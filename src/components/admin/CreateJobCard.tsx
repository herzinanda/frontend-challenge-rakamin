import React from "react";

function CreateJobCard() {
  return (
    <div className="bg-[linear-gradient(rgba(0,0,0,0.72),rgba(0,0,0,0.72)),url('/admin/images/highlighted-session.png')] bg-cover bg-center rounded-2xl p-6 ">
      <h6 className="text-xl font-bold text-neutral-40">
        Recruit the best candidates
      </h6>
      <p className="font-bold text-m text-neutral-10 pt-1">
        Create jobs, invite, and hire with ease
      </p>
      <button className="w-full bg-primary-main text-white mt-6  py-1.5 text-l font-bold rounded-lg">
        Create a new job
      </button>
    </div>
  );
}

export default CreateJobCard;
