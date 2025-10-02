import React from "react";

// Function to return a badge based on status
export const getStatusBadge = (status) => {
  let colorClass = "";
  switch (status) {
    case "Pending":
      colorClass = "bg-yellow-200 text-yellow-800";
      break;
    case "Approved":
      colorClass = "bg-green-200 text-green-800";
      break;
    case "Rejected":
      colorClass = "bg-red-200 text-red-800";
      break;
    default:
      colorClass = "bg-gray-200 text-gray-800";
      break;
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
      {status}
    </span>
  );
};
