import React from "react";

const CustomerModal = ({ customer, onClose }) => {
  const getStatusClasses = (isActive) => {
    return isActive 
      ? "bg-green-100 text-green-700 border border-green-300" 
      : "bg-red-100 text-red-700 border border-red-300";
  };

  const getHeadingClasses = (isActive) => {
    return isActive ? "text-green-700" : "text-red-700";
  };

  const statusClasses = getStatusClasses(customer.isActive);
  const headingClasses = getHeadingClasses(customer.isActive);

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-start justify-center z-50 overflow-y-auto py-8 transition-all"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl my-8 mx-4 overflow-hidden border border-gray-100">
        {/* Header - Sticky with subtle gradient */}
        <div className="sticky top-0 bg-gradient-to-b from-white to-white/90 z-10 px-6 py-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-semibold text-gray-800">
              Customer Details
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(100vh-12rem)] space-y-6">
          {/* Customer Status Section */}
          <div className="bg-gray-50 rounded-lg p-5">
            <h4 className={`text-lg font-medium text-gray-700 mb-4 flex items-center`}>
              <svg
                className="w-5 h-5 mr-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Account Status
            </h4>
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${statusClasses}`}>
              <span
                className={`w-2 h-2 rounded-full mr-2 ${statusClasses.replace(
                  "bg-opacity-10",
                  ""
                )}`}
              ></span>
              {customer.isActive ? "Active" : "Inactive"}
            </div>
          </div>

          {/* Customer Information Section */}
          <div className="bg-gray-50 rounded-lg p-5">
            <h4 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Personal Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <p className="text-gray-600">
                  <span className="font-medium text-gray-700">Customer ID:</span>{" "}
                  <span className="text-gray-800">
                    {customer.userId || "N/A"}
                  </span>
                </p>
                <p className="text-gray-600">
                  <span className="font-medium text-gray-700">Name:</span>{" "}
                  <span className="text-gray-800">
                    {customer.firstName} {customer.lastName}
                  </span>
                </p>
                <p className="text-gray-600">
                  <span className="font-medium text-gray-700">Email:</span>{" "}
                  <span className="text-gray-800 break-all">{customer.email}</span>
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-gray-600">
                  <span className="font-medium text-gray-700">Loyalty Points:</span>{" "}
                  <span className="text-gray-800">
                    {customer.loyaltyPoints || 0}
                  </span>
                </p>
                <p className="text-gray-600">
                  <span className="font-medium text-gray-700">Date Registered:</span>{" "}
                  <span className="text-gray-800">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </span>
                </p>
                <p className="text-gray-600">
                  <span className="font-medium text-gray-700">Last Updated:</span>{" "}
                  <span className="text-gray-800">
                    {new Date(customer.updatedAt).toLocaleDateString()}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Address Information Section */}
          <div className="bg-gray-50 rounded-lg p-5">
            <h4 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Address Information
            </h4>
            {customer.address ? (
              <div className="space-y-3">
                <p className="text-gray-600">
                  <span className="font-medium text-gray-700">Street:</span>{" "}
                  <span className="text-gray-800">
                    {customer.address.street || "Not provided"}
                  </span>
                </p>
                <p className="text-gray-600">
                  <span className="font-medium text-gray-700">City:</span>{" "}
                  <span className="text-gray-800">
                    {customer.address.city || "Not provided"}
                  </span>
                </p>
                <p className="text-gray-600">
                  <span className="font-medium text-gray-700">Postal Code:</span>{" "}
                  <span className="text-gray-800">
                    {customer.address.postalCode || "Not provided"}
                  </span>
                </p>
                <p className="text-gray-600">
                  <span className="font-medium text-gray-700">Country:</span>{" "}
                  <span className="text-gray-800">
                    {customer.address.country || "Not provided"}
                  </span>
                </p>
              </div>
            ) : (
              <p className="text-gray-500 italic">No address information available</p>
            )}
          </div>

          {/* Profile Picture Section */}
          {customer.profilePicture && (
            <div className="bg-gray-50 rounded-lg p-5">
              <h4 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Profile Picture
              </h4>
              <div className="flex justify-center">
                <img
                  src={`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/uploads/${customer.profilePicture}`}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/path-to-default-profile.jpg";
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerModal;