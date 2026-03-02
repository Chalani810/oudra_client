// oudra-client/src/components/EmployeeMgt/ViewEmployeeModal.jsx
//  1. Login Account Status section now dynamically checks if an account exists
//     by calling employeeService.checkLoginAccount() when the modal opens
//  2. Shows "Account Created ✓" or "Not Created" with appropriate colours
//  3. If not created, shows a "Create Login Account" button that opens
//     CreateLoginAccountModal directly from the view modal
//  4. All other sections (profile, email, phone, date, status) unchanged

import React, { useState, useEffect } from "react";
import {
  X,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  UserCheck,
  UserPlus,
  User,
} from "lucide-react";
import { employeeService } from "../../services/employeeService";
import CreateLoginAccountModal from "./CreateLoginAccountModal";

const ViewEmployeeModal = ({ isOpen, onClose, employee }) => {
  const [loginStatus, setLoginStatus]         = useState("loading"); // loading | exists | not_exists
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Check login account status whenever this modal opens
  useEffect(() => {
    if (isOpen && employee) {
      setLoginStatus("loading");
      employeeService
        .checkLoginAccount(employee.email)
        .then(({ exists }) => setLoginStatus(exists ? "exists" : "not_exists"))
        .catch(() => setLoginStatus("not_exists"));
    }
  }, [isOpen, employee]);

  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
    // Re-check status after modal closes (account may have just been created)
    if (employee) {
      setLoginStatus("loading");
      employeeService
        .checkLoginAccount(employee.email)
        .then(({ exists }) => setLoginStatus(exists ? "exists" : "not_exists"))
        .catch(() => setLoginStatus("not_exists"));
    }
  };

  if (!isOpen || !employee) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-md">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Field Worker Details</h2>
              <p className="text-sm text-gray-500">Employee ID: {employee.empId}</p>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            {/* Profile */}
            <div className="flex flex-col items-center">
              <img
                src={employee.profileImg || "https://via.placeholder.com/128"}
                alt={employee.name}
                className="w-28 h-28 rounded-full object-cover border-4 border-gray-200 mb-3"
              />
              <h3 className="text-lg font-semibold text-gray-800">{employee.name}</h3>
              <p className="text-sm text-gray-500">Field Worker</p>
            </div>

            {/* Details */}
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Mail size={18} className="text-gray-500 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium text-sm">{employee.email}</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Phone size={18} className="text-gray-500 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-medium text-sm">{employee.phone}</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Calendar size={18} className="text-gray-500 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Joined Date</p>
                  <p className="font-medium text-sm">
                    {new Date(employee.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                {employee.isActive ? (
                  <CheckCircle size={18} className="text-green-500 mr-3 flex-shrink-0" />
                ) : (
                  <XCircle size={18} className="text-red-500 mr-3 flex-shrink-0" />
                )}
                <div>
                  <p className="text-xs text-gray-500">Employment Status</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    employee.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {employee.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            {/* Login Account Status — UPDATED */}
            {loginStatus === "loading" && (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-b-2 border-gray-400 rounded-full" />
                  <p className="text-sm text-gray-500">Checking login account status...</p>
                </div>
              </div>
            )}

            {loginStatus === "exists" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <UserCheck size={20} className="text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-green-800">Login Account Active</p>
                    <p className="text-xs text-green-700 mt-0.5">
                      This field worker can log in to the mobile app using their email and password.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {loginStatus === "not_exists" && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <User size={20} className="text-orange-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-orange-800">No Login Account Yet</p>
                    <p className="text-xs text-orange-700 mt-0.5">
                      This field worker cannot log in to the mobile app until a login account is created.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex items-center gap-2 w-full justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <UserPlus size={16} />
                  Create Login Account
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Create Login Account Modal — can be triggered from here too */}
      <CreateLoginAccountModal
        isOpen={isLoginModalOpen}
        onClose={handleLoginModalClose}
        employee={employee}
      />
    </>
  );
};

export default ViewEmployeeModal;
