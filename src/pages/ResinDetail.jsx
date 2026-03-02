import React, { useEffect, useState } from "react";
import SidePanel from "../component/SidePanel";
import ResinTopbar from "../component/Resin/ResinTopbar";
import axios from "axios";
import { useParams } from "react-router-dom";

// Helper: get auth headers from localStorage token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Centralized Configuration - Single Source of Truth
const STATUS_OPTIONS = {
  READY: {
    value: "Ready",
    color: "bg-green-100 text-green-800",
    bgColor: "bg-green-50 border-green-200 hover:bg-green-100",
    icon: "✅",
    label: "Mark as Ready",
    description: "Analysis is complete and verified"
  },
  MEDIUM: {
    value: "Medium", 
    color: "bg-yellow-100 text-yellow-800",
    bgColor: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
    icon: "⚠️",
    label: "Mark as Medium",
    description: "Requires review or follow-up"
  },
  NOT_READY: {
    value: "Not Ready",
    color: "bg-red-100 text-red-800", 
    bgColor: "bg-red-50 border-red-200 hover:bg-red-100",
    icon: "❌",
    label: "Mark as Not Ready",
    description: "Analysis failed or needs rework"
  },
  PENDING: {
    value: "Pending",
    color: "bg-blue-100 text-blue-800",
    bgColor: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    icon: "⏳",
    label: "Mark as Pending",
    description: "Waiting for processing"
  }
};

const RISK_LEVELS = {
  HIGH: {
    value: "High",
    color: "border-red-600 text-red-700"
  },
  MODERATE: {
    value: "Moderate", 
    color: "border-yellow-600 text-yellow-700"
  },
  LOW: {
    value: "Low",
    color: "border-green-600 text-green-700"
  },
  CRITICAL: {
    value: "Critical",
    color: "border-red-800 text-red-900"
  }
};

// Status-specific quick actions
const STATUS_QUICK_ACTIONS = {
  READY: {
    VERIFICATION_COMPLETE: {
      action: "Verification Complete",
      icon: "✅",
      label: "Verification Complete", 
      description: "Final verification completed",
      defaultNotes: "All quality checks passed and verification completed",
      bgColor: "bg-green-50 border-green-200 hover:bg-green-100"
    },
    READY_FOR_NEXT_STEP: {
      action: "Ready for Next Step",
      icon: "➡️",
      label: "Ready for Next Step",
      description: "Analysis ready for next process", 
      defaultNotes: "Analysis verified and ready for next processing step",
      bgColor: "bg-teal-50 border-teal-200 hover:bg-teal-100"
    },
    QUALITY_APPROVED: {
      action: "Quality Approved",
      icon: "🏆",
      label: "Quality Approved",
      description: "Quality standards met and approved",
      defaultNotes: "Quality standards fully met and approved",
      bgColor: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
    }
  },
  MEDIUM: {
    REVIEW_REQUIRED: {
      action: "Review Required",
      icon: "👀",
      label: "Review Required", 
      description: "Additional review needed",
      defaultNotes: "Analysis requires additional expert review",
      bgColor: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100"
    },
    FOLLOW_UP_NEEDED: {
      action: "Follow-up Needed",
      icon: "📞",
      label: "Follow-up Needed",
      description: "Follow-up action required", 
      defaultNotes: "Follow-up action needed with team",
      bgColor: "bg-amber-50 border-amber-200 hover:bg-amber-100"
    },
    DATA_VERIFICATION: {
      action: "Data Verification",
      icon: "🔍",
      label: "Data Verification",
      description: "Verify analysis data",
      defaultNotes: "Need to verify analysis data and parameters",
      bgColor: "bg-orange-50 border-orange-200 hover:bg-orange-100"
    }
  },
  NOT_READY: {
    REANALYSIS_NEEDED: {
      action: "Reanalysis Needed",
      icon: "🔄",
      label: "Reanalysis Needed", 
      description: "Complete reanalysis required",
      defaultNotes: "Complete reanalysis of the sample required",
      bgColor: "bg-red-50 border-red-200 hover:bg-red-100"
    },
    QUALITY_ISSUE: {
      action: "Quality Issue",
      icon: "🚫",
      label: "Quality Issue",
      description: "Quality standards not met", 
      defaultNotes: "Quality standards not met, requires correction",
      bgColor: "bg-rose-50 border-rose-200 hover:bg-rose-100"
    },
    TECHNICAL_PROBLEM: {
      action: "Technical Problem",
      icon: "🔧",
      label: "Technical Problem",
      description: "Technical issue identified",
      defaultNotes: "Technical problem identified during analysis",
      bgColor: "bg-pink-50 border-pink-200 hover:bg-pink-100"
    }
  },
  PENDING: {
    WAITING_FOR_DATA: {
      action: "Waiting for Data",
      icon: "⏳",
      label: "Waiting for Data", 
      description: "Awaiting additional data",
      defaultNotes: "Waiting for additional data to complete analysis",
      bgColor: "bg-blue-50 border-blue-200 hover:bg-blue-100"
    },
    IN_PROGRESS: {
      action: "Analysis in Progress",
      icon: "📊",
      label: "Analysis in Progress",
      description: "Analysis currently being processed", 
      defaultNotes: "Analysis is currently in progress",
      bgColor: "bg-cyan-50 border-cyan-200 hover:bg-cyan-100"
    },
    ON_HOLD: {
      action: "Analysis on Hold",
      icon: "⏸️",
      label: "Analysis on Hold",
      description: "Analysis temporarily on hold",
      defaultNotes: "Analysis temporarily placed on hold",
      bgColor: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100"
    }
  }
};

