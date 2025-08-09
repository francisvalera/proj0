"use client";

interface ConfirmOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmOrderModal({ isOpen, onClose, onConfirm }: ConfirmOrderModalProps) {
  if (!isOpen) return null;

  return (
    // Corrected: Used bg-black/50 for transparency and added a backdrop blur for a nicer effect.
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Confirm Your Order</h2>
        <p className="text-gray-600 mb-6">Are you sure you want to place this order?</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
}
