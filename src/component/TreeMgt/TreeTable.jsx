import React, { useState, useEffect } from "react";
import { MapPin, Trash2, Eye, RefreshCw, AlertCircle, User } from "lucide-react";
import { treeService } from "../../services/treeService";
import { useNavigate } from "react-router-dom";
import EditTreeModal from "./EditTreeModal";

const statusColors = {
  Healthy: "bg-green-100 text-green-800",
  Warning: "bg-yellow-100 text-yellow-800",
  Damaged: "bg-red-100 text-red-800",
  Dead: "bg-gray-800 text-white",
  Harvested: "bg-amber-100 text-amber-800",
};

const lifecycleColors = {
  'Growing': 'bg-blue-100 text-blue-800',
  'Inoculated': 'bg-purple-100 text-purple-800',
  'ReadyForHarvest': 'bg-orange-100 text-orange-800',
  'Harvested': 'bg-green-100 text-green-800'
};

const TreeTable = () => {
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [selectedTree, setSelectedTree] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrees();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      fetchTrees();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchTrees = async () => {
    try {
      if (trees.length === 0) {
        setLoading(true);
      }
      setError(null);
      
      console.log('🌳 Fetching trees from API...');
      
      const response = await fetch('http://localhost:5000/api/trees');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      setApiResponse(result);
      console.log('📦 API response:', result);
      
      let treesData = [];
      
      // ✅ FIX #3: Handle the correct API response format
      if (result.success && Array.isArray(result.data)) {
        console.log('✅ Using result.data array');
        treesData = result.data;
      } else if (Array.isArray(result)) {
        console.log('✅ Using direct array result');
        treesData = result;
      } else if (result.data && Array.isArray(result.data.trees)) {
        console.log('✅ Using nested trees array');
        treesData = result.data.trees;
      } else {
        console.error('❌ Unexpected API format:', result);
        throw new Error('Invalid data format from API');
      }
      
      console.log(`📊 Found ${treesData.length} trees`);
      setTrees(treesData);
      
    } catch (err) {
      console.error("❌ Error fetching trees:", err);
      setError(err.message || "Failed to load trees");
      setTrees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewTree = (treeId) => {
    navigate(`/treeprofile/${treeId}`);
  };

  const handleEditTree = (tree) => {
    setSelectedTree(tree);
    setIsEditModalOpen(true);
  };

  const handleDeleteTree = async (treeId) => {
    if (window.confirm("Are you sure you want to PERMANENTLY delete this tree? This action cannot be undone and all associated data will be lost.")) {
      try {
        await treeService.deleteTree(treeId);
        fetchTrees(); // Refresh after delete
        alert("Tree deleted successfully");
      } catch (err) {
        alert("Failed to delete tree");
        console.error("Error deleting tree:", err);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return "Invalid Date";
    }
  };

  const calculateAge = (plantedDate) => {
    if (!plantedDate) return "N/A";
    
    try {
      const planted = new Date(plantedDate);
      const now = new Date();
      const diffTime = Math.abs(now - planted);
      const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
      const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
      
      return `${diffYears}Y ${diffMonths}M`;
    } catch (e) {
      return "N/A";
    }
  };

  // ✅ Helper to get investor display info
  const getInvestorDisplay = (tree) => {
    // Try multiple possible fields for investor info
    if (tree.investorDisplay) {
      return tree.investorDisplay;
    }
    
    if (tree.investor && tree.investor.investorId) {
      return `${tree.investor.name || 'Investor'} (${tree.investor.investorId})`;
    }
    
    if (tree.investorId && tree.investorName) {
      return `${tree.investorName} (${tree.investorId})`;
    }
    
    if (tree.investorId) {
      return `ID: ${tree.investorId}`;
    }
    
    return "Available";
  };

  // ✅ Helper to get investor ID for display
  const getInvestorId = (tree) => {
    if (tree.investor && tree.investor.investorId) {
      return tree.investor.investorId;
    }
    
    if (tree.investorId) {
      return tree.investorId;
    }
    
    if (tree.investor && typeof tree.investor === 'object') {
      return tree.investor.investorId || tree.investor._id?.slice(-6).toUpperCase();
    }
    
    return null;
  };

  if (loading && trees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
        <p className="text-gray-600">Loading trees...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col items-center justify-center p-8">
          <div className="bg-red-100 p-4 rounded-full mb-4">
            <AlertCircle className="text-red-600" size={48} />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Trees</h3>
          <p className="text-gray-600 mb-4 text-center">{error}</p>
          
          {apiResponse && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4 w-full max-w-md">
              <p className="text-sm font-medium text-gray-700 mb-2">API Response:</p>
              <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </div>
          )}
          
          <div className="flex gap-3">
            <button 
              onClick={fetchTrees}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <RefreshCw size={18} />
              Try Again
            </button>
          </div>
          
          <div className="mt-6 text-sm text-gray-500 text-center">
            <p>Check if backend is running at <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:5000</code></p>
            <p>Visit <a href="http://localhost:5000/api/trees" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">/api/trees</a></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto w-full bg-white rounded-xl shadow-sm">
        {/* Table Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Tree Management</h2>
            <p className="text-sm text-gray-600 mt-1">
              {trees.length} tree{trees.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <button 
            onClick={fetchTrees}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-4 text-left font-medium text-gray-700 whitespace-nowrap">Tree ID</th>
                <th className="p-4 text-left font-medium text-gray-700 whitespace-nowrap">NFC Tag</th>
                <th className="p-4 text-left font-medium text-gray-700 whitespace-nowrap">Planted Date</th>
                <th className="p-4 text-left font-medium text-gray-700 whitespace-nowrap">Age</th>
                <th className="p-4 text-left font-medium text-gray-700 whitespace-nowrap">Investor ID</th>
                <th className="p-4 text-left font-medium text-gray-700 whitespace-nowrap">Investor Name</th>
                <th className="p-4 text-left font-medium text-gray-700 whitespace-nowrap">Block</th>
                <th className="p-4 text-left font-medium text-gray-700 whitespace-nowrap">Last Inspection</th>
                <th className="p-4 text-left font-medium text-gray-700 whitespace-nowrap">Health</th>
                <th className="p-4 text-left font-medium text-gray-700 whitespace-nowrap">Lifecycle</th>
                <th className="p-4 text-center font-medium text-gray-700 whitespace-nowrap">Actions</th>
              </tr>
            </thead>

            <tbody>
              {trees.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center p-12">
                    <div className="flex flex-col items-center">
                      <div className="bg-gray-100 p-4 rounded-full mb-4">
                        <MapPin className="text-gray-400" size={48} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">No Trees Found</h3>
                      <p className="text-gray-600 mb-4">There are no trees in the database yet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                trees.map((tree) => {
                  const investorId = getInvestorId(tree);
                  const investorName = tree.investorName || tree.investor?.name;
                  
                  return (
                    <tr key={tree._id || tree.treeId} className="border-b hover:bg-gray-50 transition">
                      <td className="p-4 font-medium text-gray-800">
                        <span className="font-mono">{tree.treeId || 'N/A'}</span>
                      </td>
                      <td className="p-4">
                        {tree.nfcTagId ? (
                          <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm whitespace-nowrap">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            {tree.nfcTagId}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm whitespace-nowrap">
                            <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                            Not assigned
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-gray-700 whitespace-nowrap">{formatDate(tree.plantedDate)}</td>
                      <td className="p-4 text-gray-700 whitespace-nowrap">{calculateAge(tree.plantedDate)}</td>
                      
                      {/* ✅ FIX #3: INVESTOR ID COLUMN */}
                      <td className="p-4">
                        {investorId ? (
                          <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm whitespace-nowrap">
                            <User size={14} />
                            {investorId}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm whitespace-nowrap">
                            <User size={14} />
                            Available
                          </span>
                        )}
                      </td>
                      
                      {/* ✅ INVESTOR NAME COLUMN */}
                      <td className="p-4 text-gray-700">
                        {investorName || 'Not assigned'}
                      </td>
                      
                      <td className="p-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm whitespace-nowrap">
                          {tree.block || 'N/A'}
                        </span>
                      </td>
                      <td className="p-4 text-gray-700 whitespace-nowrap">
                        {tree.lastInspection ? formatDate(tree.lastInspection) : "Never"}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                          statusColors[tree.healthStatus] || statusColors.Healthy
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${
                            tree.healthStatus === 'Healthy' ? 'bg-green-500' :
                            tree.healthStatus === 'Warning' ? 'bg-yellow-500' :
                            tree.healthStatus === 'Damaged' ? 'bg-red-500' :
                            tree.healthStatus === 'Dead' ? 'bg-gray-500' :
                            tree.healthStatus === 'Harvested' ? 'bg-amber-500' :
                            'bg-gray-300'
                          }`}></span>
                          {tree.healthStatus || 'Unknown'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                          lifecycleColors[tree.lifecycleStatus] || 'bg-gray-100 text-gray-800'
                        }`}>
                          {tree.lifecycleStatus || 'Unknown'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleViewTree(tree.treeId)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="View Tree Profile"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleEditTree(tree)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                            title="Edit Tree"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteTree(tree.treeId)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete Tree"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Tree Modal */}
      {selectedTree && (
        <EditTreeModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTree(null);
          }}
          tree={selectedTree}
          onSave={() => {
            fetchTrees();
            setIsEditModalOpen(false);
            setSelectedTree(null);
          }}
        />
      )}
    </>
  );
};

export default TreeTable;