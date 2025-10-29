"use client";

import React, { useState } from "react";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import { JobOpeningForm } from "./JobOpeningForm";

interface CreateJobCardProps {
  onJobCreated: () => void;
}

const CreateJobCard: React.FC<CreateJobCardProps> = ({ onJobCreated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="bg-[linear-gradient(rgba(0,0,0,0.72),rgba(0,0,0,0.72)),url('/admin/images/highlighted-session.png')] bg-cover bg-center rounded-2xl p-6 ">
        <h6 className="text-xl font-bold text-neutral-40">
          Recruit the best candidates
        </h6>
        <p className="font-bold text-m text-neutral-10 pt-1">
          Create jobs, invite, and hire with ease
        </p>
        <Button
          variant="primary"
          size="large"
          width="full"
          className="mt-6"
          onClick={openModal}
        >
          Create a new job
        </Button>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Create a New Job">
        <JobOpeningForm onClose={closeModal} />
      </Modal>
    </>
  );
};

export default CreateJobCard;

