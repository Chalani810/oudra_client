//oudra-client(web app front end)/src/pages/TreeProfileScreen.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { treeService } from "../services/treeService";

//Helper functions

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
    description: ${healthStatus} - ${lifecycle},
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
  const [isReassignNFCOpen, setReassignNFCOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isMarkHarvestedOpen, setMarkHarvestedOpen] = useState(false);
  const [harvestNotes, setHarvestNotes] = useState("");

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    nfcTagId: "",
    plantedDate: "",
    investorId: "",
    investorName: "",
    block: "",
    gps: { lat: "", lng: "" },
    healthStatus: "Healthy",
    lifecycleStatus: "Growing",
    inoculationCount: 0,
    readyForInoculation: false,
    readyForHarvest: false
  });

  useEffect(() => {
    fetchTreeData();
  }, [treeId]);


  useEffect(() => {
    if (tree) {
      fetchTreeHistory();
      
      // Initialize edit form data
      setEditFormData({
        nfcTagId: tree.nfcTagId || "",
        plantedDate: tree.plantedDate ? new Date(tree.plantedDate).toISOString().split('T')[0] : "",
        investorId: tree.investorId || "",
        investorName: tree.investorName || "",
        block: tree.block || "",
        gps: tree.gps || { lat: "", lng: "" },
        healthStatus: tree.healthStatus || "Healthy",
        lifecycleStatus: tree.lifecycleStatus || "Growing",
        inoculationCount: tree.inoculationCount || 0,
        readyForInoculation: tree.readyForInoculation || false,
        readyForHarvest: tree.readyForHarvest || false
      });
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

  const handleReassignNFC = async (newNfcTagId) => {
    try {
      await treeService.updateNFCTag(treeId, newNfcTagId);
      fetchTreeData();
      setReassignNFCOpen(false);
      alert("NFC tag reassigned successfully");
    } catch (err) {
      alert("Failed to reassign NFC tag");
      console.error("Error reassigning NFC:", err);
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

  const handleUpdateTree = async () => {
    try {
      // Calculate age before sending
      const ageData = calculateTreeAge(editFormData.plantedDate);
      
      // Prevent updating dead/harvested trees to active status
      if (tree.healthStatus === 'Dead' && editFormData.healthStatus !== 'Dead') {
        alert("Cannot change health status of a dead tree. Dead trees remain deceased permanently.");
        return;
      }
      
      if (tree.lifecycleStatus === 'Harvested' && editFormData.lifecycleStatus !== 'Harvested') {
        alert("Cannot change lifecycle status of a harvested tree. Harvested trees remain in harvested state permanently.");
        return;
      }
      
      const updatedData = {
        ...editFormData,
        age: ageData.years
      };
      
      await treeService.updateTree(treeId, updatedData);
      fetchTreeData();
      setEditModalOpen(false);
      alert("Tree updated successfully");
    } catch (err) {
      alert("Failed to update tree");
      console.error("Error updating tree:", err);
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
        notes: Tree harvested. Notes: ${harvestNotes},
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
    return ${age.years} years ${age.months} months;
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
            <button
              onClick={() => setEditModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
              disabled={treeStatus.isFinal}
            >
              Edit Tree
            </button>
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
            {tree.healthStatus === 'Harvested' ? 'Status: Harvested' : Health: ${tree.healthStatus}}
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
            {treeStatus.status === 'Dead - Lifecycle Stopped' ? 'Lifecycle: Stopped' : Lifecycle: ${treeStatus.status}}
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
              ⚠ Cannot Progress
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
                <p className="text-lg font-semibold text-gray-800">{tree.nfcTagId || 'Not Assigned'}</p>
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
                <p className="text-lg font-semibold text-gray-800">
                  {tree.gps && tree.gps.lat !== 0 ? ${tree.gps.lat}, ${tree.gps.lng} : 'Not Set'}
                </p>
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
                <p className="text-lg font-semibold text-gray-800">{formatDateTime(tree.lastInspection)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Inspected By</label>
                <p className="text-lg font-semibold text-gray-800">{tree.inspectedBy || 'N/A'}</p>
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
                  {tree.offlineUpdated ? 'Yes' : 'No'}
                </span>
              </div>
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
            onClick={() => navigate(/treeprofile/${treeId}/observations)}
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

              <button 
                onClick={() => setEditModalOpen(true)} 
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition duration-200"
              >
                Edit Tree
              </button>
            </>
          )}

          <button 
            onClick={() => setReassignNFCOpen(true)} 
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-medium transition duration-200"
            disabled={treeStatus.isFinal}
          >
            Reassign NFC
          </button>

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
              onClick={() => navigate(/treeprofile/${treeId}/history)}
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

      {/* EDIT TREE MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Edit Tree - {tree.treeId}</h2>
              <button 
                onClick={() => setEditModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition duration-200"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* WARNING FOR FINAL STATUS TREES */}
              {treeStatus.isFinal && (
                <div className={`p-4 rounded-lg ${
                  treeStatus.status === 'Dead' ? 'bg-gray-100 border border-gray-300' :
                  'bg-amber-50 border border-amber-200'
                }`}>
                  <h3 className={`font-semibold mb-2 ${
                    treeStatus.status === 'Dead' ? 'text-gray-800' : 'text-amber-800'
                  }`}>
                    {treeStatus.status === 'Dead' ? '⚠ Tree is Deceased' : '✅ Tree is Harvested'}
                  </h3>
                  <p className={`text-sm ${
                    treeStatus.status === 'Dead' ? 'text-gray-600' : 'text-amber-600'
                  }`}>
                    {treeStatus.status === 'Dead' 
                      ? 'This tree is marked as dead. Health status cannot be changed. Lifecycle has stopped permanently.'
                      : 'This tree has been harvested. Lifecycle status cannot be changed. Record is preserved for tracking.'
                    }
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* NFC Tag ID */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">NFC Tag ID</label>
                  <input
                    type="text"
                    value={editFormData.nfcTagId}
                    onChange={(e) => setEditFormData(prev => ({...prev, nfcTagId: e.target.value}))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter NFC Tag ID"
                    disabled={treeStatus.isFinal}
                  />
                </div>
                
                {/* Investor ID */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Investor ID</label>
                  <input
                    type="text"
                    value={editFormData.investorId}
                    onChange={(e) => setEditFormData(prev => ({...prev, investorId: e.target.value}))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter Investor ID"
                    disabled={treeStatus.isFinal}
                  />
                </div>
                
                {/* Investor Name */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Investor Name</label>
                  <input
                    type="text"
                    value={editFormData.investorName}
                    onChange={(e) => setEditFormData(prev => ({...prev, investorName: e.target.value}))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter Investor Name"
                    disabled={treeStatus.isFinal}
                  />
                </div>
                
                {/* Block */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Block</label>
                  <select
                    value={editFormData.block}
                    onChange={(e) => setEditFormData(prev => ({...prev, block: e.target.value}))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={treeStatus.isFinal}
                  >
                    <option value="">Select Block</option>
                    <option value="Block-A">Block A</option>
                    <option value="Block-B">Block B</option>
                    <option value="Block-C">Block C</option>
                    <option value="Block-D">Block D</option>
                    <option value="Block-E">Block E</option>
                    <option value="Block-F">Block F</option>
                  </select>
                </div>
                
                {/* Health Status */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Health Status</label>
                  <select
                    value={editFormData.healthStatus}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      // Prevent changing from Dead to other status
                      if (tree.healthStatus === 'Dead' && newStatus !== 'Dead') {
                        alert("Cannot change health status of a dead tree. Dead trees remain deceased permanently.");
                        return;
                      }
                      setEditFormData(prev => ({...prev, healthStatus: newStatus}));
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={tree.healthStatus === 'Dead' || tree.lifecycleStatus === 'Harvested'}
                  >
                    <option value="Healthy">Healthy</option>
                    <option value="Warning">Warning</option>
                    <option value="Damaged">Damaged</option>
                    <option value="Dead">Dead</option>
                    {tree.lifecycleStatus === 'Harvested' && <option value="Harvested">Harvested</option>}
                  </select>
                  {tree.healthStatus === 'Dead' && (
                    <p className="text-sm text-gray-500 mt-1">Dead trees cannot be revived</p>
                  )}
                </div>
                
                {/* Lifecycle Status */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Lifecycle Status</label>
                  <select
                    value={editFormData.lifecycleStatus}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      // Prevent changing from Harvested to other status
                      if (tree.lifecycleStatus === 'Harvested' && newStatus !== 'Harvested') {
                        alert("Cannot change lifecycle status of a harvested tree.");
                        return;
                      }
                      setEditFormData(prev => ({...prev, lifecycleStatus: newStatus}));
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={tree.lifecycleStatus === 'Harvested' || tree.healthStatus === 'Dead'}
                  >
                    <option value="Growing">Growing</option>
                    <option value="Ready for 1st Inoculation">Ready for 1st Inoculation</option>
                    <option value="Inoculated Once">Inoculated Once</option>
                    <option value="Ready for 2nd Inoculation">Ready for 2nd Inoculation</option>
                    <option value="Inoculated Twice">Inoculated Twice</option>
                    <option value="Ready for Harvest">Ready for Harvest</option>
                    <option value="Harvested">Harvested</option>
                  </select>
                  {tree.lifecycleStatus === 'Harvested' && (
                    <p className="text-sm text-gray-500 mt-1">Harvested status is permanent</p>
                  )}
                </div>
                
                {/* Inoculation Count */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Inoculation Count</label>
                  <select
                    value={editFormData.inoculationCount}
                    onChange={(e) => setEditFormData(prev => ({...prev, inoculationCount: parseInt(e.target.value)}))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={treeStatus.isFinal}
                  >
                    <option value={0}>0</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                  </select>
                </div>
                
                {/* Ready for Inoculation */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Ready for Inoculation</label>
                  <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="readyForInoculation"
                        checked={editFormData.readyForInoculation === true}
                        onChange={() => setEditFormData(prev => ({...prev, readyForInoculation: true}))}
                        className="form-radio text-green-600"
                        disabled={treeStatus.isFinal}
                      />
                      <span className="ml-2">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="readyForInoculation"
                        checked={editFormData.readyForInoculation === false}
                        onChange={() => setEditFormData(prev => ({...prev, readyForInoculation: false}))}
                        className="form-radio text-red-600"
                        disabled={treeStatus.isFinal}
                      />
                      <span className="ml-2">No</span>
                    </label>
                  </div>
                  {!treeStatus.isFinal && inoculationReady.ready && (
                    <p className="text-sm text-blue-600 mt-1">
                      Tree is ready for {inoculationReady.type} inoculation
                    </p>
                  )}
                </div>
                
                {/* Ready for Harvest */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Ready for Harvest</label>
                  <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="readyForHarvest"
                        checked={editFormData.readyForHarvest === true}
                        onChange={() => setEditFormData(prev => ({...prev, readyForHarvest: true}))}
                        className="form-radio text-green-600"
                        disabled={treeStatus.isFinal}
                      />
                      <span className="ml-2">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="readyForHarvest"
                        checked={editFormData.readyForHarvest === false}
                        onChange={() => setEditFormData(prev => ({...prev, readyForHarvest: false}))}
                        className="form-radio text-red-600"
                        disabled={treeStatus.isFinal}
                      />
                      <span className="ml-2">No</span>
                    </label>
                  </div>
                  {!treeStatus.isFinal && harvestReady.ready && (
                    <p className="text-sm text-orange-600 mt-1">
                      Tree is ready for harvest (8+ years old with both inoculations completed)
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Lifecycle Information</h3>
                <div className="text-sm text-blue-600 space-y-1">
                  <p><strong>Current Age:</strong> {displayAge(tree.plantedDate)}</p>
                  <p><strong>Calculated Status:</strong> {treeStatus.status}</p>
                  <p><strong>Inoculation Count:</strong> {tree.inoculationCount}</p>
                  <p><strong>Can Progress:</strong> {canProgress ? 'Yes' : 'No'}</p>
                  {tree.plantedDate && canProgress && (
                    <p><strong>Next Milestone:</strong> {
                      tree.inoculationCount === 0 && tree.healthStatus === 'Healthy' && calculateTreeAge(tree.plantedDate).years < 4 
                        ? Ready for 1st inoculation in ${4 - calculateTreeAge(tree.plantedDate).years} years
                        : tree.inoculationCount === 1 && tree.healthStatus === 'Healthy' && calculateTreeAge(tree.plantedDate).totalMonths < 52
                        ? Ready for 2nd inoculation in ${52 - calculateTreeAge(tree.plantedDate).totalMonths} months
                        : tree.inoculationCount === 2 && tree.healthStatus === 'Healthy' && calculateTreeAge(tree.plantedDate).years < 8
                        ? Ready for harvest in ${8 - calculateTreeAge(tree.plantedDate).years} years
                        : 'All milestones completed'
                    }</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t">
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateTree}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 font-medium"
                  disabled={treeStatus.isFinal}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* Reassign NFC Modal */}
      {isReassignNFCOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-96">
            <h3 className="font-semibold text-lg mb-4">Reassign NFC Tag</h3>
            <input
              type="text"
              placeholder="Enter new NFC Tag ID"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition duration-200"
                onClick={() => setReassignNFCOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white transition duration-200"
                onClick={() => handleReassignNFC(document.querySelector('input').value)}
              >
                Reassign
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

      {/* Edit Tree Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Edit Tree - {tree.treeId}</h2>
              <button 
                onClick={() => setEditModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition duration-200"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Editable fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">NFC Tag ID</label>
                  <input
                    type="text"
                    value={editFormData.nfcTagId}
                    onChange={(e) => setEditFormData(prev => ({...prev, nfcTagId: e.target.value}))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter NFC Tag ID"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Investor ID</label>
                  <input
                    type="text"
                    value={editFormData.investorId}
                    onChange={(e) => setEditFormData(prev => ({...prev, investorId: e.target.value}))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter Investor ID"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Investor Name</label>
                  <input
                    type="text"
                    value={editFormData.investorName}
                    onChange={(e) => setEditFormData(prev => ({...prev, investorName: e.target.value}))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter Investor Name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Block</label>
                  <select
                    value={editFormData.block}
                    onChange={(e) => setEditFormData(prev => ({...prev, block: e.target.value}))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select Block</option>
                    <option value="Block-A">Block A</option>
                    <option value="Block-B">Block B</option>
                    <option value="Block-C">Block C</option>
                    <option value="Block-D">Block D</option>
                    <option value="Block-E">Block E</option>
                    <option value="Block-F">Block F</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Health Status</label>
                  <select
                    value={editFormData.healthStatus}
                    onChange={(e) => setEditFormData(prev => ({...prev, healthStatus: e.target.value}))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="Healthy">Healthy</option>
                    <option value="Warning">Warning</option>
                    <option value="Damaged">Damaged</option>
                    <option value="Dead">Dead</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Lifecycle Status</label>
                  <select
                    value={editFormData.lifecycleStatus}
                    onChange={(e) => setEditFormData(prev => ({...prev, lifecycleStatus: e.target.value}))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="Growing">Growing</option>
                    <option value="Ready for 1st Inoculation">Ready for 1st Inoculation</option>
                    <option value="Inoculated Once">Inoculated Once</option>
                    <option value="Ready for 2nd Inoculation">Ready for 2nd Inoculation</option>
                    <option value="Inoculated Twice">Inoculated Twice</option>
                    <option value="Ready for Harvest">Ready for Harvest</option>
                    <option value="Harvested">Harvested</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t">
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateTree}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 font-medium"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}