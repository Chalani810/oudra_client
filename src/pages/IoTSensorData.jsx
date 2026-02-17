import React, { useState, useEffect } from "react";
import axios from "axios";

export default function IotSensorData() {
  const [allData, setAllData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [selectedTreeId, setSelectedTreeId] = useState(null); 
  const [filter, setFilter] = useState("");

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

  // Filter: Latest record for each unique Tree ID
  const uniqueTreesLatest = Object.values(
    allData.reduce((acc, current) => {
      if (!acc[current.treeId]) acc[current.treeId] = current;
      return acc;
    }, {})
  ).filter(tree => tree.treeId?.toLowerCase().includes(filter.toLowerCase()));

  // Data for History Modal
  const treeHistory = allData.filter(item => item.treeId === selectedTreeId);
  const latestForPopup = treeHistory[0];

  return (
    <div className="min-h-screen bg-white p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-green-900">IoT Sensor Data Table</h1>
          
          <div className="flex items-center gap-2">
            <button onClick={fetchData} className="px-4 py-1.5 bg-green-600 text-white text-sm rounded-md font-semibold hover:bg-green-700 shadow-sm transition">Refresh</button>
            <button onClick={() => alert("Report generated.")} className="px-4 py-1.5 bg-indigo-600 text-white text-sm rounded-md font-semibold hover:bg-indigo-700 shadow-sm transition">Report</button>
            <input type="text" placeholder="Filter Tree ID..." className="px-3 py-1.5 border rounded-md text-sm outline-none focus:ring-1 focus:ring-green-500 w-40" onChange={(e) => setFilter(e.target.value)} />
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase">Tree ID</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase">Timestamp</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase">Temp</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase">Humidity</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase">pH</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase">Soil Moisture</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase">Overall Status</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="8" className="p-10 text-center text-gray-400">Loading...</td></tr>
              ) : uniqueTreesLatest.map((row) => (
                <tr key={row._id} className="hover:bg-green-50 transition-colors">
                  <td className="px-4 py-3 font-bold text-green-800">{row.treeId}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{formatTime(row.recordedAt)}</td>
                  <td className="px-4 py-3 text-sm">{row.temperature}°C</td>
                  <td className="px-4 py-3 text-sm">{row.humidity}%</td>
                  {/* Updated pH logic: If 0 or null, show N/A/Add */}
                  <td className="px-4 py-3 text-sm font-semibold text-blue-600">
                    {row.soilPh && row.soilPh !== 0 ? row.soilPh : "Add"}
                  </td>
                  <td className="px-4 py-3 text-sm">{row.soilMoisture}%</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      row.overallStatus === "Normal" ? "bg-green-100 text-green-700" :
                      row.overallStatus === "Warning" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                    }`}>
                      {row.overallStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-4">
                        <button onClick={() => setSelectedTreeId(row.treeId)} className="text-lg" title="View Detail/History">👁️</button>
                        <button onClick={() => setAllData(prev => prev.filter(t => t._id !== row._id))} className="text-lg" title="Delete">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* History Modal */}
      {selectedTreeId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b pb-2">
              <h2 className="text-xl font-bold text-green-900">Tree Log: {selectedTreeId}</h2>
              <button onClick={() => setSelectedTreeId(null)} className="text-gray-400 hover:text-black font-bold">✕ Close</button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                    <p className="text-xs text-green-600 font-bold uppercase tracking-tighter">Latest Temp</p>
                    <p className="text-xl font-bold">{latestForPopup?.temperature}°C</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <p className="text-xs text-blue-600 font-bold uppercase tracking-tighter">Latest Humidity</p>
                    <p className="text-xl font-bold">{latestForPopup?.humidity}%</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                    <p className="text-xs text-purple-600 font-bold uppercase tracking-tighter">Latest pH</p>
                    <p className="text-xl font-bold">
                      {latestForPopup?.soilPh && latestForPopup?.soilPh !== 0 ? latestForPopup.soilPh : "Add"}
                    </p>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                    <p className="text-xs text-amber-600 font-bold uppercase tracking-tighter">Latest Moisture</p>
                    <p className="text-xl font-bold">{latestForPopup?.soilMoisture}%</p>
                </div>
            </div>

            <h3 className="text-sm font-bold text-gray-700 mb-3">Historical Table Updates</h3>
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-3 font-bold text-gray-600">Date & Time</th>
                    <th className="p-3 font-bold text-gray-600">Temp</th>
                    <th className="p-3 font-bold text-gray-600">Humidity</th>
                    <th className="p-3 font-bold text-gray-600">pH</th>
                    <th className="p-3 font-bold text-gray-600">Moisture</th>
                    <th className="p-3 font-bold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {treeHistory.map((h) => (
                    <tr key={h._id} className="hover:bg-gray-50">
                      <td className="p-3 text-gray-500 text-xs">{formatTime(h.recordedAt)}</td>
                      <td className="p-3">{h.temperature}°C</td>
                      <td className="p-3">{h.humidity}%</td>
                      <td className="p-3 font-medium text-blue-600">
                        {h.soilPh && h.soilPh !== 0 ? h.soilPh : "Add"}
                      </td>
                      <td className="p-3">{h.soilMoisture}%</td>
                      <td className="p-3">
                         <span className={`text-[10px] font-bold ${h.overallStatus === 'Normal' ? 'text-green-600' : h.overallStatus === 'Warning' ? 'text-yellow-600' : 'text-red-600'}`}>
                            {h.overallStatus}
                         </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex justify-end">
                <button onClick={() => setSelectedTreeId(null)} className="px-8 py-2 bg-gray-900 text-white rounded-md text-sm font-bold">Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}