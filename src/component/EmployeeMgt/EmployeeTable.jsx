// oudra-client/src/components/EmployeeMgt/EmployeeTable.jsx
import React, { useState } from "react";
import { Eye, Edit, Trash2, Phone, Mail, User, RefreshCw } from "lucide-react";
import { employeeService } from "../../services/employeeService";
import EditEmployeeModal from "./EditEmployeeModal";
import ViewEmployeeModal from "./ViewEmployeeModal";

const EmployeeTable = ({ employees, loading, onRefresh }) => {
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [viewingEmployee, setViewingEmployee] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

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
    onRefresh?.(); // Refresh the table
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
        {/* Table Header with Refresh */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Field Workers ({employees.length})
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
              <th className="p-3 text-left font-medium">Joined Date</th>
              <th className="p-3 text-center font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((employee) => (
              <tr key={employee._id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-semibold">
                    {employee.empId}
                  </span>
                </td>
                
                <td className="p-3">
                  <img
                    src={employee.profileImg || "https://via.placeholder.com/40"}
                    alt={employee.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                  />
                </td>
                
                <td className="p-3">
                  <div className="font-medium text-gray-800">{employee.name}</div>
                  <div className="text-xs text-gray-500">Field Worker</div>
                </td>
                
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
                
                <td className="p-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    employee.isActive 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {employee.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                
                <td className="p-3 text-gray-600">
                  {new Date(employee.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </td>
                
                <td className="p-3">
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={() => handleView(employee)}
                      className="text-gray-600 hover:text-green-700 transition-colors p-1"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleEdit(employee)}
                      className="text-gray-600 hover:text-blue-700 transition-colors p-1"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(employee._id, employee.name)}
                      className="text-gray-600 hover:text-red-700 transition-colors p-1"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {employees.length === 0 && (
          <div className="text-center p-8 text-gray-500">
            <div className="mb-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-2">
                <User size={24} className="text-gray-400" />
              </div>
            </div>
            <p className="text-lg font-medium mb-2">No field workers found</p>
            <p className="text-sm">Click "Add Employee" to create your first field worker.</p>
          </div>
        )}
      </div>

      {/* Edit Employee Modal */}
      <EditEmployeeModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingEmployee(null);
        }}
        employee={editingEmployee}
        onSave={handleEditSave}
      />

      {/* View Employee Modal */}
      <ViewEmployeeModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewingEmployee(null);
        }}
        employee={viewingEmployee}
      />
    </>
  );
};

export default EmployeeTable;