import React, { useEffect, useState } from "react";
import SidePanel from "../component/SidePanel";
import ResinTopbar from "../component/Resin/ResinTopbar";
import DeleteConfirmModal from "../component/DeleteConfirmModal"; // Make sure this path matches your folder structure
import axios from "axios";
import { Filter, Eye, Trash2 } from "lucide-react";

// Helper: get auth headers from localStorage token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const ResinAnalysisTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [riskLevelFilter, setRiskLevelFilter] = useState("");

  // Delete Modal States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch API on mount
  useEffect(() => {
    const fetchResinData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/resin", {
          headers: getAuthHeaders(),
        });
        setData(res.data.data);
      } catch (err) {
        setError("Failed to load resin analysis records");
      } finally {
        setLoading(false);
      }
    };

    fetchResinData();
  }, []);

  // Filter data based on search term AND selected dropdown filters
  const filteredData = data.filter((row) => {
    // 1. Text Search Logic
    const searchLower = searchTerm.toLowerCase();
    const treeId = row.treeId?.treeId?.toLowerCase() || "";
    const riskLevel = row.riskLevel?.toLowerCase() || "";
    const block = row.treeId?.block?.toLowerCase() || "";
    const worker = row.workerName?.toLowerCase() || "";
    const status = row.status?.toLowerCase() || "";

    const matchesSearch =
      treeId.includes(searchLower) ||
      riskLevel.includes(searchLower) ||
      block.includes(searchLower) ||
      worker.includes(searchLower) ||
      status.includes(searchLower);

    // 2. Dropdown Filter Logic
    const matchesStatus = statusFilter === "" || row.status === statusFilter;
    const matchesRiskLevel = riskLevelFilter === "" || row.riskLevel === riskLevelFilter;

    // Must match search AND all active dropdown filters
    return matchesSearch && matchesStatus && matchesRiskLevel;
  });

  const handleClearFilters = () => {
    setStatusFilter("");
    setRiskLevelFilter("");
    setShowFilters(false);
  };

  // Triggered when the user clicks the trash icon in the table
  const handleDeleteClick = (row) => {
    setItemToDelete(row);
    setDeleteModalOpen(true);
  };

  // Triggered when the user clicks "Delete" inside the modal
  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    setIsDeleting(true);
    try {
      await axios.delete(`http://localhost:5000/resin/${itemToDelete._id}`, {
        headers: getAuthHeaders(),
      });
      
      // Remove the item from local state so the UI updates instantly without reloading
      setData(prevData => prevData.filter(item => item._id !== itemToDelete._id));
      
      // Close modal and reset state
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err) {
      console.error("Failed to delete record:", err);
      alert("Failed to delete the record. Please check the console for details.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <SidePanel />
        <div className="flex-1 ml-0 md:ml-64 p-6">
          <ResinTopbar />
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 mt-4 font-medium">Loading resin records...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <SidePanel />
        <div className="flex-1 ml-0 md:ml-64 p-6">
          <ResinTopbar />
          <div className="flex items-center justify-center h-[60vh]">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-red-100">
              <span className="text-4xl mb-4 block">⚠️</span>
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Render SidePanel */}
      <SidePanel />
      
      {/* Main content area */}
      <div className="flex-1 overflow-auto ml-0 md:ml-64 p-6">
        {/* Render ResinTopbar */}
        <ResinTopbar />
        
        {/* Top Controls: Search (Left) & Filters (Right) */}
        <div className="flex justify-between items-center mb-4 mt-4">
          
          {/* Left: Search Input */}
          <input
            type="text"
            placeholder="Search by Tree ID, Block, Worker, Status..."
            className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Right: Filter Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors shadow-sm"
            >
              <Filter size={16} className="text-gray-600" />
              <span className="font-medium text-gray-700">Filter</span>
              {/* Show indicator if filters are active */}
              {(statusFilter || riskLevelFilter) && (
                <span className="flex h-2 w-2 rounded-full bg-green-500 ml-1"></span>
              )}
            </button>
            
            {showFilters && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 p-4 z-10">
                
                {/* Status Filter */}
                <div className="mb-4">
                  <h3 className="font-semibold mb-2 text-gray-700 text-sm">Filter by Status</h3>
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="Ready">Ready</option>
                    <option value="Medium">Medium</option>
                    <option value="Not Ready">Not Ready</option>
                  </select>
                </div>

                {/* Risk Level Filter */}
                <div className="mb-4">
                  <h3 className="font-semibold mb-2 text-gray-700 text-sm">Filter by Risk Level</h3>
                  <select 
                    value={riskLevelFilter}
                    onChange={(e) => setRiskLevelFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                  >
                    <option value="">All Risk Levels</option>
                    <option value="Low">Low</option>
                    <option value="Moderate">Moderate</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <button 
                  onClick={handleClearFilters}
                  className="w-full px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-gray-600 text-sm">
                <th className="px-4 py-3 font-medium">Tree ID</th>
                <th className="px-4 py-3 font-medium">Resin Score</th>
                <th className="px-4 py-3 font-medium">Risk Level</th>
                <th className="px-4 py-3 font-medium">Last Analysis</th>
                <th className="px-4 py-3 font-medium">Block</th>
                <th className="px-4 py-3 font-medium">Worker</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-gray-500">
                    {data.length === 0 
                      ? "No resin analysis records found." 
                      : "No records match your search and filter criteria."}
                  </td>
                </tr>
              ) : (
                filteredData.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {row.treeId?.treeId || "N/A"}
                    </td>
                    
                    <td className="px-4 py-3 text-gray-600">{row.resinScore ?? "—"}%</td>
                    
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

                    <td className="px-4 py-3 text-gray-600 text-sm">
                      {new Date(row.timestamp).toLocaleString()}
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                     {row.treeId?.block || "N/A"}  
                    </td>
                    
                    <td className="px-4 py-3 text-gray-600">{row.workerName || "—"}</td>

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

                    <td className="px-4 py-3 flex justify-center gap-4">
                      <button
                        className="text-gray-400 hover:text-green-600 transition-colors p-1"
                        onClick={() => (window.location.href = `/resin-details/${row._id}`)}
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      
                      <button 
                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                        onClick={() => handleDeleteClick(row)}
                        title="Delete Record"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal 
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setItemToDelete(null);
          }}
          onConfirm={confirmDelete}
          title="Delete Resin Record"
          message="Are you sure you want to permanently delete this resin analysis record? This data cannot be recovered."
          itemName={itemToDelete ? `Tree ID: ${itemToDelete.treeId?.treeId || 'Unknown'}` : ""}
          isDeleting={isDeleting}
        />

      </div>
    </div>
  );
};

export default ResinAnalysisTable;