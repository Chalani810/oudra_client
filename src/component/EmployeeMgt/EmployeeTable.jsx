// oudra-client/src/components/EmployeeMgt/EmployeeTable.jsx
//  1. Added "Login Account" column to the table showing account status badge
//  2. Added "Create Login Account" button (UserPlus icon) in the Actions column
//  3. Added CreateLoginAccountModal import and state management
//  4. Added loginAccountStatuses state — fetched once on mount/refresh to show
//     which employees already have login accounts (green badge vs grey badge)
//  5. All existing View / Edit / Delete functionality unchanged

import React, { useState, useEffect } from "react";
import { Eye, Edit, Trash2, Phone, Mail, User, RefreshCw, UserPlus, UserCheck } from "lucide-react";
import { employeeService } from "../../services/employeeService";
import EditEmployeeModal from "./EditEmployeeModal";
import ViewEmployeeModal from "./ViewEmployeeModal";
import CreateLoginAccountModal from "./CreateLoginAccountModal";

const EmployeeTable = ({ employees, loading, onRefresh, totalCount }) => {
  const [editingEmployee,  setEditingEmployee]  = useState(null);
  const [viewingEmployee,  setViewingEmployee]  = useState(null);
  const [loginEmployee,    setLoginEmployee]    = useState(null);   // NEW
  const [isEditModalOpen,  setIsEditModalOpen]  = useState(false);
  const [isViewModalOpen,  setIsViewModalOpen]  = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);  // NEW

  // NEW: Map of email → true/false indicating if a login account exists
  const [loginAccountStatuses, setLoginAccountStatuses] = useState({});
  const [checkingStatuses, setCheckingStatuses] = useState(false);

  // Check login account status for all employees whenever the list changes
  useEffect(() => {
    if (employees.length === 0) return;
    checkAllLoginStatuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employees]);

  const checkAllLoginStatuses = async () => {
    setCheckingStatuses(true);
    try {
      // Check each employee's email concurrently
      const results = await Promise.all(
        employees.map(async (emp) => {
          const { exists } = await employeeService.checkLoginAccount(emp.email);
          return { email: emp.email, exists };
        })
      );
      const statusMap = {};
      results.forEach(({ email, exists }) => {
        statusMap[email] = exists;
      });
      setLoginAccountStatuses(statusMap);
    } catch (err) {
      console.error("Error checking login statuses:", err);
    } finally {
      setCheckingStatuses(false);
    }
  };

  const handleDelete = async (employeeId, employeeName) => {
    if (window.confirm(`Are you sure you want to delete "${employeeName}"? This action cannot be undone.`)) {
      try {
        await employeeService.deleteEmployee(employeeId);
        alert("Employee deleted successfully");
        onRefresh?.();
      } catch (error) {
        console.error("Error deleting employee:", error);
        alert("Failed to delete employee. Please try again.");
      }
    }
  };

  const handleView = (employee) => {
    setViewingEmployee(employee);
    setIsViewModalOpen(true);
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleEditSave = () => {
    setIsEditModalOpen(false);
    setEditingEmployee(null);
    onRefresh?.();
  };

  // NEW: Open the Create Login Account modal for a specific employee
  const handleCreateLogin = (employee) => {
    setLoginEmployee(employee);
    setIsLoginModalOpen(true);
  };

  // NEW: Called when the login modal closes — re-check statuses to update badges
  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
    setLoginEmployee(null);
    checkAllLoginStatuses();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto w-full bg-white rounded-xl shadow-sm">
        {/* Table Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
  Field Workers ({employees.length}
  {totalCount !== undefined && employees.length !== totalCount && (
    <span className="text-gray-400 font-normal text-sm"> of {totalCount} total</span>
  )}
  )
</h2>
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3 text-left font-medium">Employee ID</th>
              <th className="p-3 text-left font-medium">Profile</th>
              <th className="p-3 text-left font-medium">Name</th>
              <th className="p-3 text-left font-medium">Contact</th>
              <th className="p-3 text-left font-medium">Status</th>
              <th className="p-3 text-left font-medium">Login Account</th>  {/* NEW COLUMN */}
              <th className="p-3 text-left font-medium">Joined Date</th>
              <th className="p-3 text-center font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((employee) => {
              const hasLoginAccount = loginAccountStatuses[employee.email];

              return (
                <tr key={employee._id} className="border-b hover:bg-gray-50">
                  {/* Employee ID */}
                  <td className="p-3 font-medium">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-semibold">
                      {employee.empId}
                    </span>
                  </td>

                  {/* Profile Image */}
                  <td className="p-3">
                    <img
                      src={employee.profileImg || "https://via.placeholder.com/40"}
                      alt={employee.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                    />
                  </td>

                  {/* Name */}
                  <td className="p-3">
                    <div className="font-medium text-gray-800">{employee.name}</div>
                    <div className="text-xs text-gray-500">Field Worker</div>
                  </td>

                  {/* Contact */}
                  <td className="p-3">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center gap-1">
                        <Mail size={12} className="text-gray-400" />
                        <span className="text-xs text-gray-600 truncate max-w-[120px]">
                          {employee.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone size={12} className="text-gray-400" />
                        <span className="text-xs text-gray-600">{employee.phone}</span>
                      </div>
                    </div>
                  </td>

                  {/* Active Status */}
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      employee.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {employee.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* NEW: Login Account Status badge */}
                  <td className="p-3">
                    {checkingStatuses ? (
                      <div className="animate-pulse h-5 w-20 bg-gray-200 rounded-full" />
                    ) : hasLoginAccount ? (
                      <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold w-fit">
                        <UserCheck size={12} />
                        Created
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium w-fit">
                        <User size={12} />
                        Not created
                      </span>
                    )}
                  </td>

                  {/* Joined Date */}
                  <td className="p-3 text-gray-600">
                    {new Date(employee.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>

                  {/* Actions */}
                  <td className="p-3">
                    <div className="flex justify-center items-center space-x-2">
                      {/* View */}
                      <button
                        onClick={() => handleView(employee)}
                        className="text-gray-600 hover:text-green-700 transition-colors p-1"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => handleEdit(employee)}
                        className="text-gray-600 hover:text-blue-700 transition-colors p-1"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(employee._id, employee.name)}
                        className="text-gray-600 hover:text-red-700 transition-colors p-1"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>

                      {/* NEW: Create Login Account — only shown if no account yet */}
                      {!checkingStatuses && !hasLoginAccount && (
                        <button
                          onClick={() => handleCreateLogin(employee)}
                          className="text-gray-600 hover:text-purple-700 transition-colors p-1"
                          title="Create Login Account"
                        >
                          <UserPlus size={18} />
                        </button>
                      )}

                      {/* Already has account indicator */}
                      {!checkingStatuses && hasLoginAccount && (
                        <span
                          className="text-green-500 p-1 cursor-default"
                          title="Login account already created"
                        >
                          <UserCheck size={18} />
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {employees.length === 0 && (totalCount === undefined || totalCount === 0) && (
  <div className="text-center p-8 text-gray-500">
    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-2">
      <User size={24} className="text-gray-400" />
    </div>
    <p className="text-lg font-medium mb-2">No field workers found</p>
    <p className="text-sm">Click "Add Employee" to create your first field worker.</p>
  </div>
)}

{employees.length === 0 && totalCount > 0 && (
  <div className="text-center p-8 text-gray-500">
    <p className="text-lg font-medium mb-2">No employees match your filters</p>
    <p className="text-sm">Try adjusting or clearing the filters above.</p>
  </div>
)}
      </div>

      {/* Edit Employee Modal — unchanged */}
      <EditEmployeeModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingEmployee(null);
        }}
        employee={editingEmployee}
        onSave={handleEditSave}
      />

      {/* View Employee Modal — unchanged */}
      <ViewEmployeeModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewingEmployee(null);
        }}
        employee={viewingEmployee}
      />

      {/* NEW: Create Login Account Modal */}
      <CreateLoginAccountModal
        isOpen={isLoginModalOpen}
        onClose={handleLoginModalClose}
        employee={loginEmployee}
      />
    </>
  );
};

export default EmployeeTable;
