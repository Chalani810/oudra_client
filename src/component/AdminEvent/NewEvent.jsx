// src/components/AddEventModal.jsx
import React, { useState } from "react";

const AddEventModal = ({ isOpen, onClose, onSave }) => {
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

  // Handle file upload
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  // Handle Save Button
  const handleSave = () => {
    const newEvent = {
      id: Date.now(),
      name: eventName,
      description,
      images,
    };
    onSave(newEvent);  // Send event data to parent
    onClose();         // Close modal after save
  };

  if (!isOpen) return null; // If modal is not open, don't render anything

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      {/* Modal Box */}
      <div className="bg-white p-8 rounded-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Event Information</h2>

        {/* Images Upload */}
        <div className="mb-4">
          <label className="block mb-2">Images</label>
          <div className="flex gap-2">
            {[...Array(4)].map((_, idx) => (
              <label
                key={idx}
                className="w-20 h-20 border flex items-center justify-center rounded cursor-pointer"
              >
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                  accept="image/*"
                />
                📷
              </label>
            ))}
          </div>
        </div>

        {/* Event Name */}
        <div className="mb-4">
          <label className="block mb-1">First Name</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="Event Name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
        </div>

        {/* Event Description */}
        <div className="mb-4">
          <label className="block mb-1">Description</label>
          <textarea
            className="w-full border p-2 rounded"
            rows="4"
            placeholder="Event Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            className="border px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-black text-white px-4 py-2 rounded"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEventModal;
