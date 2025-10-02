import React from "react";

const ConfirmationModal = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg text-center">
        <div className="text-red-500 text-3xl mb-3">⚠️</div>
        <h2 className="text-lg font-bold mb-2">Are you sure?</h2>
        <p className="text-gray-600 mb-6">
          Deleting items from this directory cannot be undone.
        </p>
        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 border rounded hover:bg-gray-100"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => onConfirm()} // Ensure the function is correctly called
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
export default ConfirmationModal;
