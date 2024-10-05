'use client';

import { Button } from '@/components/button';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <Button
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg"
          onClick={onClose}
        >
          Close
        </Button>
      </div>
    </div>
  );
}

export default Modal;
