// oudra-client/src/components/EmployeeMgt/ViewEmployeeModal.jsx
import React from "react";
import { X, User, Mail, Phone, Calendar, CheckCircle, XCircle } from "lucide-react";

const ViewEmployeeModal = ({ isOpen, onClose, employee }) => {
  if (!isOpen || !employee) return null;

  return (
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
        <div className="p-6 space-y-6">
          {/* Profile */}
          <div className="flex flex-col items-center">
            <img
              src={employee.profileImg || "https://via.placeholder.com/128"}
              alt={employee.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-800">{employee.name}</h3>
            <p className="text-sm text-gray-500">Field Worker</p>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Mail size={18} className="text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{employee.email}</p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Phone size={18} className="text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{employee.phone}</p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Calendar size={18} className="text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Joined Date</p>
                <p className="font-medium">
                  {new Date(employee.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              {employee.isActive ? (
                <CheckCircle size={18} className="text-green-500 mr-3" />
              ) : (
                <XCircle size={18} className="text-red-500 mr-3" />
              )}
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    employee.isActive 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {employee.isActive ? "Active" : "Inactive"}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Login Account Status */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Login Account Status</h4>
            <p className="text-sm text-blue-600">
              No login account created yet. Create one from User Management section.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewEmployeeModal;