import React, { useState, useEffect } from "react";
import Sidebar from "../component/AdminEvent/Sidebar";
import AddEmployeeModel from "../component/Employee/AddEmployeeModel";
import ConfirmationModal from "../component/ConfirmationModal";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaEye, FaEdit, FaTrash, FaUsers } from "react-icons/fa";

// Validation functions
const validateName = (name) => {
  const nameRegex = /^[A-Za-z\s'-]+$/;
  return nameRegex.test(name);
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10,15}$/; // Allows 10-15 digit phone numbers
  return phoneRegex.test(phone);
};

const validateRequired = (value) => {
  return value && value.toString().trim() !== '';
};

const EmployeeManagement = () => {
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [occupationOptions, setOccupationOptions] = useState([]);

  var toastId;

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${apiUrl}/employee/`);
      setEmployees(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setEmployees([]);
      toast.error("Failed to load employees. Please try again.");
    }
  };

  const fetchOccupations = async () => {
    try {
      const response = await axios.get(`${apiUrl}/role`);
      const options = response.data;
      setOccupationOptions(options);
    } catch (error) {
      console.error("Error fetching occupations:", error);
      toast.error("Failed to load occupations.");
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchOccupations();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.length === 0) {
      fetchEmployees();
      return;
    }

    const filtered = employees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(query) ||
        employee.email.toLowerCase().includes(query)
    );
    setEmployees(filtered);
  };

  const handleAddClick = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
    setActiveMenu(null);
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
    setActiveMenu(null);
  };

  const validateEmployeeData = (employee) => {
    // Validate all required fields
    if (!validateRequired(employee.name)) {
      toast.error("Name is required");
      return false;
    }

    if (!validateRequired(employee.email)) {
      toast.error("Email is required");
      return false;
    }

    if (!validateRequired(employee.phone)) {
      toast.error("Phone number is required");
      return false;
    }

    if (!validateRequired(employee.occupation)) {
      toast.error("Occupation is required");
      return false;
    }

    // Validate field formats
    if (!validateName(employee.name)) {
      toast.error("Name should contain only letters, spaces, hyphens, and apostrophes");
      return false;
    }

    if (!validateEmail(employee.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (!validatePhone(employee.phone)) {
      toast.error("Please enter a valid phone number (10-15 digits)");
      return false;
    }

    return true;
  };

  const handleSave = async (employee) => {
    // Validate employee data before saving
    if (!validateEmployeeData(employee)) {
      return;
    }

    try {
      toastId = toast.loading(
        editingEmployee ? "Updating employee..." : "Adding employee..."
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const formData = new FormData();
      formData.append("name", employee.name);
      formData.append("email", employee.email);
      formData.append("phone", employee.phone);
      formData.append(
        "occupation",
        employee.occupation?._id || employee.occupation
      );

      if (employee.file) {
        formData.append("profileImg", employee.file);
      }

      let response;

      if (editingEmployee) {
        response = await axios.put(
          `${apiUrl}/employee/${editingEmployee._id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        response = await axios.post(`${apiUrl}/employee/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      toast.success(editingEmployee ? "Employee updated!" : "Employee added!", {
        id: toastId,
      });

      fetchEmployees();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Action failed", {
        id: toastId,
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      toastId = toast.loading("Deleting employee...");
      await new Promise((resolve) => setTimeout(resolve, 500));
      await axios.delete(`${apiUrl}/employee/${id}`);
      fetchEmployees();
      setActiveMenu(null);
      setShowConfirmModal(false);
      toast.success("Employee deleted successfully!", { id: toastId });
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete employee", { id: toastId });
    }
  };

  const confirmDelete = (id) => {
    setEmployeeToDelete(id);
    setShowConfirmModal(true);
    setActiveMenu(null);
  };

  const toggleMenu = (id, e) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === id ? null : id);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveMenu(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto ml-0 md:ml-64">
        <div className="p-4 md:p-6 lg:p-8">
          <div className="max-w-full mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h1 className="text-2xl font-semibold text-gray-800">
                Employee Management
              </h1>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
                  <input
                    type="text"
                    placeholder="Search by name or email"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="pl-4 pr-4 py-2 border border-gray-300 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-sm whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                  onClick={handleAddClick}
                >
                  + Add Employee
                </button>
              </div>
            </div>

            {/* Table Container */}
            <div className="w-full overflow-x-auto rounded-xl shadow-sm bg-white">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-red-100 text-left border-b border-red-200">
                    <th className="p-4 text-left font-medium">Employee</th>
                    <th className="p-4 text-left font-medium hidden sm:table-cell">
                      Occupation
                    </th>
                    <th className="p-4 text-center font-medium">Status</th>
                    <th className="p-4 font-medium text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr
                      key={employee._id}
                      className="border-b last:border-b-0 hover:bg-gray-50 transition-all"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {employee.profileImg ? (
                            <img
                              src={employee.profileImg}
                              alt={employee.name}
                              className="h-10 w-10 rounded-full object-cover shadow-sm"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">
                              {getInitials(employee.name)}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-800">
                              {employee.name}
                            </p>
                            <p className="text-xs text-gray-500 sm:hidden">
                              {employee.occupation?.title || "Not specified"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-700 hidden sm:table-cell">
                        {employee.occupation?.title || "Not specified"}
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            employee.availability == 0
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {employee.availability == 0
                            ? "Assigned"
                            : "Available"}
                        </span>
                      </td>

                      <td className="px-4 py-3 flex justify-end md:justify-center gap-3">
                        <button
                          onClick={() => handleEdit(employee)}
                          className="text-black-600 hover:text-black-800"
                          title="Edit Order"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => confirmDelete(employee._id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete Order"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {employees.length === 0 && (
                <div className="w-full text-center p-8">
                  <p className="text-gray-500">No employees found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modals */}
        <AddEmployeeModel
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingEmployee(null);
          }}
          onSave={handleSave}
          employeeData={editingEmployee}
          occupationOptions={occupationOptions}
          key={
            isModalOpen
              ? editingEmployee
                ? `edit-${editingEmployee._id}`
                : "add"
              : "closed"
          }
        />

        <ConfirmationModal
          isOpen={showConfirmModal}
          onCancel={() => setShowConfirmModal(false)}
          onConfirm={() => handleDelete(employeeToDelete)}
        />
      </div>
    </div>
  );
};

export default EmployeeManagement;