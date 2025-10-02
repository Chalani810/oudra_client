import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const PasswordResetSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-center">
      <div className="flex justify-center mb-4">
        <FaCheckCircle className="text-green-500 text-5xl" />
      </div>
      <h2 className="text-2xl font-bold mb-4">Password Reset Successful</h2>
      <p className="text-gray-600 mb-6">
        Your password has been successfully updated. You can now sign in with your new password.
      </p>
      <button
        onClick={() => navigate('/signin')}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Back to Sign In
      </button>
    </div>
  );
};

export default PasswordResetSuccess;

    

