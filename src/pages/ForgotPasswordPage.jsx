// oudra_client/src/pages/ForgotPasswordPage.jsx
// Minimal changes from Glimmer version — same API endpoint, updated UI copy only.

import React, { useState } from "react";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ForgotPasswordPage = () => {
  const [email, setEmail]     = useState("");
  const [message, setMessage] = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value.trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/auth/forgot-password`, {
        email: email.trim().toLowerCase(),
      });
      setMessage(response.data.message);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">
          Forgot Password
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your registered email address and we'll send you a reset link.
        </p>

        {message && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded border border-green-200">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded border border-red-200">
            {error}
          </div>
        )}

        {!submitted && (
          <form onSubmit={handleSubmit} noValidate>
            <label className="block text-sm font-semibold mb-1" htmlFor="reset-email">
              Email Address
            </label>
            <input
              id="reset-email"
              type="email"
              placeholder="Enter your email address"
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <div className="text-center mt-4">
          <a href="/login" className="text-sm text-green-600 hover:underline">
            Back to Sign In
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