// General workflow actions (always visible)
const GENERAL_WORKFLOW_ACTIONS = {
  IMAGE_UPLOADED: {
    action: "Image Uploaded",
    icon: "🖼️",
    label: "Image Uploaded",
    description: "Record new image upload",
    defaultNotes: "New resin image uploaded for analysis",
    bgColor: "bg-gray-50 border-gray-200 hover:bg-gray-100"
  },
  ADDITIONAL_TESTING: {
    action: "Additional Testing",
    icon: "🧪",
    label: "Additional Testing",
    description: "Record additional tests performed",
    defaultNotes: "Additional testing conducted on resin sample",
    bgColor: "bg-gray-50 border-gray-200 hover:bg-gray-100"
  }
};

const ResinDetail = () => {
  const { treeId } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [workflowNotes, setWorkflowNotes] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadData();
  }, [treeId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/resin/record/${treeId}`,
        { headers: getAuthHeaders() }
      );
      if (!res.data || !res.data.data) {
        setError("No analysis record found.");
        setLoading(false);
        return;
      }
      setAnalysis(res.data.data);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load resin analysis details");
    } finally {
      setLoading(false);
    }
  };

// FIXED: Update Status Function with Debugging
const updateStatus = async () => {
  if (!newStatus || !workflowNotes.trim()) {
    alert("Please select a status and add notes");
    return;
  }

  setUpdating(true);
  try {
    console.log("Updating status with data:", {
      analysisId: analysis._id,
      newStatus,
      workflowNotes,
      url: `http://localhost:5000/resin/${analysis._id}/status`
    });

    const res = await axios.patch(`http://localhost:5000/resin/${analysis._id}/status`,
   { status: newStatus, notes: workflowNotes, performedBy: "Current User" },
   { headers: getAuthHeaders() }
 );

    console.log("Response from server:", res.data);

    if (res.data && res.data.data) {
      setAnalysis(res.data.data);
      setShowStatusModal(false);
      setNewStatus("");
      setWorkflowNotes("");
      alert("Status updated successfully!");
    } else {
      throw new Error("Invalid response from server");
    }
  } catch (err) {
    console.error("Error updating status:", err);
    console.error("Error details:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status
    });
    alert(`Failed to update status: ${err.response?.data?.message || err.message}`);
  } finally {
    setUpdating(false);
  }
};

  // FIXED: Add Workflow Log Function
  const addWorkflowLog = async (action, notes) => {
    if (!notes.trim()) {
      alert("Please add notes for this action");
      return;
    }

    setUpdating(true);
    try {
      const res = await axios.post(
        `http://localhost:5000/resin/${analysis._id}/workflow-log`,
        {
          action,
          notes,
          performedBy: "Current User"
        },
        { headers: getAuthHeaders() }
      );

      if (res.data && res.data.data) {
        setAnalysis(res.data.data);
        setShowNoteModal(false);
        setWorkflowNotes("");
        setSelectedAction("");
        alert("Workflow log added successfully!");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("Error adding workflow log:", err);
      alert(`Failed to add workflow log: ${err.response?.data?.message || err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleQuickAction = (actionConfig) => {
    setSelectedAction(actionConfig.action);
    setWorkflowNotes(actionConfig.defaultNotes);
    setShowNoteModal(true);
  };

  // Helper functions
  const getStatusColor = (status) => {
    const statusConfig = Object.values(STATUS_OPTIONS).find(s => s.value === status);
    return statusConfig ? statusConfig.color : "bg-gray-100 text-gray-800";
  };

  const getRiskLevelColor = (riskLevel) => {
    const riskConfig = Object.values(RISK_LEVELS).find(r => r.value === riskLevel);
    return riskConfig ? riskConfig.color : "border-gray-600 text-gray-700";
  };

  const getActionIcon = (action) => {
    for (const statusActions of Object.values(STATUS_QUICK_ACTIONS)) {
      const actionConfig = Object.values(statusActions).find(a => a.action === action);
      if (actionConfig) return actionConfig.icon;
    }
    const generalAction = Object.values(GENERAL_WORKFLOW_ACTIONS).find(a => a.action === action);
    return generalAction ? generalAction.icon : "📝";
  };

  const getCurrentStatusActions = () => {
    if (!analysis?.status) return [];
    const statusKey = analysis.status.toUpperCase().replace(' ', '_');
    return STATUS_QUICK_ACTIONS[statusKey] || [];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-700">Loading resin details...</p>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600">
        {error || "Error loading record"}
      </div>
    );
  }

  const currentStatusActions = getCurrentStatusActions();
  const generalActions = GENERAL_WORKFLOW_ACTIONS;

  return (
    <div className="flex">
      <SidePanel />
      <div className="flex-1 ml-64">
        <ResinTopbar />
        <div className="p-6 bg-gray-100 min-h-screen">

          {/* Header with Status */}
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Tree ID: {analysis.treeId?.treeId} – AI Resin Analysis
              </h1>
              <p className="text-gray-500">
                Last Analysis: {new Date(analysis.timestamp).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(analysis.status)}`}>
                Status: {analysis.status}
              </span>
              <button
                onClick={() => {
                  setNewStatus("");
                  setWorkflowNotes("");
                  setShowStatusModal(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={updating}
              >
                {updating ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column - Analysis Details */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Score Card */}
              <div className="bg-white rounded-xl p-6 shadow">
                <h2 className="text-lg font-semibold mb-4">Resin Analysis</h2>
                <div className="flex items-center space-x-6">
                  <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center text-3xl font-bold ${getRiskLevelColor(analysis.riskLevel)}`}>
                    {analysis.resinScore}%
                  </div>
                  <div>
                    <p className="text-gray-700 text-lg font-bold capitalize">{analysis.riskLevel} Risk</p>
                    <p className="text-gray-500">Resin Formation Detected</p>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <p><strong>Block:</strong> {analysis.block}</p>
                      <p><strong>Worker:</strong> {analysis.workerName || "Not assigned"}</p>
                      <p><strong>Analysis ID:</strong> {analysis._id}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Workflow Log */}
              <div className="bg-white rounded-xl p-6 shadow">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Workflow Log</h2>
                  <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">
                    {analysis.workflowLog?.length || 0} entries
                  </span>
                </div>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {analysis.workflowLog && analysis.workflowLog.length > 0 ? (
                    [...analysis.workflowLog].reverse().map((log, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4 py-3 bg-gray-50 rounded-r-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-3">
                            <span className="text-xl mt-1">{getActionIcon(log.action)}</span>
                            <div>
                              <p className="font-semibold text-gray-800">{log.action}</p>
                              <p className="text-sm text-gray-600 mt-1">{log.notes}</p>
                              {log.fromStatus && log.toStatus && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Status changed: <span className="font-medium">{log.fromStatus}</span> → <span className="font-medium">{log.toStatus}</span>
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right text-sm text-gray-500 min-w-32">
                            <p className="font-medium">{new Date(log.timestamp).toLocaleDateString()}</p>
                            <p>{new Date(log.timestamp).toLocaleTimeString()}</p>
                            <p className="mt-1 text-xs">By: {log.performedBy}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p className="text-lg">No workflow logs yet</p>
                      <p className="text-sm mt-2">Start by updating the status or adding a log entry</p>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Right Column - Quick Actions */}
            <div className="space-y-6">
              
              {/* Status-specific Quick Actions */}
              <div className="bg-white rounded-xl p-6 shadow">
                <h2 className="text-lg font-semibold mb-4">
                  {analysis.status} - Quick Actions
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Add notes specific to current status: <span className="font-semibold">{analysis.status}</span>
                </p>
                <div className="space-y-3">
                  {Object.values(currentStatusActions).length > 0 ? (
                    Object.entries(currentStatusActions).map(([key, action]) => (
                      <button 
                        key={key}
                        onClick={() => handleQuickAction(action)}
                        className={`w-full text-left p-3 ${action.bgColor} rounded-lg transition-colors disabled:opacity-50`}
                        disabled={updating}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{action.icon}</span>
                          <div>
                            <p className="font-semibold">{action.label}</p>
                            <p className="text-sm text-gray-600">{action.description}</p>
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <p>No quick actions available for {analysis.status} status</p>
                      <p className="text-sm mt-1">Use the Update Status button to change status</p>
                    </div>
                  )}
                </div>
              </div>

              {/* General Workflow Actions */}
              <div className="bg-white rounded-xl p-6 shadow">
                <h2 className="text-lg font-semibold mb-4">General Actions</h2>
                <p className="text-sm text-gray-600 mb-4">
                  General workflow activities available for all statuses
                </p>
                <div className="space-y-3">
                  {Object.entries(generalActions).map(([key, action]) => (
                    <button 
                      key={key}
                      onClick={() => handleQuickAction(action)}
                      className={`w-full text-left p-3 ${action.bgColor} rounded-lg transition-colors disabled:opacity-50`}
                      disabled={updating}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{action.icon}</span>
                        <div>
                          <p className="font-semibold">{action.label}</p>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Analysis Information */}
              <div className="bg-white rounded-xl p-6 shadow">
                <h2 className="text-lg font-semibold mb-4">Analysis Information</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tree ID:</span>
                    <span className="font-medium">{analysis.treeId?.treeId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Block:</span>
                    <span className="font-medium">{analysis.block}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Resin Score:</span>
                    <span className="font-medium">{analysis.resinScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Risk Level:</span>
                    <span className={`font-medium px-2 py-1 rounded text-xs ${getStatusColor(analysis.riskLevel)}`}>
                      {analysis.riskLevel}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Worker:</span>
                    <span className="font-medium">{analysis.workerName || "Not assigned"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium">{new Date(analysis.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Status Update Modal */}
          {showStatusModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl p-6 max-w-md w-full">
                <h3 className="text-xl font-semibold mb-4">Update Analysis Status</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">New Status</label>
                    <select 
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={updating}
                    >
                      <option value="">Select Status</option>
                      {Object.values(STATUS_OPTIONS).map(status => (
                        <option key={status.value} value={status.value}>
                          {status.value}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Notes</label>
                    <textarea
                      value={workflowNotes}
                      onChange={(e) => setWorkflowNotes(e.target.value)}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="4"
                      placeholder="Add notes for this status change..."
                      disabled={updating}
                    />
                  </div>
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => {
                        setShowStatusModal(false);
                        setNewStatus("");
                        setWorkflowNotes("");
                      }}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:bg-gray-400"
                      disabled={updating}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={updateStatus}
                      disabled={!newStatus || !workflowNotes.trim() || updating}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {updating ? "Updating..." : "Update Status"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Workflow Note Modal */}
          {showNoteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl p-6 max-w-md w-full">
                <h3 className="text-xl font-semibold mb-4">Add Workflow Note</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Action</label>
                    <p className="p-3 bg-gray-100 rounded-lg font-medium">{selectedAction}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Notes</label>
                    <textarea
                      value={workflowNotes}
                      onChange={(e) => setWorkflowNotes(e.target.value)}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="4"
                      placeholder="Add details about this action..."
                      disabled={updating}
                    />
                  </div>
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => {
                        setShowNoteModal(false);
                        setWorkflowNotes("");
                        setSelectedAction("");
                      }}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:bg-gray-400"
                      disabled={updating}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => addWorkflowLog(selectedAction, workflowNotes)}
                      disabled={!workflowNotes.trim() || updating}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {updating ? "Adding..." : "Add Note"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ResinDetail;