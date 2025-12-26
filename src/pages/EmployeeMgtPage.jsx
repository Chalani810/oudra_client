// oudra-client/src/pages/EmployeeMgtPage.jsx
import React, { useState, useEffect } from "react";
import EmployeeMgtTopBar from "../component/EmployeeMgt/EmployeeMgtTopBar";
import EmployeeTable from "../component/EmployeeMgt/EmployeeTable";
import { employeeService } from "../services/employeeService";

const EmployeeMgtPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchEmployees();
  }, [refreshTrigger]);

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

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleEmployeeAdded = () => {
    handleRefresh();
  };

  const handleSearch = (searchTerm) => {
    // Implement search functionality
    console.log("Search term:", searchTerm);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-64 overflow-auto">
        
        {/* Top bar */}
        <EmployeeMgtTopBar 
          onEmployeeAdded={handleEmployeeAdded}
          onSearch={handleSearch}
        />

        <div className="p-6">
          <div className="bg-white rounded-xl shadow-sm">
            <EmployeeTable 
              employees={employees} 
              loading={loading}
              onRefresh={handleRefresh}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeMgtPage;