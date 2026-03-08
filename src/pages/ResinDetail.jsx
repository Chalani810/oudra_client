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

// Centralized Configuration
const STATUS_OPTIONS = {
  READY: {
    value: "Ready",
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    bgColor: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100 hover:shadow-md",
    icon: "✅",
    label: "Mark as Ready",
    description: "Analysis is complete and verified"
  },
  MEDIUM: {
    value: "Medium", 
    color: "bg-amber-100 text-amber-800 border-amber-200",
    bgColor: "bg-amber-50 border-amber-200 hover:bg-amber-100 hover:shadow-md",
    icon: "⚠️",
    label: "Mark as Medium",
    description: "Requires review or follow-up"
  },
  NOT_READY: {
    value: "Not Ready",
    color: "bg-rose-100 text-rose-800 border-rose-200", 
    bgColor: "bg-rose-50 border-rose-200 hover:bg-rose-100 hover:shadow-md",
    icon: "❌",
    label: "Mark as Not Ready",
    description: "Analysis failed or needs rework"
  },
  PENDING: {
    value: "Pending",
    color: "bg-sky-100 text-sky-800 border-sky-200",
    bgColor: "bg-sky-50 border-sky-200 hover:bg-sky-100 hover:shadow-md",
    icon: "⏳",
    label: "Mark as Pending",
    description: "Waiting for processing"
  }
};

