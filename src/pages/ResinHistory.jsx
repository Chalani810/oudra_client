import React, { useEffect, useState } from "react";
import SidePanel from "../component/SidePanel";
import ResinTopbar from "../component/Resin/ResinTopbar";

const ResinHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterRisk, setFilterRisk] = useState("All");
  const [filterWorker, setFilterWorker] = useState("All");

  // Mock Data (Replace with Firebase)
  const mockHistory = [
    {
      id: "A1",
      treeId: "T-01962",
      score: 72,
      level: "High",
      worker: "Nimal",
      timestamp: "2025-02-10 14:32",
      originalImageUrl: "/images/t1.jpg",
      heatmapUrl: "/images/heat1.jpg"
    },
    {
      id: "A2",
      treeId: "T-01321",
      score: 38,
      level: "Low",
      worker: "Supun",
      timestamp: "2025-02-10 11:10",
      originalImageUrl: "/images/t2.jpg",
      heatmapUrl: "/images/heat2.jpg"
    },
    {
      id: "A3",
      treeId: "T-01788",
      score: 55,
      level: "Moderate",
      worker: "Nimal",
      timestamp: "2025-02-09 18:43",
      originalImageUrl: "/images/t3.jpg",
      heatmapUrl: "/images/heat3.jpg"
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setHistory(mockHistory);
      setLoading(false);
    }, 800);
  }, []);

  const filteredHistory = history.filter((item) => {
    return (
      (filterRisk === "All" || item.level === filterRisk) &&
      (filterWorker === "All" || item.worker === filterWorker)
    );
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidePanel />

      <div className="flex-1 ml-64 flex flex-col">
        <ResinTopbar />

        <div className="p-6">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold">Resin Analysis History</h2>
              <p className="text-gray-600">
                View all historical AI resin evaluations recorded in the system.
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <select
              className="px-4 py-2 rounded-lg bg-white shadow"
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
            >
              <option>All</option>
              <option>High</option>
              <option>Moderate</option>
              <option>Low</option>
              <option>Critical</option>
            </select>

            <select
              className="px-4 py-2 rounded-lg bg-white shadow"
              value={filterWorker}
              onChange={(e) => setFilterWorker(e.target.value)}
            >
              <option>All</option>
              <option>Nimal</option>
              <option>Supun</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow p-6">
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left bg-gray-100">
                  <th className="p-3">Tree ID</th>
                  <th className="p-3">Score</th>
                  <th className="p-3">Risk Level</th>
                  <th className="p-3">Worker</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {!loading &&
                  filteredHistory.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-3 font-semibold">{item.treeId}</td>
                      <td className="p-3">{item.score}%</td>
                      <td
                        className={`p-3 font-semibold ${
                          item.level === "High"
                            ? "text-green-600"
                            : item.level === "Low"
                            ? "text-red-600"
                            : item.level === "Moderate"
                            ? "text-yellow-600"
                            : "text-gray-600"
                        }`}
                      >
                        {item.level}
                      </td>
                      <td className="p-3">{item.worker}</td>
                      <td className="p-3">{item.timestamp}</td>

                      <td className="p-3">
                        <a
                          href={`/resin/detail/${item.id}`}
                          className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                        >
                          View Details
                        </a>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {loading && (
              <p className="text-center text-gray-500 py-6">
                Loading resin history...
              </p>
            )}

            {!loading && filteredHistory.length === 0 && (
              <p className="text-center text-gray-500 py-6">
                No records found for selected filters.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResinHistory;
