//path:oudra-client/src/pages/TreeProfileScreen.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { treeService } from "../services/treeService";

// Helper functions
// Calculate tree age in years and months
const calculateTreeAge = (plantedDate) => {
  if (!plantedDate) return { years: 0, months: 0, totalMonths: 0 };
  
  const planted = new Date(plantedDate);
  const now = new Date();
  
  let years = now.getFullYear() - planted.getFullYear();
  let months = now.getMonth() - planted.getMonth();
  let days = now.getDate() - planted.getDate();
  
  if (days < 0) {
    months--;
    // Adjust month count
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  return {
    years,
    months,
    totalMonths: (years * 12) + months
  };
};

// Determine lifecycle status based on age and inoculation count
const determineLifecycleStatus = (treeData) => {
  if (!treeData) return 'Growing';
  
  const { plantedDate, healthStatus, inoculationCount, lifecycleStatus } = treeData;
  
  // CRITICAL: If tree is DEAD or HARVESTED, lifecycle STOPS permanently
  if (healthStatus === 'Dead' || lifecycleStatus === 'Harvested') {
    return lifecycleStatus === 'Harvested' ? 'Harvested' : 'Dead - Lifecycle Stopped';
  }
  
  const age = calculateTreeAge(plantedDate);
  
  // Check conditions for auto-updating lifecycle
  if (inoculationCount === 0) {
    if (age.years >= 4 && healthStatus === 'Healthy') {
      return 'Ready for 1st Inoculation';
    }
    return 'Growing';
  } else if (inoculationCount === 1) {
    if (age.totalMonths >= 52 && healthStatus === 'Healthy') { // 4 years + 4 months = 52 months
      return 'Ready for 2nd Inoculation';
    }
    return 'Inoculated Once';
  } else if (inoculationCount === 2) {
    // Only ready for harvest if: Age >= 8 AND Healthy
    if (age.years >= 8 && healthStatus === 'Healthy') {
      return 'Ready for Harvest';
    }
    return 'Inoculated Twice';
  }
  
  return lifecycleStatus || 'Growing';
};

// Check if tree can progress in lifecycle (NOT dead or harvested)
const canProgressLifecycle = (treeData) => {
  if (!treeData) return true;
  
  const { healthStatus, lifecycleStatus } = treeData;
  
  // Tree cannot progress if DEAD or already HARVESTED
  if (healthStatus === 'Dead' || lifecycleStatus === 'Harvested') {
    return false;
  }
  
  return true;
};

// Check if tree is ready for next inoculation
const isReadyForInoculation = (treeData) => {
  if (!treeData) return { ready: false, type: null };
  
  const { inoculationCount, lifecycleStatus, healthStatus } = treeData;
  
  // Dead trees cannot be inoculated
  if (healthStatus === 'Dead') {
    return { ready: false, type: null, reason: 'Tree is dead' };
  }
  
  // Harvested trees cannot be inoculated
  if (lifecycleStatus === 'Harvested') {
    return { ready: false, type: null, reason: 'Tree already harvested' };
  }
  
  if (lifecycleStatus === 'Ready for 1st Inoculation' && inoculationCount === 0) {
    return { ready: true, type: '1st' };
  }
  
  if (lifecycleStatus === 'Ready for 2nd Inoculation' && inoculationCount === 1) {
    return { ready: true, type: '2nd' };
  }
  
  return { ready: false, type: null };
};

// Check if tree is ready for harvest
const isReadyForHarvest = (treeData) => {
  if (!treeData) return { ready: false, reason: 'No tree data' };
  
  const { inoculationCount, lifecycleStatus, healthStatus } = treeData;
  
  // Dead trees cannot be harvested
  if (healthStatus === 'Dead') {
    return { ready: false, reason: 'Tree is dead' };
  }
  
  // Already harvested trees
  if (lifecycleStatus === 'Harvested') {
    return { ready: false, reason: 'Tree already harvested' };
  }
  
  const ready = lifecycleStatus === 'Ready for Harvest' && inoculationCount === 2;
  
  return { 
    ready, 
    reason: ready ? 'Ready for resin extraction' : 'Not ready for harvest'
  };
};

// Get tree status summary
const getTreeStatusSummary = (treeData) => {
  if (!treeData) return { status: 'Unknown', color: 'gray', description: 'No data' };
  
  const { healthStatus, lifecycleStatus } = treeData;
  
  // Priority: Dead > Harvested > Others
  if (healthStatus === 'Dead') {
    return {
      status: 'Dead',
      color: 'gray',
      description: 'Tree is deceased. Lifecycle stopped permanently.',
      icon: 'skull',
      isFinal: true
    };
  }
  
  if (lifecycleStatus === 'Harvested') {
    return {
      status: 'Harvested',
      color: 'brown',
      description: 'Tree harvested and resin extracted. Record preserved.',
      icon: 'checkmark-done',
      isFinal: true
    };
  }
  
  // Active trees
  const lifecycle = determineLifecycleStatus(treeData);
  const inoculationReady = isReadyForInoculation(treeData);
  const harvestReady = isReadyForHarvest(treeData);
  
  return {
    status: lifecycle,
    color: healthStatus === 'Healthy' ? 'green' : 
           healthStatus === 'Warning' ? 'yellow' : 'orange',
    description: `${healthStatus} - ${lifecycle}`,
    icon: healthStatus === 'Healthy' ? 'leaf' : 'warning',
    isFinal: false,
    inoculationReady,
    harvestReady
  };
};

// ===== MAIN COMPONENT =====
export default function TreeProfileScreen() {
  const { treeId } = useParams();
  const navigate = useNavigate();
  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [treeHistory, setTreeHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const [isAssignTaskOpen, setAssignTaskOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [isMarkHarvestedOpen, setMarkHarvestedOpen] = useState(false);
  const [harvestNotes, setHarvestNotes] = useState("");

  useEffect(() => {
    fetchTreeData();
  }, [treeId]);

  useEffect(() => {
    if (tree) {
      fetchTreeHistory();
    }
  }, [tree]);

  const fetchTreeData = async () => {
    try {
      setLoading(true);
      const treeData = await treeService.getTreeById(treeId);
      setTree(treeData);
    } catch (err) {
      setError("Failed to load tree data");
      console.error("Error fetching tree:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTreeHistory = async () => {
    try {
      setHistoryLoading(true);
      const historyData = await treeService.getTreeHistory(treeId);
      setTreeHistory(historyData);
    } catch (err) {
      console.error("Error fetching tree history:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleDeleteTree = async () => {
    try {
      await treeService.deleteTree(treeId);
      alert("Tree deleted successfully");
      navigate("/treemgt");
    } catch (err) {
      alert("Failed to delete tree");
      console.error("Error deleting tree:", err);
    }
  };

  const handleMarkAsHarvested = async () => {
    try {
      if (!harvestNotes.trim()) {
        alert("Please enter harvest notes");
        return;
      }
      
      const harvestData = {
        lifecycleStatus: 'Harvested',
        healthStatus: 'Harvested',
        lastUpdatedBy: 'web-admin',
        harvestNotes: harvestNotes,
        harvestedAt: new Date().toISOString()
      };
      
      await treeService.updateTree(treeId, harvestData);
      
      // Add to history
      await treeService.addObservation(treeId, {
        notes: `Tree harvested. Notes: ${harvestNotes}`,
        healthStatus: 'Harvested',
        observedBy: 'web-admin',
        type: 'Harvest'
      });
      
      setMarkHarvestedOpen(false);
      setHarvestNotes("");
      fetchTreeData();
      alert("Tree marked as harvested successfully");
    } catch (err) {
      alert("Failed to mark tree as harvested");
      console.error("Error marking harvested:", err);
    }
  };

  // Calculate age for display
  const displayAge = (plantedDate) => {
    if (!plantedDate) return "N/A";
    const age = calculateTreeAge(plantedDate);
    return `${age.years} years ${age.months} months`;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format datetime for display
  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error || !tree) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        {error || "Tree not found"}
      </div>
    );
  }

  // Get tree status summary
  const treeStatus = getTreeStatusSummary(tree);
  const canProgress = canProgressLifecycle(tree);
  const inoculationReady = isReadyForInoculation(tree);
  const harvestReady = isReadyForHarvest(tree);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* LEFT CONTENT */}
      <div className="flex-1 p-6 overflow-y-auto">

        {/* Title and Actions */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{tree.treeId}</h1>
            <p className="text-gray-600 mt-1">Block: {tree.block || 'N/A'}</p>
          </div>
          <div className="flex gap-3">
          
            {harvestReady.ready && !treeStatus.isFinal && (
              <button
                onClick={() => setMarkHarvestedOpen(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium"
              >
                Mark as Harvested
              </button>
            )}
          </div>
        </div>

        {/* TREE STATUS ALERT */}
        {treeStatus.isFinal && (
          <div className={`mb-6 p-4 rounded-lg ${
            treeStatus.status === 'Dead' ? 'bg-gray-100 border-l-4 border-gray-500' :
            'bg-amber-50 border-l-4 border-amber-500'
          }`}>
            <div className="flex items-center">
              <div className={`p-2 rounded-full ${
                treeStatus.status === 'Dead' ? 'bg-gray-200' : 'bg-amber-100'
              }`}>
                <span className={`text-lg ${
                  treeStatus.status === 'Dead' ? 'text-gray-600' : 'text-amber-600'
                }`}>
                  {treeStatus.status === 'Dead' ? '💀' : '✅'}
                </span>
              </div>
              <div className="ml-3">
                <h3 className={`text-lg font-semibold ${
                  treeStatus.status === 'Dead' ? 'text-gray-800' : 'text-amber-800'
                }`}>
                  {treeStatus.status === 'Dead' ? 'Tree Deceased' : 'Tree Harvested'}
                </h3>
                <p className={`text-sm ${
                  treeStatus.status === 'Dead' ? 'text-gray-600' : 'text-amber-600'
                }`}>
                  {treeStatus.description}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Record preserved for tracking and legal purposes
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STATUS BADGES */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* Health Status Badge */}
          <div className={`px-4 py-2 rounded-full font-semibold ${
            tree.healthStatus === 'Healthy' ? 'bg-green-100 text-green-800' :
            tree.healthStatus === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
            tree.healthStatus === 'Damaged' ? 'bg-orange-100 text-orange-800' :
            tree.healthStatus === 'Dead' ? 'bg-gray-800 text-white' :
            tree.healthStatus === 'Harvested' ? 'bg-amber-100 text-amber-800' :
            'bg-red-100 text-red-800'
          }`}>
            {tree.healthStatus === 'Harvested' ? 'Status: Harvested' : `Health: ${tree.healthStatus}`}
          </div>
          
          {/* Lifecycle Status Badge */}
          <div className={`px-4 py-2 rounded-full font-semibold ${
            treeStatus.status === 'Growing' ? 'bg-blue-100 text-blue-800' :
            treeStatus.status === 'Ready for 1st Inoculation' ? 'bg-purple-100 text-purple-800' :
            treeStatus.status === 'Inoculated Once' ? 'bg-indigo-100 text-indigo-800' :
            treeStatus.status === 'Ready for 2nd Inoculation' ? 'bg-purple-100 text-purple-800' :
            treeStatus.status === 'Inoculated Twice' ? 'bg-indigo-100 text-indigo-800' :
            treeStatus.status === 'Ready for Harvest' ? 'bg-orange-100 text-orange-800' :
            treeStatus.status === 'Dead - Lifecycle Stopped' ? 'bg-gray-200 text-gray-800' :
            treeStatus.status === 'Harvested' ? 'bg-amber-100 text-amber-800' :
            'bg-green-100 text-green-800'
          }`}>
            {treeStatus.status === 'Dead - Lifecycle Stopped' ? 'Lifecycle: Stopped' : `Lifecycle: ${treeStatus.status}`}
          </div>
          
          {/* Ready Indicators */}
          {!treeStatus.isFinal && inoculationReady.ready && (
            <div className="px-4 py-2 rounded-full font-semibold bg-purple-100 text-purple-800">
              ✅ Ready for {inoculationReady.type} Inoculation
            </div>
          )}
          
          {!treeStatus.isFinal && harvestReady.ready && (
            <div className="px-4 py-2 rounded-full font-semibold bg-orange-100 text-orange-800">
              ✅ Ready for Harvest
            </div>
          )}
          
          {/* Warning if tree cannot progress */}
          {!treeStatus.isFinal && !canProgress && (
            <div className="px-4 py-2 rounded-full font-semibold bg-red-100 text-red-800">
              ⚠️ Cannot Progress
            </div>
          )}
        </div>

        {/* TREE INFORMATION CARD */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-green-800 border-b pb-2">Tree Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Tree ID</label>
                <p className="text-lg font-semibold text-gray-800">{tree.treeId}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">NFC Tag ID</label>
                {tree.nfcTagId ? (
                  <p className="text-lg font-semibold text-blue-600">{tree.nfcTagId}</p>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    Not assigned yet
                  </span>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Planted Date</label>
                <p className="text-lg font-semibold text-gray-800">{formatDate(tree.plantedDate)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Age</label>
                <p className="text-lg font-semibold text-gray-800">{displayAge(tree.plantedDate)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Block</label>
                <p className="text-lg font-semibold text-gray-800">{tree.block || 'N/A'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">GPS Coordinates</label>
                {tree.gps && tree.gps.lat !== 0 ? (
                  <p className="text-lg font-semibold text-gray-800">
                    {tree.gps.lat.toFixed(6)}, {tree.gps.lng.toFixed(6)}
                  </p>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    Not captured yet
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Investor ID</label>
                <p className="text-lg font-semibold text-gray-800">{tree.investorId || 'N/A'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Investor Name</label>
                <p className="text-lg font-semibold text-gray-800">{tree.investorName || 'N/A'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Inoculation Count</label>
                <p className="text-lg font-semibold text-gray-800">{tree.inoculationCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* STATUS INFORMATION CARD */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-green-800 border-b pb-2">Status Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-500 mb-2">Health Status</label>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                tree.healthStatus === 'Healthy' ? 'bg-green-100 text-green-800' :
                tree.healthStatus === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                tree.healthStatus === 'Damaged' ? 'bg-orange-100 text-orange-800' :
                tree.healthStatus === 'Dead' ? 'bg-gray-800 text-white' :
                tree.healthStatus === 'Harvested' ? 'bg-amber-100 text-amber-800' :
                'bg-red-100 text-red-800'
              }`}>
                {tree.healthStatus}
              </span>
            </div>

            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-500 mb-2">Lifecycle Status</label>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                treeStatus.status === 'Growing' ? 'bg-blue-100 text-blue-800' :
                treeStatus.status === 'Ready for 1st Inoculation' ? 'bg-purple-100 text-purple-800' :
                treeStatus.status === 'Inoculated Once' ? 'bg-indigo-100 text-indigo-800' :
                treeStatus.status === 'Ready for 2nd Inoculation' ? 'bg-purple-100 text-purple-800' :
                treeStatus.status === 'Inoculated Twice' ? 'bg-indigo-100 text-indigo-800' :
                treeStatus.status === 'Ready for Harvest' ? 'bg-orange-100 text-orange-800' :
                treeStatus.status === 'Dead - Lifecycle Stopped' ? 'bg-gray-200 text-gray-800' :
                treeStatus.status === 'Harvested' ? 'bg-amber-100 text-amber-800' :
                'bg-green-100 text-green-800'
              }`}>
                {treeStatus.status === 'Dead - Lifecycle Stopped' ? 'Stopped' : treeStatus.status}
              </span>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-500 mb-2">Inoculation Count</label>
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                {tree.inoculationCount}
              </span>
            </div>

            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-500 mb-2">Can Progress</label>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                canProgress ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {canProgress ? 'Yes' : 'No'}
                {!canProgress && tree.healthStatus === 'Dead' && ' (Dead)'}
                {!canProgress && tree.lifecycleStatus === 'Harvested' && ' (Harvested)'}
              </span>
            </div>
          </div>
          
          {/* Additional Status Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-500 mb-2">Ready for Harvest</label>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                harvestReady.ready ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {harvestReady.ready ? 'Yes' : 'No'}
                {!harvestReady.ready && harvestReady.reason && ` (${harvestReady.reason})`}
              </span>
            </div>
            
            <div className="text-center p-4 bg-teal-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-500 mb-2">Record Status</label>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                treeStatus.isFinal ? 'bg-gray-100 text-gray-800' : 'bg-teal-100 text-teal-800'
              }`}>
                {treeStatus.isFinal ? 'Archived' : 'Active'}
              </span>
              <p className="text-xs text-gray-500 mt-1">
                {treeStatus.isFinal ? 'Preserved for legal tracking' : 'Active management'}
              </p>
            </div>
          </div>
        </div>

        {/* SYSTEM INFORMATION CARD */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-green-800 border-b pb-2">System Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Last Inspection</label>
                {tree.lastInspection ? (
                  <p className="text-lg font-semibold text-gray-800">{formatDateTime(tree.lastInspection)}</p>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    Not inspected yet
                  </span>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Inspected By</label>
                {tree.inspectedBy ? (
                  <p className="text-lg font-semibold text-gray-800">{tree.inspectedBy}</p>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    Not inspected yet
                  </span>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Last Updated</label>
                <p className="text-lg font-semibold text-gray-800">{formatDateTime(tree.lastUpdatedAt)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Updated By</label>
                <p className="text-lg font-semibold text-gray-800">{tree.lastUpdatedBy || 'System'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Ready for Harvest</label>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  tree.readyForHarvest ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {tree.readyForHarvest ? 'Yes' : 'No'}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Offline Updated</label>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  tree.offlineUpdated ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {tree.offlineUpdated ? 'Yes (Mobile App)' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Additional System Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-500">Created At</label>
              <p className="text-lg font-semibold text-gray-800">{formatDateTime(tree.createdAt)}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500">Updated At</label>
              <p className="text-lg font-semibold text-gray-800">{formatDateTime(tree.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="w-80 bg-white shadow-inner p-6 border-l overflow-y-auto">
        
        {/* QUICK ACTIONS */}
        <h3 className="font-semibold text-lg mb-4 text-gray-800">Quick Actions</h3>

        <div className="flex flex-col gap-3">
          <button 
            onClick={() => navigate(`/treeprofile/${treeId}/observations`)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition duration-200"
          >
            Field Notes
          </button>

          {!treeStatus.isFinal && (
            <>
              <button 
                onClick={() => setAssignTaskOpen(true)} 
                className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition duration-200"
              >
                Assign Task
              </button>
            </>
          )}

          <button 
            onClick={() => setDeleteOpen(true)} 
            className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition duration-200"
          >
            Delete Tree
          </button>
        </div>

        {/* ACTIVITY HISTORY */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg text-gray-800">Recent Activity</h3>
            <button 
              onClick={() => navigate(`/treeprofile/${treeId}/history`)}
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              View Full History
            </button>
          </div>

         {historyLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
            </div>
          ) : treeHistory.length === 0 ? (
            <p className="text-gray-500 text-sm">No activity recorded yet</p>
          ) : (
            <div className="space-y-4">
              {treeHistory.slice(0, 5).map((history) => (
                <div key={history._id} className="border-l-4 border-green-500 pl-4 py-2">
                  <p className="font-medium text-gray-800">{history.actionType}</p>
                  <p className="text-gray-600 text-sm">{formatDateTime(history.timestamp)}</p>
                  <p className="text-gray-500 text-sm">By: {history.changedBy}</p>
                  {history.notes && (
                    <p className="text-gray-600 text-sm mt-1">{history.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}
      {/* MARK AS HARVESTED MODAL */}
      {isMarkHarvestedOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-96">
            <h3 className="font-semibold text-lg mb-4 text-orange-600">Mark Tree as Harvested</h3>
            <p className="mb-4 text-gray-700">
              Are you sure you want to mark tree <strong>{tree.treeId}</strong> as harvested?
              This action is permanent and cannot be undone.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Harvest Notes
              </label>
              <textarea
                value={harvestNotes}
                onChange={(e) => setHarvestNotes(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter harvest details (resin yield, quality, etc.)"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition duration-200"
                onClick={() => {
                  setMarkHarvestedOpen(false);
                  setHarvestNotes("");
                }}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 rounded bg-orange-600 hover:bg-orange-700 text-white transition duration-200"
                onClick={handleMarkAsHarvested}
              >
                Mark as Harvested
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Task Modal */}
      {isAssignTaskOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-96">
            <h3 className="font-semibold text-lg mb-4">Assign Task</h3>
            <input
              type="text"
              placeholder="Enter task description"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition duration-200"
                onClick={() => setAssignTaskOpen(false)}
              >
                Cancel
              </button>
              <button className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white transition duration-200">
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-96">
            <h3 className="font-semibold text-lg mb-4 text-red-600">Delete Tree</h3>
            <p className="mb-4 text-gray-700 font-medium">
              Are you sure you want to permanently delete tree <strong>{tree.treeId}</strong>? 
              This action cannot be undone and all associated data will be lost.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition duration-200"
                onClick={() => setDeleteOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white transition duration-200"
                onClick={handleDeleteTree}
              >
                Delete Tree
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}