import React from 'react'

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-[linear-gradient(rgba(0,0,0,0.72),rgba(0,0,0,0.72))]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="relative z-50 w-[900px] rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          {title && (
            <h3 id="modal-title" className="text-xl font-bold text-gray-900">
              {title}
            </h3>
          )}
          {/* Close Button ("X") */}
          <button
            onClick={onClose}
            className="text-2xl text-gray-500 transition-colors hover:text-gray-800"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="mt-4">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal