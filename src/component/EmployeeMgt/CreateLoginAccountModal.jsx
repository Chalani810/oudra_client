// oudra-client/src/components/EmployeeMgt/CreateLoginAccountModal.jsx
// NEW FILE — Modal that appears when manager clicks "Create Login Account"
// on an employee row. Calls POST /auth/create-account and shows the
// generated credentials so the manager can share them with the field worker.

import React, { useState, useEffect } from "react";
import { X, UserPlus, Mail, Key, CheckCircle, AlertCircle, Copy, Check } from "lucide-react";
import { employeeService } from "../../services/employeeService";

const CreateLoginAccountModal = ({ isOpen, onClose, employee }) => {
  const [status, setStatus]           = useState("idle");   // idle | checking | creating | success | error | already_exists
  const [credentials, setCredentials] = useState(null);     // { email, tempPassword }
  const [errorMessage, setErrorMessage] = useState("");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);

  // Reset state every time modal opens for a new employee
  useEffect(() => {
    if (isOpen) {
      setStatus("idle");
      setCredentials(null);
      setErrorMessage("");
      setCopiedEmail(false);
      setCopiedPassword(false);
    }
  }, [isOpen, employee?._id]);

  if (!isOpen || !employee) return null;

  // ── Copy to clipboard helper ──────────────────────────────────────────────
  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "email") {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      } else {
        setCopiedPassword(true);
        setTimeout(() => setCopiedPassword(false), 2000);
      }
    } catch {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
  };

  // ── Main action: check then create ───────────────────────────────────────
  const handleCreate = async () => {
    setStatus("checking");
    setErrorMessage("");

    try {
      // Step 1: Check if account already exists
      const { exists } = await employeeService.checkLoginAccount(employee.email);
      if (exists) {
        setStatus("already_exists");
        return;
      }

      // Step 2: Create the login account
      setStatus("creating");
      const response = await employeeService.createLoginAccount(employee._id);

      setCredentials({
        email:        response.credentials.email,
        tempPassword: response.credentials.tempPassword,
      });
      setStatus("success");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create login account. Please try again.";
      // Handle duplicate detected by backend
      if (msg.toLowerCase().includes("already exists")) {
        setStatus("already_exists");
      } else {
        setErrorMessage(msg);
        setStatus("error");
      }
    }
  };

  // ── Render helpers ────────────────────────────────────────────────────────
  const renderIdle = () => (
    <div className="space-y-4">
      {/* Employee summary card */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <img
          src={employee.profileImg || "https://via.placeholder.com/48"}
          alt={employee.name}
          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
        />
        <div>
          <p className="font-semibold text-gray-800">{employee.name}</p>
          <p className="text-sm text-gray-500">{employee.empId}</p>
          <p className="text-sm text-gray-500">{employee.email}</p>
        </div>
      </div>

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <UserPlus size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">What will happen:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>A login account will be created for this field worker</li>
              <li>A temporary password will be generated automatically</li>
              <li>The credentials will be emailed to <strong>{employee.email}</strong></li>
              <li>The credentials will also be shown here for you to share manually</li>
              <li>The field worker can reset their password using "Forgot Password" on the mobile app</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
        >
          Cancel
        </button>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
        >
          <UserPlus size={16} />
          Create Login Account
        </button>
      </div>
    </div>
  );

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center py-10 space-y-3">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
      <p className="text-gray-600 text-sm">
        {status === "checking" ? "Checking for existing account..." : "Creating login account..."}
      </p>
    </div>
  );

  const renderSuccess = () => (
    <div className="space-y-4">
      {/* Success banner */}
      <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
        <CheckCircle size={22} className="text-green-600 flex-shrink-0" />
        <div>
          <p className="font-semibold text-green-800">Login account created successfully!</p>
          <p className="text-sm text-green-700">
            Credentials have been emailed to <strong>{credentials.email}</strong>
          </p>
        </div>
      </div>

      {/* Credentials display */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
        <p className="text-sm font-semibold text-gray-700">
          Login Credentials — share these with the field worker:
        </p>

        {/* Email row */}
        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3">
          <Mail size={16} className="text-gray-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 mb-0.5">Email</p>
            <p className="text-sm font-medium text-gray-800 truncate">{credentials.email}</p>
          </div>
          <button
            onClick={() => copyToClipboard(credentials.email, "email")}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-green-600 transition-colors flex-shrink-0"
            title="Copy email"
          >
            {copiedEmail ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
            {copiedEmail ? "Copied" : "Copy"}
          </button>
        </div>

        {/* Password row */}
        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3">
          <Key size={16} className="text-gray-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 mb-0.5">Temporary Password</p>
            <p className="text-sm font-mono font-semibold text-gray-800 tracking-widest">
              {credentials.tempPassword}
            </p>
          </div>
          <button
            onClick={() => copyToClipboard(credentials.tempPassword, "password")}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-green-600 transition-colors flex-shrink-0"
            title="Copy password"
          >
            {copiedPassword ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
            {copiedPassword ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* Reminder */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <AlertCircle size={15} className="text-yellow-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-yellow-700">
            <strong>Remind the field worker</strong> to change their password after first login
            using <strong>Forgot Password</strong> on the mobile app.
          </p>
        </div>
      </div>

      <div className="flex justify-end pt-2 border-t">
        <button
          onClick={onClose}
          className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
        >
          Done
        </button>
      </div>
    </div>
  );

  const renderAlreadyExists = () => (
    <div className="space-y-4">
      <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <AlertCircle size={22} className="text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-yellow-800">Login account already exists</p>
          <p className="text-sm text-yellow-700 mt-1">
            A login account is already linked to <strong>{employee.email}</strong>. 
            If the field worker has forgotten their password, they can use 
            <strong> Forgot Password</strong> on the mobile app to reset it.
          </p>
        </div>
      </div>
      <div className="flex justify-end pt-2 border-t">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="space-y-4">
      <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
        <AlertCircle size={22} className="text-red-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-red-700">Failed to create login account</p>
          <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2 border-t">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
        >
          Cancel
        </button>
        <button
          onClick={() => setStatus("idle")}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <div className="flex items-center gap-2">
            <UserPlus size={20} className="text-green-600" />
            <h2 className="text-lg font-bold text-gray-800">Create Login Account</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            disabled={status === "checking" || status === "creating"}
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {(status === "idle")                              && renderIdle()}
          {(status === "checking" || status === "creating") && renderLoading()}
          {status === "success"                             && renderSuccess()}
          {status === "already_exists"                      && renderAlreadyExists()}
          {status === "error"                               && renderError()}
        </div>
      </div>
    </div>
  );
};

export default CreateLoginAccountModal;
