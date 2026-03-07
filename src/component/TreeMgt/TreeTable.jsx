// path: oudra-client/src/component/TreeMgt/TreeTable.jsx
// CHANGES FROM EXISTING:
//  1. Added filters prop
//  2. Added applyFilters() function that filters trees client-side
//     by treeId, investorId, block, healthStatus, lifecycleStatus, ageMin, ageMax
//  3. Table now renders filteredTrees instead of trees
//  4. Shows filtered count vs total count in header
//  5. Shows "No trees match your filters" message when filters return nothing
//  6. All existing columns, styles, and actions unchanged

// path: oudra-client/src/component/TreeMgt/TreeTable.jsx
// path: oudra-client/src/component/TreeMgt/TreeTable.jsx
import React, { useState, useEffect } from "react";
import {
  MapPin, Trash2, Eye, RefreshCw,
  ShieldCheck, Share2, ExternalLink, X, CheckCircle, AlertCircle
} from "lucide-react";
import { treeService } from "../../services/treeService";
import { useNavigate } from "react-router-dom";

// ── Status badge colours ──────────────────────────────────────────────────
const statusColors = {
  Healthy: "bg-green-100 text-green-800",
  Warning: "bg-yellow-100 text-yellow-800",
  Damaged: "bg-red-100 text-red-800",
  Dead:    "bg-gray-800 text-white",
};

const lifecycleColors = {
  "Growing":                    "bg-blue-100 text-blue-800",
  "Ready for 1st Inoculation":  "bg-purple-100 text-purple-800",
  "Inoculated Once":            "bg-indigo-100 text-indigo-800",
  "Ready for 2nd Inoculation":  "bg-purple-100 text-purple-800",
  "Inoculated Twice":           "bg-indigo-100 text-indigo-800",
  "Ready for Harvest":          "bg-orange-100 text-orange-800",
  "Harvested":                  "bg-green-100 text-green-800",
};

// ── Helpers ───────────────────────────────────────────────────────────────
const getAgeInYears = (plantedDate) => {
  if (!plantedDate) return 0;
  return Math.abs(new Date() - new Date(plantedDate)) / (1000 * 60 * 60 * 24 * 365);
};

const calculateAge = (plantedDate) => {
  if (!plantedDate) return "N/A";
  const diffTime  = Math.abs(new Date() - new Date(plantedDate));
  const diffYears  = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
  const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
  return `${diffYears}Y ${diffMonths}M`;
};

