import React from "react";

const Popup = ({ closePopup, children }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">New Event</h2>
          <button
            onClick={closePopup}
            className="text-red-500 font-bold hover:text-red-700"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Popup;
