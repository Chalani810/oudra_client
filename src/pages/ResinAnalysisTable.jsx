import React, { useEffect, useState } from "react";
import SidePanel from "../component/SidePanel";
import ResinTopbar from "../component/Resin/ResinTopbar";
import axios from "axios";

const ResinAnalysisTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch API on mount
  useEffect(() => {
    const fetchResinData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/resin");
        setData(res.data.data);
      } catch (err) {
        setError("Failed to load resin analysis records");
      } finally {
        setLoading(false);
      }
    };

    fetchResinData();
  }, []);

  if (loading)
    return (
      <div className="flex">
        <SidePanel />
        <div className="flex-1">
          <ResinTopbar />
          <p className="text-center text-gray-600 mt-6">Loading...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex">
        <SidePanel />
        <div className="flex-1">
          <ResinTopbar />
          <p className="text-center text-red-600 mt-6">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="flex">
      {/* Render SidePanel */}
      <SidePanel />
      
      {/* Main content area */}
      <div className="flex-1 ml-64"> {/* Adjust ml-64 based on your sidebar width */}
        {/* Render ResinTopbar */}
        <ResinTopbar />
        

          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-gray-600 text-sm">
                  <th className="px-4 py-2">Tree ID</th>
                  <th className="px-4 py-2">Resin Score</th>
                  <th className="px-4 py-2">Risk Level</th>
                  <th className="px-4 py-2">Last Analysis</th>
                  <th className="px-4 py-2">Block</th>
                  <th className="px-4 py-2">Worker</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>

              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-6 text-gray-500">
                      No resin analysis records found.
                    </td>
                  </tr>
                ) : (
                  data.map((row, idx) => (
                    <tr
                      key={idx}
                      className="bg-gray-50 hover:bg-gray-100 rounded-lg transition-all"
                    >
                      {/* FIXED: Access treeId property from the tree object */}
                      <td className="px-4 py-3 font-medium">
                        {row.treeId?.treeId || "N/A"}
                      </td>
                      
                      <td className="px-4 py-3">{row.resinScore ?? "—"}%</td>
                      
                      {/* RISK LEVEL BADGE */}
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full 
                            ${
                              row.riskLevel === "High"
                                ? "bg-green-100 text-green-700"
                                : row.riskLevel === "Moderate"
                                ? "bg-yellow-100 text-yellow-700"
                                : row.riskLevel === "Low"
                                ? "bg-gray-200 text-gray-700"
                                : row.riskLevel === "Critical"
                                ? "bg-red-100 text-red-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                        >
                          {row.riskLevel}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        {new Date(row.timestamp).toLocaleString()}
                      </td>

                      <td className="px-4 py-3">
                     {row.treeId?.block || "N/A"}  
                     </td>
                      
                      <td className="px-4 py-3">{row.workerName || "—"}</td>

                      {/* STATUS BADGE */}
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full 
                            ${
                              row.status === "Ready"
                                ? "bg-green-100 text-green-700"
                                : row.status === "Medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : row.status === "Not Ready"
                                ? "bg-red-100 text-red-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                        >
                          {row.status}
                        </span>
                      </td>

                      <td className="px-4 py-3 flex gap-2">
                       <button
                           className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                           onClick={() => (window.location.href = `/resin-details/${row._id}`)}
                           >
                           View
                       </button>
                        <button className="px-3 py-1 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-800">
                          Compare
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
};

export default ResinAnalysisTable;