// ── Sync result modal ─────────────────────────────────────────────────────
const SyncModal = ({ state, result, error, onClose }) => {
  if (state === "idle") return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-sm shadow-2xl p-6">

        {/* Syncing */}
        {state === "syncing" && (
          <div className="text-center py-4">
            <div className="flex justify-center mb-4">
              <RefreshCw size={48} className="text-indigo-500 animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Syncing to Polygon...
            </h3>
            <p className="text-sm text-gray-500">
              Sending transactions to the Amoy testnet. This may take up to 2 minutes.
              Do not close this window.
            </p>
          </div>
        )}

        {/* Success */}
        {state === "success" && result && (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle size={48} className="text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Sync Complete
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Enrolled on Polygon</span>
                <span className="font-bold text-green-600">{result.successCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Already verified</span>
                <span className="font-bold text-blue-600">{result.skippedCount ?? 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Failed</span>
                <span className="font-bold text-red-500">{result.failCount}</span>
              </div>
              {result.contractAddress && (
                <div className="pt-2 border-t">
                  <a
                    href={`https://amoy.polygonscan.com/address/${result.contractAddress}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    View contract on PolygonScan <ExternalLink size={10} />
                  </a>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Done
            </button>
          </div>
        )}

        {/* Error */}
        {state === "error" && (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle size={48} className="text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Sync Failed</h3>
            <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3 text-left mb-6">
              {error || "Unknown error occurred."}
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────
const TreeTable = ({ searchTerm = "", filters = {} }) => {
  const [trees,     setTrees]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [syncState, setSyncState] = useState("idle");   // idle | syncing | success | error
  const [syncResult, setSyncResult] = useState(null);
  const [syncError,  setSyncError]  = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchTrees(); }, []);

  const fetchTrees = async () => {
    try {
      setLoading(true);
      const data = await treeService.getAllTrees();
      setTrees(data);
    } catch (err) {
      setError("Failed to load trees");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ── Sync handler ─────────────────────────────────────────────
  const handleBlockchainSync = async () => {
    const pending = trees.filter((t) => t.blockchainStatus !== "Verified");

    if (pending.length === 0) {
      setSyncResult({ successCount: 0, skippedCount: trees.length, failCount: 0 });
      setSyncState("success");
      return;
    }

    if (
      !window.confirm(
        `Sync ${pending.length} pending tree${pending.length > 1 ? "s" : ""} to Polygon Network?\n\n` +
        "This will send blockchain transactions. Make sure your server wallet has POL for gas."
      )
    ) return;

    setSyncState("syncing");
    setSyncResult(null);
    setSyncError(null);

    try {
      const response = await treeService.syncToPolygon();
      setSyncResult(response.data || response);
      setSyncState("success");
      fetchTrees(); // Refresh table to show updated statuses
    } catch (err) {
      setSyncError(err.message);
      setSyncState("error");
    }
  };

  const closeSyncModal = () => {
    setSyncState("idle");
    setSyncResult(null);
    setSyncError(null);
  };

  // ── Client-side filtering ─────────────────────────────────────
  const applyFilters = (allTrees) =>
    allTrees.filter((tree) => {
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const match =
          tree.treeId?.toLowerCase().includes(term) ||
          tree.investorId?.toLowerCase().includes(term) ||
          tree.investorName?.toLowerCase().includes(term) ||
          tree.block?.toLowerCase().includes(term);
        if (!match) return false;
      }
      if (filters.treeId      && !tree.treeId?.toLowerCase().includes(filters.treeId.toLowerCase()))           return false;
      if (filters.investorId  && !tree.investorId?.toLowerCase().includes(filters.investorId.toLowerCase()))   return false;
      if (filters.block       && tree.block !== filters.block)       return false;
      if (filters.healthStatus    && tree.healthStatus    !== filters.healthStatus)    return false;
      if (filters.lifecycleStatus && tree.lifecycleStatus !== filters.lifecycleStatus) return false;
      if (filters.ageMin !== "" && filters.ageMin !== undefined) {
        if (getAgeInYears(tree.plantedDate) < parseFloat(filters.ageMin)) return false;
      }
      if (filters.ageMax !== "" && filters.ageMax !== undefined) {
        if (getAgeInYears(tree.plantedDate) > parseFloat(filters.ageMax)) return false;
      }
      return true;
    });

  const filteredTrees = applyFilters(trees);
  const pendingCount  = trees.filter((t) => t.blockchainStatus !== "Verified").length;

  const handleViewTree   = (treeId) => navigate(`/treeprofile/${treeId}`);
  const handleDeleteTree = async (treeId) => {
    if (window.confirm("Permanently delete this tree?")) {
      try {
        await treeService.deleteTree(treeId);
        fetchTrees();
      } catch {
        alert("Failed to delete tree.");
      }
    }
  };

  if (loading)
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
      </div>
    );

  return (
    <>
      {/* Sync modal */}
      <SyncModal
        state={syncState}
        result={syncResult}
        error={syncError}
        onClose={closeSyncModal}
      />

      <div className="overflow-x-auto w-full bg-white rounded-xl shadow-sm">
        {/* Header bar */}
        <div className="flex justify-between items-center p-4 border-b">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Trees ({filteredTrees.length}
              {filteredTrees.length !== trees.length && ` of ${trees.length}`})
            </h2>
            {pendingCount > 0 && (
              <p className="text-xs text-orange-500 mt-0.5">
                {pendingCount} tree{pendingCount > 1 ? "s" : ""} pending blockchain sync
              </p>
            )}
          </div>

          <div className="flex gap-2">
            {/* Sync button — shows badge with pending count */}
            <button
              onClick={handleBlockchainSync}
              disabled={syncState === "syncing"}
              className="relative flex items-center gap-2 px-3 py-2 text-sm bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors disabled:bg-indigo-300"
            >
              {syncState === "syncing" ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <Share2 size={16} />
              )}
              {syncState === "syncing" ? "Syncing..." : "Sync to Polygon"}
              {pendingCount > 0 && syncState !== "syncing" && (
                <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={fetchTrees}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              <RefreshCw size={16} /> Refresh
            </button>
          </div>
        </div>

        {/* Table */}
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3 text-left font-medium">Tree ID</th>
              <th className="p-3 text-left font-medium">Blockchain</th>
              <th className="p-3 text-left font-medium">Age</th>
              <th className="p-3 text-left font-medium">Investor</th>
              <th className="p-3 text-left font-medium">Block</th>
              <th className="p-3 text-left font-medium">Health</th>
              <th className="p-3 text-left font-medium">Lifecycle</th>
              <th className="p-3 text-center font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredTrees.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-gray-400 py-12">
                  No trees match your filters.
                </td>
              </tr>
            ) : (
              filteredTrees.map((tree) => (
                <tr key={tree._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{tree.treeId}</td>

                  {/* Blockchain status cell */}
                  <td className="p-3">
                    {tree.blockchainStatus === "Verified" ? (
                      <div className="flex items-center gap-1.5 text-green-700">
                        <ShieldCheck size={16} />
                        {tree.blockchainTxHash ? (
                          <a
                            href={`https://amoy.polygonscan.com/tx/${tree.blockchainTxHash}`}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:underline flex items-center gap-1 text-xs"
                          >
                            Verified <ExternalLink size={10} />
                          </a>
                        ) : (
                          <span className="text-xs">Verified</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 flex items-center gap-1.5 italic text-xs">
                        <RefreshCw size={14} /> Pending
                      </span>
                    )}
                  </td>

                  <td className="p-3">{calculateAge(tree.plantedDate)}</td>
                  <td className="p-3">{tree.investorId || "N/A"}</td>
                  <td className="p-3">{tree.block || "N/A"}</td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        statusColors[tree.healthStatus] || statusColors.Healthy
                      }`}
                    >
                      {tree.healthStatus}
                    </span>
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        lifecycleColors[tree.lifecycleStatus] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {tree.lifecycleStatus}
                    </span>
                  </td>

                  <td className="p-3 flex justify-center space-x-3">
                    <Eye
                      className="text-gray-400 hover:text-green-700 cursor-pointer"
                      size={18}
                      onClick={() => handleViewTree(tree.treeId)}
                    />
                    <Trash2
                      className="text-gray-400 hover:text-red-700 cursor-pointer"
                      size={18}
                      onClick={() => handleDeleteTree(tree.treeId)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TreeTable;
