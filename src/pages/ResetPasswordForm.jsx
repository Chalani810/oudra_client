// oudra_client/src/pages/ResetPasswordForm.jsx
//  1. Added confirmPassword field with client-side match validation
//  2. Updated API endpoint to POST /auth/reset-password (sends token, password, confirmPassword)
//  3. Password strength: min 8 characters enforced

import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ResetPasswordForm = () => {
  const { token }    = useParams();
  const navigate     = useNavigate();

  const [password, setPassword]               = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword]       = useState(false);
  const [message, setMessage]                 = useState("");
  const [error, setError]                     = useState("");
  const [loading, setLoading]                 = useState(false);
  const [success, setSuccess]                 = useState(false);

  const validate = () => {
    if (!password) {
      setError("Password is required.");
      return false;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return false;
    }
    if (!confirmPassword) {
      setError("Please confirm your password.");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!validate()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/auth/reset-password`, {
        token,
        password,
        confirmPassword,
      });
      setMessage(response.data.message);
      setSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => navigate("/login"), 3000);
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
          Reset Password
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your new password below.
        </p>

        {message && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded border border-green-200">
            {message} Redirecting to login…
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded border border-red-200">
            {error}
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} noValidate>
            {/* New Password */}
            <label className="block text-sm font-semibold mb-1" htmlFor="new-password">
              New Password
            </label>
            <div className="relative">
              <input
                id="new-password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 8 characters"
                className="w-full px-4 py-2 mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="text-xs text-gray-500">{showPassword ? "Hide" : "Show"}</span>
              </button>
            </div>
            {password && password.length < 8 && (
              <p className="text-xs text-orange-500 mb-3">
                Password must be at least 8 characters.
              </p>
            )}

            {/* Confirm Password */}
            <label className="block text-sm font-semibold mb-1 mt-3" htmlFor="confirm-password">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              placeholder="Re-enter your new password"
              className="w-full px-4 py-2 mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-red-500 mb-3">Passwords do not match.</p>
            )}
            {confirmPassword && password === confirmPassword && password.length >= 8 && (
              <p className="text-xs text-green-600 mb-3">✓ Passwords match</p>
            )}

            <button
              type="submit"
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Updating..." : "Reset Password"}
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

export default ResetPasswordForm;
