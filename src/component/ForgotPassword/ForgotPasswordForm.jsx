import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${apiUrl}/auth/forgot-password`, { email });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-600 p-4"> {/* Changed background to red */}
      <div className="w-full max-w-lg bg-white p-10 rounded-xl shadow-2xl"> {/* Increased width and padding */}
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Reset Password</h2> {/* Larger text */}
        {message && (
          <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg text-lg"> {/* Larger message box */}
            {message}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg text-lg"> {/* Larger error box */}
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-6"> {/* Increased margin */}
            <label className="block text-gray-700 text-lg font-semibold mb-3" htmlFor="email"> {/* Larger label */}
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email address"
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 transition-colors duration-300"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        <div className="mt-6 text-center"> {/* Increased margin */}
          <button
            onClick={() => navigate('/signin')}
            className="text-red-600 hover:text-red-800 text-lg font-medium hover:underline transition-colors duration-300"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;