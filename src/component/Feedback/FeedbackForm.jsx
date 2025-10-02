import React from 'react';

const FeedbackForm = () => {
  return (
    <form className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">My Feedbacks</h2>
        <p className="text-sm text-gray-500 mt-1">
          Lorem ipsum dolor sit amet consectetur. Vivamus ac viverra neque...
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium">Name *</label>
        <input
          type="text"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          placeholder="Enter your full name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Email *</label>
        <input
          type="email"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          placeholder="Enter your email address"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Message</label>
        <textarea
          rows="4"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          placeholder="Write your message..."
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Ratings</label>
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-gray-400 text-xl cursor-pointer">★</span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Add Photos</label>
        <div className="flex space-x-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-16 h-16 border rounded flex justify-center items-center bg-gray-100 cursor-pointer">
              <i className="fas fa-camera text-gray-400"></i>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
      >
        Submit Feedback
      </button>
    </form>
  );
};

export default FeedbackForm;
