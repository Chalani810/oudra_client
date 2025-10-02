import React, { useState, useEffect } from "react";
import Sidebar from "../component/AdminEvent/Sidebar";
import { toast } from "react-hot-toast";
import axios from "axios";

const RoleSalaryConfig = () => {
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    basicSalary: 0,
    eventBonus: 0
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${apiUrl}/role/`);
        setRoles(response.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch roles");
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [apiUrl]);

  // Filter roles based on search query
  const filteredRoles = roles.filter(role => 
    role.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Validate form inputs
  const validateInput = (name, value) => {
    let error = "";
    
    if (value === "" || isNaN(value)) {
      error = "Please enter a valid number";
    } else if (value < 0) {
      error = "Value cannot be negative";
    } else if (!Number.isInteger(Number(value)) && name === "basicSalary") {
      error = "Basic salary should be a whole number";
    } else if (!Number.isInteger(Number(value)) && name === "eventBonus") {
      error = "Event bonus should be a whole number";
    } else if (value > 1000000) {
      error = "Value is too large";
    }

    return error;
  };


  // Handle edit click
  const handleEditClick = (role) => {
    setEditingRole(role._id);
    setFormData({
      basicSalary: role.basicSalary,
      eventBonus: role.eventBonus
    });
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value) || 0
    });
  };

  // Handle form submit
  const handleSubmit = async (roleId) => {
    try {
      const response = await axios.put(`${apiUrl}/role/${roleId}`, formData);
      setRoles(roles.map(role => 
        role._id === response.data.role._id ? response.data.role : role
      ));
      setEditingRole(null);
      toast.success("Role salary updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating salary role");
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingRole(null);
  };

  // Handle search input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 overflow-auto ml-0 md:ml-64 p-4">
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto ml-0 md:ml-64">
        <div className="p-4 md:p-6 lg:p-8">
          <div className="max-w-full mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h1 className="text-2xl font-semibold text-gray-800">
                Role Salary Configuration
              </h1>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
                  <input
                    type="text"
                    placeholder="Search roles..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="pl-4 pr-4 py-2 border border-gray-300 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Roles Table */}
            <div className="w-full overflow-x-auto rounded-xl shadow-sm bg-white">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-red-100 text-left border-b border-red-200">
                    <th className="p-4 text-left font-medium">Role Title</th>
                    <th className="p-4 text-right font-medium">Basic Salary (LKR)</th>
                    <th className="p-4 text-right font-medium">Per Event Rate (LKR)</th>
                    <th className="p-4 font-medium text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRoles.length > 0 ? (
                    filteredRoles.map((role) => (
                      <tr
                        key={role._id}
                        className="border-b last:border-b-0 hover:bg-white transition-all"
                      >
                        <td className="p-4 font-medium text-gray-800">
                          {role.title}
                        </td>
                        <td className="p-4 text-right text-gray-700">
                          {editingRole === role._id ? (
                            <input
                              type="number"
                              name="basicSalary"
                              value={formData.basicSalary}
                              onChange={handleInputChange}
                              className="w-32 p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                              min="0"
                              step="1000"
                            />
                          ) : (
                            `LKR ${role.basicSalary.toLocaleString()}`
                          )}
                        </td>
                        <td className="p-4 text-right text-gray-700">
                          {editingRole === role._id ? (
                            <input
                              type="number"
                              name="eventBonus"
                              value={formData.eventBonus}
                              onChange={handleInputChange}
                              className="w-32 p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                              min="0"
                              step="1000"
                            />
                          ) : (
                            `LKR ${role.eventBonus.toLocaleString()}`
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {editingRole === role._id ? (
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleSubmit(role._id)}
                                className="inline-flex items-center px-4 py-1.5 text-xs font-semibold rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-400"
                              >
                                Save
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="inline-flex items-center px-4 py-1.5 text-xs font-semibold rounded-lg shadow-sm text-gray-800 bg-gray-100 hover:bg-gray-200 focus:ring-2 focus:ring-gray-400"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleEditClick(role)}
                              className="inline-flex items-center px-4 py-1.5 text-xs font-semibold rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-400"
                            >
                              Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-gray-500">
                        {searchQuery ? "No matching roles found" : "No roles available"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Summary Section */}
            <div className="mt-8 bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Salary Configuration Guidelines</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Basic Salary: Fixed monthly amount in LKR for each role</li>
                <li>Per Event Rate: Additional payment in LKR per event worked</li>
                <li>Changes take effect immediately after saving</li>
                <li>All amounts should be entered in whole LKR (no decimals)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSalaryConfig;