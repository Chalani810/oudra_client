import React from "react";

const ResinTopbar = () => {
  return (
    <div className="flex items-center justify-between bg-white px-6 py-4 shadow-sm border-b border-gray-200">
      {/* Title Section */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">Resin Analysis & AI Insights</h2>
        <p className="text-sm text-gray-600 mt-1">
          Monitor and analyze resin productivity across new generations
        </p>
      </div>
    </div>
  );
};

export default ResinTopbar;