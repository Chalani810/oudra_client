import React from "react";
import { FaCamera, FaEdit, FaTrash } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";

const EventTable = ({ events, handleEdit, handleDeleteRequest }) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl shadow-sm bg-white">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-red-100 text-left border-b border-red-200">
            <th className="p-4 text-left font-medium">Photo</th>
            <th className="p-4 text-left font-medium">Event</th>
            <th className="p-4 text-left font-medium">Description</th>
            <th className="p-4 font-medium text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, idx) => (
            <tr
              key={event._id || idx}
              className="border-b last:border-b-0 hover:bg-gray-50 transition-all"
            >
              <td className="p-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {event.photoUrl ? (
                    <img
                      src={event.photoUrl}
                      alt={event.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <FaCamera className="text-gray-400" />
                  )}
                </div>
              </td>
              <td className="p-4 font-medium text-gray-800">{event.title}</td>
              <td className="p-4 text-gray-700">
                {event.description || "No description"}
              </td>
              <td className="p-4 text-center">
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => handleEdit(event)}
                    className="text-blue-500 hover:text-blue-700"
                    aria-label="Edit event"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteRequest(event._id)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Delete event"
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {events.length === 0 && (
        <div className="w-full text-center p-8">
          <p className="text-gray-500">No events found</p>
        </div>
      )}
    </div>
  );
};

export default EventTable;