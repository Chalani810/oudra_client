// src/pages/IoTSensorData.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Eye, Trash2, RefreshCw, Filter } from "lucide-react";
import SidePanel from "../component/SidePanel";

export default function IotSensorData() {
  const [allData, setAllData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [selectedTreeId, setSelectedTreeId] = useState(null); 
  const [filter, setFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/sensor/all`);
      if (response.data.success) {
        setAllData(response.data.data);
      }
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatTime = (ts) => (ts ? new Date(ts).toLocaleString() : "N/A");

  // Get unique trees with latest data
  const uniqueTreesLatest = Object.values(
    allData.reduce((acc, current) => {
      if (!acc[current.treeId] || new Date(acc[current.treeId].recordedAt) < new Date(current.recordedAt)) {
        acc[current.treeId] = current;
      }
      return acc;
    }, {})
  ).filter(tree => {
    if (filter && !tree.treeId?.toLowerCase().includes(filter.toLowerCase())) {
      return false;
    }
    if (statusFilter && tree.overallStatus !== statusFilter) {
      return false;
    }
    return true;
  });

  // Data for History Modal
  const treeHistory = allData.filter(item => item.treeId === selectedTreeId);
  const latestForPopup = treeHistory[0];

  const statusColors = {
    Normal: "bg-green-100 text-green-800",
    Warning: "bg-yellow-100 text-yellow-800",
    Critical: "bg-red-100 text-red-800"
  };

  const handleSearch = (e) => {
    setFilter(e.target.value);
  };

  return (
    <div className="flex">
      <SidePanel />
      <main className="flex-1 ml-64 bg-gray-50 min-h-screen">
        <div className="p-6">
          {/* Header with breadcrumb */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">IoT Sensor Data</h1>
            
          </div>

          {/* Main Table Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Table Header with Search and Actions */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">
                IoT Sensor Data ({uniqueTreesLatest.length})
              </h2>
              
              <div className="flex items-center gap-2">
                {/* Filter Button */}
                <div className="relative">
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Filter size={16} />
                    Filter
                  </button>
                  
                  {showFilters && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border p-4 z-10">
                      <h3 className="font-semibold mb-3 text-gray-700">Filter by Status</h3>
                      <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full p-2 border rounded-md text-sm"
                      >
                        <option value="">All Status</option>
                        <option value="Normal">Normal</option>
                        <option value="Warning">Warning</option>
                        <option value="Critical">Critical</option>
                      </select>
                      <button 
                        onClick={() => {
                          setStatusFilter("");
                          setShowFilters(false);
                        }}
                        className="mt-3 w-full px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
                      >
                        Clear Filters
                      </button>
                    </div>
                  )}
                </div>

                {/* Refresh Button */}
                <button 
                  onClick={fetchData} 
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <RefreshCw size={16} />
                  Refresh
                </button>

                {/* Search Input */}
                <input 
                  type="text" 
                  placeholder="Search trees..." 
                  className="px-4 py-2 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-green-500 w-64"
                  value={filter}
                  onChange={handleSearch}
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-y">
                  <tr>
                    <th className="p-4 text-left font-medium text-gray-600">Tree ID</th>
                    <th className="p-4 text-left font-medium text-gray-600">Timestamp</th>
                    <th className="p-4 text-left font-medium text-gray-600">Temp</th>
                    <th className="p-4 text-left font-medium text-gray-600">Humidity</th>
                    <th className="p-4 text-left font-medium text-gray-600">pH</th>
                    <th className="p-4 text-left font-medium text-gray-600">Soil Moisture</th>
                    <th className="p-4 text-left font-medium text-gray-600">Overall Status</th>
                    <th className="p-4 text-center font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="p-8">
                        <div className="flex justify-center items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                        </div>
                      </td>
                    </tr>
                  ) : uniqueTreesLatest.length > 0 ? (
                    uniqueTreesLatest.map((row) => (
                      <tr key={row._id} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-medium">{row.treeId}</td>
                        <td className="p-4 text-gray-500">{formatTime(row.recordedAt)}</td>
                        <td className="p-4">{row.temperature}°C</td>
                        <td className="p-4">{row.humidity}%</td>
                        <td className="p-4 font-medium text-blue-600">
                          {row.soilPh && row.soilPh !== 0 ? row.soilPh : "Add"}
                        </td>
                        <td className="p-4">{row.soilMoisture}%</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[row.overallStatus] || "bg-gray-100 text-gray-800"}`}>
                            {row.overallStatus}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center space-x-3">
                            <button 
                              onClick={() => setSelectedTreeId(row.treeId)} 
                              className="text-gray-600 hover:text-green-600 transition-colors"
                              title="View History"
                            >
                              <Eye size={18} />
                            </button>
                            <button 
                              onClick={() => {
                                if (window.confirm("Are you sure you want to delete this sensor record?")) {
                                  setAllData(prev => prev.filter(t => t._id !== row._id));
                                }
                              }} 
                              className="text-gray-600 hover:text-red-600 transition-colors"
                              title="Delete Record"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="p-8 text-center text-gray-500">
                        No sensor data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer with total count */}
            {uniqueTreesLatest.length > 0 && (
              <div className="px-4 py-3 border-t text-sm text-gray-600">
                Showing {uniqueTreesLatest.length} of {Object.keys(allData.reduce((acc, curr) => ({...acc, [curr.treeId]: true}), {})).length} trees
              </div>
            )}
          </div>
        </div>

        {/* History Modal */}
        {selectedTreeId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Tree Log: {selectedTreeId}</h2>
                <button 
                  onClick={() => setSelectedTreeId(null)} 
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-xs text-green-600 font-medium">Latest Temp</p>
                  <p className="text-lg font-semibold">{latestForPopup?.temperature}°C</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-blue-600 font-medium">Latest Humidity</p>
                  <p className="text-lg font-semibold">{latestForPopup?.humidity}%</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-xs text-purple-600 font-medium">Latest pH</p>
                  <p className="text-lg font-semibold">
                    {latestForPopup?.soilPh && latestForPopup?.soilPh !== 0 ? latestForPopup.soilPh : "Add"}
                  </p>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg">
                  <p className="text-xs text-amber-600 font-medium">Latest Moisture</p>
                  <p className="text-lg font-semibold">{latestForPopup?.soilMoisture}%</p>
                </div>
              </div>

              <h3 className="font-semibold mb-3">Historical Data</h3>
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="p-3 text-left font-medium">Date & Time</th>
                      <th className="p-3 text-left font-medium">Temp</th>
                      <th className="p-3 text-left font-medium">Humidity</th>
                      <th className="p-3 text-left font-medium">pH</th>
                      <th className="p-3 text-left font-medium">Moisture</th>
                      <th className="p-3 text-left font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {treeHistory.map((h) => (
                      <tr key={h._id} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-gray-500">{formatTime(h.recordedAt)}</td>
                        <td className="p-3">{h.temperature}°C</td>
                        <td className="p-3">{h.humidity}%</td>
                        <td className="p-3 font-medium text-blue-600">
                          {h.soilPh && h.soilPh !== 0 ? h.soilPh : "Add"}
                        </td>
                        <td className="p-3">{h.soilMoisture}%</td>
                        <td className="p-3">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            h.overallStatus === 'Normal' ? 'bg-green-100 text-green-800' : 
                            h.overallStatus === 'Warning' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {h.overallStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button 
                  onClick={() => setSelectedTreeId(null)} 
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}