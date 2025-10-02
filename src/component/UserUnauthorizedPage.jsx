// src/components/UnauthorizedPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = ({ userRole }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-5">
      <div className="text-center max-w-md p-10 bg-white rounded-xl shadow-md">
        {/* Warning Icon */}
        <div className="mx-auto w-16 h-16 text-red-500 mb-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Title and Message */}
        <h1 className="text-3xl font-bold text-gray-800 mb-3">403 - Access Denied</h1>
        <p className="text-lg text-gray-600 mb-2">
          {userRole === 'admin'
          ? "Use user account to access this page."
          : "You don't have sufficient privileges to access this page."}
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Please contact your administrator if you believe this is an error.
        </p>

        {/* Home Button */}
        {userRole === 'admin' ?
        <Link
          to="/dashboard"
          className="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Return to Dashboard
        </Link> :
        <Link
          to="/login"
          className="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Return to Login
        </Link>
        }
        
      </div>
    </div>
  );
};

export default UnauthorizedPage;