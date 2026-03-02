// oudra-client/src/pages/EmployeeMgtPage.jsx
// CHANGES FROM EXISTING:
//  1. Added searchTerm and filters state
//  2. Passes onSearch and onFilter handlers to EmployeeMgtTopBar
//  3. filteredEmployees computed here and passed to EmployeeTable
//  4. applyFilters handles name, empId, email, phone, isActive filtering

import React, { useState, useEffect } from "react";
import EmployeeMgtTopBar from "../component/EmployeeMgt/EmployeeMgtTopBar";
import EmployeeTable from "../component/EmployeeMgt/EmployeeTable";
import { employeeService } from "../services/employeeService";
import SidePanel from "../component/SidePanel";

const EmployeeMgtPage = () => {
  const [employees,     setEmployees]     = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [searchTerm,    setSearchTerm]    = useState("");
  const [filters,       setFilters]       = useState({});

  useEffect(() => { fetchEmployees(); }, [refreshTrigger]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeeService.getAllEmployees();
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      alert("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh     = () => setRefreshTrigger(prev => prev + 1);
  const handleEmployeeAdded = () => handleRefresh();

  // ── Apply filters + search client-side ─────────────────────────────────
  const applyFilters = (allEmployees) => {
    return allEmployees.filter(emp => {

      // Search term — matches name, empId, email, phone
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matches =
          emp.name?.toLowerCase().includes(term)  ||
          emp.empId?.toLowerCase().includes(term) ||
          emp.email?.toLowerCase().includes(term) ||
          emp.phone?.toLowerCase().includes(term);
        if (!matches) return false;
      }

      // Name (partial)
      if (filters.name) {
        if (!emp.name?.toLowerCase().includes(filters.name.toLowerCase())) return false;
      }

      // Employee ID (partial)
      if (filters.empId) {
        if (!emp.empId?.toLowerCase().includes(filters.empId.toLowerCase())) return false;
      }

      // Email (partial)
      if (filters.email) {
        if (!emp.email?.toLowerCase().includes(filters.email.toLowerCase())) return false;
      }

      // Phone (partial)
      if (filters.phone) {
        if (!emp.phone?.toLowerCase().includes(filters.phone.toLowerCase())) return false;
      }

      // Status (exact — stored as boolean, filter value is string "true"/"false")
      if (filters.isActive !== "" && filters.isActive !== undefined) {
        const filterActive = filters.isActive === "true";
        if (emp.isActive !== filterActive) return false;
      }

      return true;
    });
  };

  const filteredEmployees = applyFilters(employees);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidePanel />
      <div className="flex-1 ml-0 md:ml-64 overflow-auto">
        <EmployeeMgtTopBar
          onEmployeeAdded={handleEmployeeAdded}
          onSearch={setSearchTerm}
          onFilter={setFilters}
        />
        <div className="p-6">
          <div className="bg-white rounded-xl shadow-sm">
            <EmployeeTable
              employees={filteredEmployees}
              loading={loading}
              onRefresh={handleRefresh}
              totalCount={employees.length}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeMgtPage;