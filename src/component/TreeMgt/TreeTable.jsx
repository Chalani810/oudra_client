//path: oudra-client(web app front end)/src/component/TreeMgt/TreeTable.jsx
import React, { useState, useEffect } from "react";
import { MapPin, Trash2, Eye, RefreshCw } from "lucide-react";
import { treeService } from "../../services/treeService";
import { useNavigate } from "react-router-dom";

const statusColors = {
  Healthy: "bg-green-100 text-green-800",
  Warning: "bg-yellow-100 text-yellow-800",
  Damaged: "bg-red-100 text-red-800",
  Dead: "bg-gray-800 text-white",
};

const lifecycleColors = {
  'Growing': 'bg-blue-100 text-blue-800',
  'Ready for 1st Inoculation': 'bg-purple-100 text-purple-800',
  'Inoculated Once': 'bg-indigo-100 text-indigo-800',
  'Ready for 2nd Inoculation': 'bg-purple-100 text-purple-800',
  'Inoculated Twice': 'bg-indigo-100 text-indigo-800',
  'Ready for Harvest': 'bg-orange-100 text-orange-800',
  'Harvested': 'bg-green-100 text-green-800'
};

const TreeTable = () => {
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrees();
  }, []);

  const fetchTrees = async () => {
    try {
      setLoading(true);
      const treesData = await treeService.getAllTrees();
      setTrees(treesData);
    } catch (err) {
      setError("Failed to load trees");
      console.error("Error fetching trees:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewTree = (treeId) => {
    navigate(`/treeprofile/${treeId}`);
  };

  const handleDeleteTree = async (treeId) => {
    if (window.confirm("Are you sure you want to PERMANENTLY delete this tree? This action cannot be undone and all associated data will be lost.")) {
      try {
        await treeService.deleteTree(treeId);
        fetchTrees();
        alert("Tree deleted successfully");
      } catch (err) {
        alert("Failed to delete tree");
        console.error("Error deleting tree:", err);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const calculateAge = (plantedDate) => {
    if (!plantedDate) return "N/A";
    
    const planted = new Date(plantedDate);
    const now = new Date();
    const diffTime = Math.abs(now - planted);
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    
    return `${diffYears}Y ${diffMonths}M`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-red-600">
        <p>{error}</p>
        <button 
          onClick={fetchTrees}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full bg-white rounded-xl shadow-sm">
      {/* Table Header with Refresh */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">
          Trees ({trees.length})
        </h2>
        <button 
          onClick={fetchTrees}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <table className="w-full text-sm border-collapse">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="p-3 text-left font-medium">Tree ID</th>
            <th className="p-3 text-left font-medium">NFC Tag</th>
            <th className="p-3 text-left font-medium">Planted Date</th>
            <th className="p-3 text-left font-medium">Age</th>
            <th className="p-3 text-left font-medium">Investor ID</th>
            <th className="p-3 text-left font-medium">Block</th>
            <th className="p-3 text-left font-medium">Last Inspection</th>
            <th className="p-3 text-left font-medium">Inspected By</th>
            <th className="p-3 text-left font-medium">Health Status</th>
            <th className="p-3 text-left font-medium">Lifecycle Status</th>
            <th className="p-3 text-center font-medium">Actions</th>
          </tr>
        </thead>

        <tbody>
          {trees.map((tree) => (
            <tr key={tree._id} className="border-b hover:bg-gray-50">
              <td className="p-3 font-medium">{tree.treeId}</td>
              <td className="p-3"> {tree.nfcTagId ? ( <span className="text-green-700 font-medium">{tree.nfcTagId}</span>
                    ) : (
              <span className="text-gray-500 text-sm">Not assigned</span>
                   )}
              </td>              
              <td className="p-3">{formatDate(tree.plantedDate)}</td>
              <td className="p-3">{calculateAge(tree.plantedDate)}</td>
              <td className="p-3">{tree.investorId || "N/A"}</td>
              <td className="p-3">{tree.block || "N/A"}</td>
              <td className="p-3">
                {tree.lastInspection ? formatDate(tree.lastInspection) : "Never"}
              </td>
              <td className="p-3">{tree.inspectedBy || "N/A"}</td>
              <td className="p-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[tree.healthStatus] || statusColors.Healthy}`}>
                  {tree.healthStatus}
                </span>
              </td>
              <td className="p-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${lifecycleColors[tree.lifecycleStatus] || 'bg-gray-100 text-gray-800'}`}>
                  {tree.lifecycleStatus}
                </span>
              </td>
              <td className="p-3 flex justify-center space-x-3">
                <Eye 
                  className="text-gray-600 hover:text-green-700 cursor-pointer" 
                  size={18} 
                  onClick={() => handleViewTree(tree.treeId)}
                  title="View Tree"
                />
                <Trash2 
                  className="text-gray-600 hover:text-red-700 cursor-pointer" 
                  size={18} 
                  onClick={() => handleDeleteTree(tree.treeId)}
                  title="Delete Tree Permanently"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {trees.length === 0 && (
        <div className="text-center p-8 text-gray-500">
          <p className="text-lg mb-2">No trees found</p>
          <p className="text-sm">Click "+ New Tree" to create your first tree record.</p>
        </div>
      )}
    </div>
  );
};
export default TreeTable;