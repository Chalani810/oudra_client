import React from 'react';
import NewEvent from "../component/AdminEvent/NewEvent";

const AddEvent = () => {
  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mt-10">Add Event</h1>
      <form className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mt-6">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Event Name:
          </label>
          <input
            type="text"
            name="eventName"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Save
        </button>
      </form>

      {/* Render the NewEvent component below */}
      <NewEvent />
    </div>
  );
};

export default AddEvent;
