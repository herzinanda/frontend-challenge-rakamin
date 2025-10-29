"use client";

import Image from "next/image";
import React, { useState } from "react";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import { JobOpeningForm } from "./JobOpeningForm";

const EmptyJob: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
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
      <Button
        variant="secondary"
        size="large"
        className="mt-4"
        onClick={openModal}
      >
        Create a new job
      </Button>
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Create a New Job">
        <JobOpeningForm onClose={closeModal} />
      </Modal>
    </>
  );
};

export default EmptyJob;
