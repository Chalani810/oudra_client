import React, { useState, useEffect } from "react";
import Sidebar from "../component/AdminEvent/Sidebar";
import axios from "axios";
import { toast } from "react-hot-toast";

const SalaryView = () => {
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const [searchQuery, setSearchQuery] = useState("");
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState({});

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${apiUrl}/employee/`);
      setEmployees(response.data.data);
      setFilteredEmployees(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setEmployees([]);
      setFilteredEmployees([]);
      toast.error("Failed to load employees. Please try again.");
    }
  };
  const handleDownload = async () => {
    try {
      const response = await axios.get(`${apiUrl}/reports/employee`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "report.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download PDF");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.length === 0) {
      setFilteredEmployees(employees);
      return;
    }

    const filteredData = employees.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query)
    );

    setFilteredEmployees(filteredData);
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const calculateTotalSalary = (employee) => {
    if (!employee.occupation) return 0;
    return (
      employee.occupation.basicSalary +
      employee.occupation.eventBonus * employee.eventsCount
    );
  };

  const handlePaySalary = async (employee) => {
    setLoadingPayments((prev) => ({ ...prev, [employee._id]: true }));

    try {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      // Calculate salary components
      const basicSalary = employee.occupation?.basicSalary || 0;
      const handledEvents = employee.eventsCount || 0;
      const eventBonus = employee.occupation?.eventBonus || 0;
      const totalSalary = basicSalary + eventBonus * handledEvents;

      // Create salary record via API
      const response = await axios.post(`${apiUrl}/salary`, {
        employeeId: employee._id,
        year,
        month,
        basicSalary,
        handledEvents,
        eventBonus,
        totalSalary,
      });

      
      await fetchEmployees();

      toast.success("Salary paid successfully!");
    } catch (error) {
      console.error("Error paying salary:", error);
      toast.error(error.response?.data?.message || "Failed to process payment");
    } finally {
      setLoadingPayments((prev) => ({ ...prev, [employee._id]: false }));
    }
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
                Salary Information
              </h1>
              <div className="flex gap-4">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-400"
                >
                  Export
                </button>
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
                </div>
              </div>
            </div>

            <div className="w-full overflow-x-auto rounded-xl shadow-sm bg-white">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-red-100 text-left border-b border-red-200">
                    <th className="p-4 text-left font-medium">Employee</th>
                    <th className="p-4 text-left font-medium">Basic Salary</th>
                    <th className="p-4 text-center font-medium">
                      Events Handled
                    </th>
                    <th className="p-4 text-right font-medium">
                      Per Event Rate
                    </th>
                    <th className="p-4 text-right font-medium">Total Salary</th>
                    <th className="p-4 font-medium text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b last:border-b-0 hover:bg-white transition-all"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {item.profileImg ? (
                            <img
                              src={item.profileImg}
                              alt={item.name}
                              className="h-10 w-10 rounded-full object-cover shadow-sm"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">
                              {getInitials(item.name)}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-800">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500 sm:hidden">
                              {item.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-700">
                        LKR{" "}
                        {item.occupation?.basicSalary?.toLocaleString() || "0"}
                      </td>
                      <td className="p-4 text-center text-gray-700">
                        {item.eventsCount}
                      </td>
                      <td className="p-4 text-right text-gray-700">
                        LKR{" "}
                        {item.occupation?.eventBonus?.toLocaleString() || "0"}
                      </td>
                      <td className="p-4 text-right text-gray-800 font-semibold">
                        LKR {calculateTotalSalary(item).toLocaleString()}
                      </td>
                      <td className="p-4 text-center">
                        {item.salaryPaid ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                            Paid
                            {item.lastPaymentDate && (
                              <span className="ml-1 text-xs text-green-600">
                                (
                                {new Date(
                                  item.lastPaymentDate
                                ).toLocaleDateString("en-GB")}
                                )
                              </span>
                            )}
                          </span>
                        ) : (
                          <button
                            onClick={() => handlePaySalary(item)}
                            disabled={loadingPayments[item._id]}
                            className={`inline-flex items-center px-4 py-1.5 text-xs font-semibold rounded-lg shadow-sm text-white ${
                              loadingPayments[item._id]
                                ? "bg-red-400"
                                : "bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-400"
                            }`}
                          >
                            {loadingPayments[item._id] ? (
                              <>
                                <svg
                                  className="animate-spin -ml-1 mr-1 h-3 w-3 text-white"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                Processing
                              </>
                            ) : (
                              "Pay Now"
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredEmployees.length === 0 && (
                <div className="w-full text-center p-8">
                  <p className="text-gray-500">No results found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryView;