const RISK_LEVELS = {
  HIGH: {
    value: "High",
    color: "border-rose-500 text-rose-600 bg-rose-50",
    ring: "ring-rose-500"
  },
  MODERATE: {
    value: "Moderate", 
    color: "border-amber-500 text-amber-600 bg-amber-50",
    ring: "ring-amber-500"
  },
  LOW: {
    value: "Low",
    color: "border-emerald-500 text-emerald-600 bg-emerald-50",
    ring: "ring-emerald-500"
  },
  CRITICAL: {
    value: "Critical",
    color: "border-red-700 text-red-800 bg-red-100",
    ring: "ring-red-700"
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
      bgColor: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
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
      bgColor: "bg-green-50 border-green-200 hover:bg-green-100"
    }
  },
  MEDIUM: {
    REVIEW_REQUIRED: {
      action: "Review Required",
      icon: "👀",
      label: "Review Required", 
      description: "Additional review needed",
      defaultNotes: "Analysis requires additional expert review",
      bgColor: "bg-amber-50 border-amber-200 hover:bg-amber-100"
    },
    FOLLOW_UP_NEEDED: {
      action: "Follow-up Needed",
      icon: "📞",
      label: "Follow-up Needed",
      description: "Follow-up action required", 
      defaultNotes: "Follow-up action needed with team",
      bgColor: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100"
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
      bgColor: "bg-rose-50 border-rose-200 hover:bg-rose-100"
    },
    QUALITY_ISSUE: {
      action: "Quality Issue",
      icon: "🚫",
      label: "Quality Issue",
      description: "Quality standards not met", 
      defaultNotes: "Quality standards not met, requires correction",
      bgColor: "bg-red-50 border-red-200 hover:bg-red-100"
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
      bgColor: "bg-sky-50 border-sky-200 hover:bg-sky-100"
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

const GENERAL_WORKFLOW_ACTIONS = {
  IMAGE_UPLOADED: {
    action: "Image Uploaded",
    icon: "🖼️",
    label: "Image Uploaded",
    description: "Record new image upload",
    defaultNotes: "New resin image uploaded for analysis",
    bgColor: "bg-slate-50 border-slate-200 hover:bg-slate-100"
  },
  ADDITIONAL_TESTING: {
    action: "Additional Testing",
    icon: "🧪",
    label: "Additional Testing",
    description: "Record additional tests performed",
    defaultNotes: "Additional testing conducted on resin sample",
    bgColor: "bg-slate-50 border-slate-200 hover:bg-slate-100"
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

  const updateStatus = async () => {
    if (!newStatus || !workflowNotes.trim()) {
      alert("Please select a status and add notes");
      return;
    }

    setUpdating(true);
    try {
      const res = await axios.patch(`http://localhost:5000/resin/${analysis._id}/status`,
        { status: newStatus, notes: workflowNotes, performedBy: "Current User" },
        { headers: getAuthHeaders() }
      );

      if (res.data && res.data.data) {
        setAnalysis(res.data.data);
        setShowStatusModal(false);
        setNewStatus("");
        setWorkflowNotes("");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      alert(`Failed to update status: ${err.response?.data?.message || err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const addWorkflowLog = async (action, notes) => {
    if (!notes.trim()) {
      alert("Please add notes for this action");
      return;
    }

    setUpdating(true);
    try {
      const res = await axios.post(
        `http://localhost:5000/resin/${analysis._id}/workflow-log`,
        { action, notes, performedBy: "Current User" },
        { headers: getAuthHeaders() }
      );

      if (res.data && res.data.data) {
        setAnalysis(res.data.data);
        setShowNoteModal(false);
        setWorkflowNotes("");
        setSelectedAction("");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
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

  const getStatusConfig = (status) => {
    return Object.values(STATUS_OPTIONS).find(s => s.value === status) || 
      { color: "bg-slate-100 text-slate-800 border-slate-200" };
  };

  const getRiskLevelConfig = (riskLevel) => {
    return Object.values(RISK_LEVELS).find(r => r.value === riskLevel) || 
      { color: "border-slate-300 text-slate-700 bg-slate-50", ring: "ring-slate-300" };
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
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading resin details...</p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-rose-100">
          <span className="text-4xl mb-4 block">⚠️</span>
          <p className="text-rose-600 font-medium">{error || "Error loading record"}</p>
        </div>
      </div>
    );
  }

  const currentStatusActions = getCurrentStatusActions();
  const generalActions = GENERAL_WORKFLOW_ACTIONS;
  const riskConfig = getRiskLevelConfig(analysis.riskLevel);
  const statusConfig = getStatusConfig(analysis.status);

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <SidePanel />
      <div className="flex-1 ml-64 flex flex-col">
        <ResinTopbar />
        
        <div className="p-8 max-w-7xl mx-auto w-full">
          {/* Header Section */}
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-slate-800">
                  Tree ID: {analysis.treeId?.treeId}
                </h1>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}>
                  {analysis.status}
                </span>
              </div>
              <p className="text-slate-500 text-sm">
                AI Analysis Recorded: {new Date(analysis.timestamp).toLocaleString()}
              </p>
            </div>
            
            {/* Added missing trigger for status update */}
            <button 
              onClick={() => setShowStatusModal(true)}
              className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg shadow-sm hover:bg-slate-50 hover:text-blue-600 transition-all flex items-center gap-2"
            >
              <span>🔄</span> Update Status
            </button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Left Column - Details & Workflow */}
            <div className="xl:col-span-2 space-y-8">
              
              {/* Score Card - Refined aesthetic */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                  <span>🔬</span> Analysis Results
                </h2>
                
                <div className="flex flex-col md:flex-row items-center gap-10">
                  {/* Circular Score Indicator */}
                  <div className="relative">
                    <div className={`w-36 h-36 rounded-full border-8 flex items-center justify-center bg-white shadow-inner ${riskConfig.color}`}>
                      <div className="text-center">
                        <span className="text-4xl font-black text-slate-800 tracking-tighter">
                          {analysis.resinScore}
                        </span>
                        <span className="text-lg font-bold text-slate-500">%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4 w-full">
                    <div>
                      <h3 className={`text-xl font-bold capitalize ${riskConfig.color.split(' ')[1]}`}>
                        {analysis.riskLevel} Risk
                      </h3>
                      <p className="text-slate-500 text-sm">Resin Formation Probability</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Block Location</p>
                        <p className="font-medium text-slate-700">{analysis.block}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Assigned Worker</p>
                        <p className="font-medium text-slate-700">{analysis.workerName || "Unassigned"}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Record ID</p>
                        <p className="font-mono text-sm text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">{analysis._id}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Workflow Log - Redesigned as a continuous timeline */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <span>📋</span> Workflow Timeline
                  </h2>
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-medium">
                    {analysis.workflowLog?.length || 0} Entries
                  </span>
                </div>
                
                <div className="pl-4">
                  {analysis.workflowLog && analysis.workflowLog.length > 0 ? (
                    <div className="relative border-l-2 border-slate-100 space-y-8 pb-4">
                      {[...analysis.workflowLog].reverse().map((log, index) => (
                        <div key={index} className="relative pl-8 group">
                          {/* Timeline Dot */}
                          <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-blue-400 group-hover:border-blue-600 transition-colors shadow-sm"></div>
                          
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">{getActionIcon(log.action)}</span>
                                <h3 className="font-semibold text-slate-800">{log.action}</h3>
                              </div>
                              <p className="text-slate-600 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100 mt-2">
                                {log.notes}
                              </p>
                              {log.fromStatus && log.toStatus && (
                                <div className="flex items-center gap-2 mt-3 text-xs font-medium text-slate-500">
                                  <span className="px-2 py-1 bg-slate-100 rounded text-slate-600">{log.fromStatus}</span>
                                  <span>→</span>
                                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">{log.toStatus}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="text-right shrink-0">
                              <p className="text-sm font-medium text-slate-700">
                                {new Date(log.timestamp).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-slate-400 mb-2">
                                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                                By {log.performedBy}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      <span className="text-3xl mb-3 block opacity-50">📝</span>
                      <p className="text-slate-600 font-medium">No workflow logs recorded</p>
                      <p className="text-sm text-slate-400 mt-1">Updates and actions will appear here</p>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Right Column - Actions */}
            <div className="space-y-6">
              
              {/* Contextual Quick Actions */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Current Status Actions
                </h2>
                <div className="space-y-3">
                  {Object.values(currentStatusActions).length > 0 ? (
                    Object.entries(currentStatusActions).map(([key, action]) => (
                      <button 
                        key={key}
                        onClick={() => handleQuickAction(action)}
                        className={`w-full text-left p-4 border rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none ${action.bgColor}`}
                        disabled={updating}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-xl mt-0.5">{action.icon}</span>
                          <div>
                            <p className="font-semibold text-slate-800">{action.label}</p>
                            <p className="text-xs text-slate-600 mt-1">{action.description}</p>
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 italic p-4 bg-slate-50 rounded-lg text-center border border-slate-100">
                      No contextual actions for current status.
                    </p>
                  )}
                </div>
              </div>

              {/* General Actions */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Standard Actions
                </h2>
                <div className="space-y-3">
                  {Object.entries(generalActions).map(([key, action]) => (
                    <button 
                      key={key}
                      onClick={() => handleQuickAction(action)}
                      className={`w-full text-left p-4 border rounded-xl transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none ${action.bgColor}`}
                      disabled={updating}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xl mt-0.5">{action.icon}</span>
                        <div>
                          <p className="font-semibold text-slate-800">{action.label}</p>
                          <p className="text-xs text-slate-600 mt-1">{action.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Status Update Modal with Backdrop Blur */}
        {showStatusModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-bold text-slate-800">Update Status</h3>
                <button onClick={() => setShowStatusModal(false)} className="text-slate-400 hover:text-slate-600 text-xl">&times;</button>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">New Status</label>
                  <select 
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none"
                    disabled={updating}
                  >
                    <option value="">Select Target Status...</option>
                    {Object.values(STATUS_OPTIONS).map(status => (
                      <option key={status.value} value={status.value}>
                        {status.value}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Reason / Notes</label>
                  <textarea
                    value={workflowNotes}
                    onChange={(e) => setWorkflowNotes(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none resize-none"
                    rows="4"
                    placeholder="Provide context for this status change..."
                    disabled={updating}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
                    disabled={updating}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={updateStatus}
                    disabled={!newStatus || !workflowNotes.trim() || updating}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-sm"
                  >
                    {updating ? "Saving..." : "Confirm Status"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Workflow Note Modal */}
        {showNoteModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-bold text-slate-800">Add Action Log</h3>
                <button onClick={() => setShowNoteModal(false)} className="text-slate-400 hover:text-slate-600 text-xl">&times;</button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Selected Action</label>
                  <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-medium flex items-center gap-2">
                    {getActionIcon(selectedAction)} {selectedAction}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Details</label>
                  <textarea
                    value={workflowNotes}
                    onChange={(e) => setWorkflowNotes(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none resize-none"
                    rows="4"
                    placeholder="Add details about this action..."
                    disabled={updating}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowNoteModal(false)}
                    className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
                    disabled={updating}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => addWorkflowLog(selectedAction, workflowNotes)}
                    disabled={!workflowNotes.trim() || updating}
                    className="flex-1 px-4 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-sm"
                  >
                    {updating ? "Saving..." : "Save Log"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ResinDetail;