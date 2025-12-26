// oudra-client/src/components/EmployeeMgt/EmployeeMgtTopBar.jsx
import React, { useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
import AddEmployeeModal from "./AddEmployeeModal";
import { employeeService } from "../../services/employeeService";

const EmployeeMgtTopBar = ({ onEmployeeAdded, onSearch }) => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleSaveEmployee = async (employeeData) => {
    try {
      await employeeService.createEmployee(employeeData);
      setAddModalOpen(false);
      onEmployeeAdded?.();
      alert("Employee added successfully!");
    } catch (error) {
      console.error("Error saving employee:", error);
      alert("Failed to add employee");
    }
  };

  return (
    <>
      <div className="bg-white border-b p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Title and Add Button */}
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Employee Management</h1>
            <button
              onClick={() => setAddModalOpen(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={20} />
              Add Employee
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Filter Button */}
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter size={20} />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleSaveEmployee}
      />
    </>
  );
};

export default EmployeeMgtTopBar;