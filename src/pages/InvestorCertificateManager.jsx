import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SidePanel from "../component/SidePanel";

// API Configuration
const API_URL = `${process.env.REACT_APP_API_URL}/api` || "http://localhost:5000/api";

const api = {
  investors: {
    getAll: () => fetch(`${API_URL}/investors`).then((r) => r.json()),
    getAvailableTrees: () => fetch(`${API_URL}/investors/trees/available`).then((r) => r.json()),
    getInvestorTrees: (id) => fetch(`${API_URL}/investors/${id}/trees`).then((r) => r.json()),
    getById: (id) => fetch(`${API_URL}/investors/${id}`).then((r) => r.json()),
    create: (data) => fetch(`${API_URL}/investors`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then((r) => r.json()),
    update: (id, data) => fetch(`${API_URL}/investors/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then((r) => r.json()),
    delete: (id) => fetch(`${API_URL}/investors/${id}`, { method: "DELETE" }).then((r) => r.json()),
    assignTree: (id, treeId) => fetch(`${API_URL}/investors/${id}/assign-tree`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ treeId }) }).then((r) => r.json()),
    unassignTree: (id, treeId) => fetch(`${API_URL}/investors/${id}/unassign-tree/${treeId}`, { method: "POST" }).then((r) => r.json()),
    bulkAssignTrees: (id, treeIds) => fetch(`${API_URL}/investors/${id}/bulk-assign-trees`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ treeIds }) }).then((r) => r.json()),
    getTreesForBulkAssignment: () => fetch(`${API_URL}/investors/trees/all-for-assignment`).then((r) => r.json()),
    getStats: () => fetch(`${API_URL}/investors/stats/overview`).then((r) => r.json()),
  },
  certificates: {
    getByInvestor: (investorId) => fetch(`${API_URL}/certificates/investor/${investorId}`).then((r) => r.json()),
    getHarvestableTrees: (investorId) => fetch(`${API_URL}/certificates/harvestable/${investorId}`).then((r) => r.json()),
  },
};

// Icons Component
const Icon = ({ name, size = 20, className = "" }) => {
  const icons = {
    plus: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14m-7-7h14" /></svg>),
    edit: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>),
    delete: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>),
    close: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6m0-6 6 6" /></svg>),
    award: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>),
    users: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>),
    chevronDown: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>),
    tree: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22v-7" /><path d="M8 15h8" /><path d="M12 2v5" /><path d="M18 12a6 6 0 1 0-12 0" /></svg>),
    search: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>),
    check: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>),
    spinner: (<svg className="animate-spin" width={size} height={size} viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>),
    info: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4m0-4h.01" /></svg>),
    harvest: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 18v-6a6 6 0 0 1 6-6h0a6 6 0 0 1 6 6v6" /><path d="M4 18H2" /><path d="M8 18H6" /><path d="M14 18h-2" /><path d="M16 18h-2" /><path d="M20 18h-2" /><path d="M12 8v8" /><path d="m15 5-6 6" /><path d="m9 5 6 6" /></svg>),
    money: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6" /></svg>),
    dollar: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6" /></svg>),
    user: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>),
    refresh: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>),
    download: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>),
    x: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>),
  };
  return <span className={className}>{icons[name] || icons.info}</span>;
};

// Modal Component
const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  if (!isOpen) return null;
  const sizes = { sm: "max-w-md", md: "max-w-2xl", lg: "max-w-4xl", xl: "max-w-6xl" };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg shadow-xl w-full ${sizes[size]} max-h-[90vh] overflow-hidden flex flex-col`}>
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition"><Icon name="close" size={24} /></button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

// ── HARVEST CERTIFICATE MODAL ─────────────────────────────────────────────────
// Simple: loads all harvested+verified trees for investor, one-click download
const HarvestCertificateModal = ({ isOpen, onClose, investor }) => {
  const [harvestedTrees, setHarvestedTrees] = useState([]);
  const [treesLoading, setTreesLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (isOpen && investor) {
      fetchHarvestedTrees();
    }
  }, [isOpen, investor]);

  const fetchHarvestedTrees = async () => {
    try {
      setTreesLoading(true);
      const response = await api.certificates.getHarvestableTrees(investor._id);
      if (response.success) {
        setHarvestedTrees(response.data || []);
      } else {
        setHarvestedTrees([]);
      }
    } catch (error) {
      console.error("Error fetching harvested trees:", error);
      setHarvestedTrees([]);
    } finally {
      setTreesLoading(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch(`${API_URL}/certificates/harvest/${investor._id}`);
      if (!response.ok) {
        const err = await response.json();
        alert(`❌ ${err.message || "Failed to generate certificate"}`);
        return;
      }
      // Trigger browser PDF download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Harvest_Certificate_${investor.investorId || investor._id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      onClose();
    } catch (error) {
      console.error("Download error:", error);
      alert("❌ Failed to download certificate");
    } finally {
      setDownloading(false);
    }
  };

  if (!investor) return null;

  const canDownload = !treesLoading && harvestedTrees.length > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Harvest Certificate" size="sm">
      <div className="p-6 space-y-5">

        {/* Investor info strip */}
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="p-2 bg-green-100 rounded-full">
            <Icon name="user" size={20} className="text-green-700" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">{investor.name}</p>
            <p className="text-xs text-gray-500">ID: {investor.investorId || investor._id}</p>
          </div>
        </div>

        {/* Harvested trees summary */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
            <Icon name="tree" size={16} className="text-green-600" />
            <span className="text-sm font-semibold text-gray-700">
              Harvested Trees Included in Certificate
            </span>
          </div>

          {treesLoading ? (
            <div className="flex items-center justify-center py-8 gap-3">
              <Icon name="spinner" size={24} className="text-green-600" />
              <span className="text-gray-500 text-sm">Loading trees...</span>
            </div>
          ) : harvestedTrees.length === 0 ? (
            <div className="text-center py-8 px-4">
              <div className="p-3 bg-amber-50 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Icon name="tree" size={24} className="text-amber-500" />
              </div>
              <p className="font-medium text-gray-700 mb-1">No eligible trees found</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Trees must have <span className="font-medium">Harvested</span> lifecycle status
                and be <span className="font-medium">Verified</span> on the blockchain
                before a certificate can be issued.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 max-h-48 overflow-y-auto">
              {harvestedTrees.map((tree) => (
                <div key={tree._id} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Icon name="tree" size={14} className="text-green-500" />
                    <span className="text-sm font-medium text-gray-800">{tree.treeId}</span>
                    <span className="text-xs text-gray-400">Block: {tree.block}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-700">Harvested</span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">✓ On-chain</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Certificate contents info */}
        {canDownload && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-xs font-semibold text-blue-800 mb-2">Certificate includes:</p>
            <div className="grid grid-cols-2 gap-1 text-xs text-blue-700">
              <span>✅ Blockchain tx hashes</span>
              <span>📍 GPS coordinates</span>
              <span>🔲 Scannable QR code</span>
              <span>🏛️ Oudra branding</span>
              <span>📅 Timestamped</span>
              <span>📊 ROI summary</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
            disabled={downloading}
          >
            Cancel
          </button>
          <button
            onClick={handleDownload}
            disabled={!canDownload || downloading}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition font-medium text-sm ${
              canDownload && !downloading
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {downloading ? (
              <><Icon name="spinner" size={18} /> Generating PDF...</>
            ) : (
              <><Icon name="download" size={18} /> Download Certificate</>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Edit Investor Modal
const EditInvestorModal = ({ isOpen, onClose, investor, onSuccess }) => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", investment: 0, status: "active" });
  const [availableTrees, setAvailableTrees] = useState([]);
  const [investorTrees, setInvestorTrees] = useState([]);
  const [selectedTreesToAdd, setSelectedTreesToAdd] = useState([]);
  const [selectedTreesToRemove, setSelectedTreesToRemove] = useState([]);
  const [loading, setLoading] = useState(false);
  const [treesLoading, setTreesLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => { if (isOpen && investor) initializeData(); }, [isOpen, investor]);

  const initializeData = async () => {
    setLoading(true);
    try {
      const investorRes = await api.investors.getById(investor._id);
      if (investorRes.success) {
        const d = investorRes.data;
        setFormData({ name: d.name, email: d.email, phone: d.phone, investment: d.investment || 0, status: d.status || "active" });
        const treesRes = await api.investors.getInvestorTrees(investor._id);
        if (treesRes.success) setInvestorTrees(treesRes.data || []);
        const allTreesRes = await api.investors.getTreesForBulkAssignment();
        if (allTreesRes.success) setAvailableTrees(allTreesRes.data || []);
      }
    } catch (error) { console.error("Error initializing edit data:", error); }
    finally { setLoading(false); setTreesLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const toggleTreeToAdd = (tree) => {
    if (selectedTreesToAdd.some((t) => t._id === tree._id)) {
      setSelectedTreesToAdd((prev) => prev.filter((t) => t._id !== tree._id));
    } else if (!investorTrees.some((t) => t._id === tree._id)) {
      setSelectedTreesToAdd((prev) => [...prev, tree]);
    }
  };

  const toggleTreeToRemove = (tree) => {
    if (selectedTreesToRemove.some((t) => t._id === tree._id)) {
      setSelectedTreesToRemove((prev) => prev.filter((t) => t._id !== tree._id));
    } else {
      setSelectedTreesToRemove((prev) => [...prev, tree]);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    const investment = parseFloat(formData.investment);
    if (isNaN(investment) || investment < 0) newErrors.investment = "Investment must be a valid number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await api.investors.update(investor._id, { name: formData.name, email: formData.email, phone: formData.phone, investment: parseFloat(formData.investment), status: formData.status });
      if (!response.success) throw new Error(response.message || "Failed to update investor");
      if (selectedTreesToRemove.length > 0) for (const tree of selectedTreesToRemove) await api.investors.unassignTree(investor._id, tree._id);
      if (selectedTreesToAdd.length > 0) await api.investors.bulkAssignTrees(investor._id, selectedTreesToAdd.map((t) => t._id));
      alert(`✅ Investor updated successfully!`);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      alert(`❌ Failed to update investor: ${error.message || "Unknown error"}`);
    } finally { setLoading(false); }
  };

  const handleRemoveSingleTree = async (treeId, treeName) => {
    if (!window.confirm(`Remove tree "${treeName}" from this investor?`)) return;
    try {
      setLoading(true);
      const response = await api.investors.unassignTree(investor._id, treeId);
      if (response.success) { alert("✅ Tree removed successfully"); initializeData(); }
      else alert(`❌ Failed to remove tree: ${response.message}`);
    } catch (error) { alert("❌ Failed to remove tree"); }
    finally { setLoading(false); }
  };

  const handleBulkAddTrees = async () => {
    if (selectedTreesToAdd.length === 0) { alert("Please select trees to add"); return; }
    try {
      setLoading(true);
      const response = await api.investors.bulkAssignTrees(investor._id, selectedTreesToAdd.map((t) => t._id));
      if (response.success) { alert(`✅ ${response.message || "Trees added successfully"}`); setSelectedTreesToAdd([]); initializeData(); }
      else alert(`❌ Failed to add trees: ${response.message}`);
    } catch (error) { alert("❌ Failed to add trees"); }
    finally { setLoading(false); }
  };

  const handleBulkRemoveTrees = async () => {
    if (selectedTreesToRemove.length === 0) { alert("Please select trees to remove"); return; }
    if (!window.confirm(`Remove ${selectedTreesToRemove.length} trees from this investor?`)) return;
    try {
      setLoading(true);
      let successCount = 0, failCount = 0;
      for (const tree of selectedTreesToRemove) {
        try { const r = await api.investors.unassignTree(investor._id, tree._id); if (r.success) successCount++; else failCount++; }
        catch { failCount++; }
      }
      alert(`✅ ${successCount} trees removed. Failed: ${failCount}`);
      setSelectedTreesToRemove([]);
      initializeData();
    } catch (error) { alert("❌ Failed to remove trees"); }
    finally { setLoading(false); }
  };

  const filteredAvailableTrees = availableTrees.filter((tree) => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return (tree.treeId?.toLowerCase().includes(s)) || (tree.block?.toLowerCase().includes(s)) || tree.currentInvestor?.investorName?.toLowerCase().includes(s);
  });

  if (!investor) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Investor - ${investor.name}`} size="xl">
      {loading && !formData.name ? (
        <div className="flex justify-center items-center p-8">
          <Icon name="spinner" size={32} className="text-blue-600" />
          <span className="ml-3 text-gray-600">Loading investor data...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg m-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Investor Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[["name", "Full Name", "text", "John Doe"], ["email", "Email", "email", "john@example.com"], ["phone", "Phone", "tel", "+1234567890"]].map(([field, label, type, placeholder]) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{label} <span className="text-red-500">*</span></label>
                  <input type={type} name={field} value={formData[field]} onChange={handleChange} placeholder={placeholder}
                    className={`w-full p-3 border ${errors[field] ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`} />
                  {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Investment Amount ($) <span className="text-red-500">*</span></label>
                <input type="number" name="investment" value={formData.investment} onChange={handleChange} placeholder="10000" min="0" step="0.01"
                  className={`w-full p-3 border ${errors.investment ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`} />
                {errors.investment && <p className="text-red-500 text-xs mt-1">{errors.investment}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-6 m-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2"><Icon name="tree" size={20} />Investor's Current Trees ({investorTrees.length})</h3>
                <p className="text-sm text-gray-600">Trees currently assigned to this investor</p>
              </div>
              {selectedTreesToRemove.length > 0 && (
                <button type="button" onClick={handleBulkRemoveTrees} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2">
                  <Icon name="delete" size={16} />Remove Selected ({selectedTreesToRemove.length})
                </button>
              )}
            </div>
            {investorTrees.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-white rounded-lg border border-gray-200">
                <Icon name="tree" size={48} className="mx-auto text-gray-400 mb-2" />
                <p className="text-lg mb-2">No trees assigned to this investor</p>
                <p className="text-sm">Assign trees using the section below</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {investorTrees.map((tree) => {
                  const isSelected = selectedTreesToRemove.some((t) => t._id === tree._id);
                  return (
                    <div key={tree._id} className={`bg-white border rounded-lg p-4 ${isSelected ? "border-red-500 bg-red-50" : "border-gray-200"}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div><p className="font-semibold text-gray-800">{tree.treeId}</p><p className="text-xs text-gray-500">Block: {tree.block}</p></div>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => handleRemoveSingleTree(tree._id, tree.treeId)} className="p-1 text-red-600 hover:text-red-800 transition"><Icon name="x" size={16} /></button>
                          <input type="checkbox" checked={isSelected} onChange={() => toggleTreeToRemove(tree)} className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" />
                        </div>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${tree.healthStatus === "Healthy" ? "bg-green-100 text-green-800" : tree.healthStatus === "Warning" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>{tree.healthStatus}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${tree.lifecycleStatus === "Growing" ? "bg-blue-100 text-blue-800" : tree.lifecycleStatus === "Harvested" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-800"}`}>{tree.lifecycleStatus}</span>
                        </div>
                        <p>Planted: {tree.plantedDate ? new Date(tree.plantedDate).toLocaleDateString() : "N/A"}</p>
                        {tree.gps?.lat && <p className="text-xs text-gray-500 truncate">GPS: {tree.gps.lat.toFixed(4)}, {tree.gps.lng.toFixed(4)}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-blue-50 p-6 m-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2"><Icon name="plus" size={20} />Add More Trees</h3>
                <p className="text-sm text-gray-600">Select available trees to assign to this investor</p>
              </div>
              {selectedTreesToAdd.length > 0 && (
                <button type="button" onClick={handleBulkAddTrees} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2">
                  <Icon name="plus" size={16} />Add Selected ({selectedTreesToAdd.length})
                </button>
              )}
            </div>
            <div className="relative mb-4">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2"><Icon name="search" size={20} className="text-gray-400" /></div>
              <input type="text" placeholder="Search available trees by ID, block, or current investor..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
            </div>
            {treesLoading ? (
              <div className="flex justify-center items-center p-8"><Icon name="spinner" size={32} className="text-green-600" /><span className="ml-3 text-gray-600">Loading available trees...</span></div>
            ) : filteredAvailableTrees.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-white rounded-lg border border-gray-200">
                <Icon name="tree" size={48} className="mx-auto text-gray-400 mb-2" />
                <p className="text-lg mb-2">No available trees found</p><p className="text-sm">All trees are currently assigned</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAvailableTrees.map((tree) => {
                  const isSelected = selectedTreesToAdd.some((t) => t._id === tree._id);
                  const isAlreadyAssigned = investorTrees.some((t) => t._id === tree._id);
                  return (
                    <div key={tree._id} onClick={() => !isAlreadyAssigned && toggleTreeToAdd(tree)}
                      className={`bg-white border rounded-lg p-4 cursor-pointer transition ${isSelected ? "border-green-500 bg-green-50" : isAlreadyAssigned ? "border-gray-300 bg-gray-100 cursor-not-allowed" : "border-gray-200 hover:border-green-300 hover:bg-green-50"}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div><p className="font-semibold text-gray-800">{tree.treeId}</p><p className="text-xs text-gray-500">Block: {tree.block}</p></div>
                        {isAlreadyAssigned ? <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Assigned</span>
                          : <input type="checkbox" checked={isSelected} onChange={() => toggleTreeToAdd(tree)} className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />}
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${tree.healthStatus === "Healthy" ? "bg-green-100 text-green-800" : tree.healthStatus === "Warning" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>{tree.healthStatus}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${tree.currentInvestor ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"}`}>{tree.currentInvestor ? tree.currentInvestor.investorName : "Available"}</span>
                        </div>
                        <p>Lifecycle: {tree.lifecycleStatus}</p>
                        {tree.currentInvestor && <p className="text-xs text-red-600">Currently assigned to: {tree.currentInvestor.investorName}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 p-6 border-t">
            <button type="button" onClick={onClose} className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition" disabled={loading}>Cancel</button>
            <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2" disabled={loading}>
              {loading ? <><Icon name="spinner" size={20} />Saving...</> : <><Icon name="check" size={20} />Save Changes</>}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

// Create Investor Modal
const CreateInvestorModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", investment: 0, status: "active" });
  const [availableTrees, setAvailableTrees] = useState([]);
  const [selectedTrees, setSelectedTrees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [treesLoading, setTreesLoading] = useState(false);

  useEffect(() => { if (isOpen) { fetchAvailableTrees(); resetForm(); } }, [isOpen]);

  const resetForm = () => { setFormData({ name: "", email: "", phone: "", investment: 0, status: "active" }); setSelectedTrees([]); setSearchTerm(""); setErrors({}); };

  const fetchAvailableTrees = async () => {
    try { setTreesLoading(true); const r = await api.investors.getAvailableTrees(); if (r.success) setAvailableTrees(r.data || []); }
    catch (error) { console.error("Error fetching available trees:", error); }
    finally { setTreesLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const toggleTreeSelection = (tree) => setSelectedTrees((prev) => prev.some((t) => t._id === tree._id) ? prev.filter((t) => t._id !== tree._id) : [...prev, tree]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    const investment = parseFloat(formData.investment);
    if (!formData.investment || isNaN(investment) || investment <= 0) newErrors.investment = "Investment must be greater than 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await api.investors.create({ ...formData, investment: parseFloat(formData.investment), treeIds: selectedTrees.map((t) => t._id) });
      if (response.success) { alert(`✅ Investor created successfully!`); if (onSuccess) onSuccess(); onClose(); resetForm(); }
      else alert(`❌ Failed to create investor: ${response.message || response.error || "Unknown error"}`);
    } catch (error) { alert("❌ Failed to create investor."); }
    finally { setLoading(false); }
  };

  const filteredTrees = availableTrees.filter((tree) => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return (tree.treeId?.toLowerCase().includes(s)) || (tree.block?.toLowerCase().includes(s));
  });

  return (
    <Modal isOpen={isOpen} onClose={() => { resetForm(); onClose(); }} title="Create New Investor" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-blue-50 p-6 m-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Investor Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[["name","Full Name","text","John Doe"],["email","Email","email","john@example.com"],["phone","Phone","tel","+1234567890"]].map(([field, label, type, placeholder]) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{label} <span className="text-red-500">*</span></label>
                <input type={type} name={field} value={formData[field]} onChange={handleChange} placeholder={placeholder}
                  className={`w-full p-3 border ${errors[field] ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`} />
                {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Investment (LKR) <span className="text-red-500">*</span></label>
              <input type="number" name="investment" value={formData.investment} onChange={handleChange} placeholder="10000" min="0" step="0.01"
                className={`w-full p-3 border ${errors.investment ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`} />
              {errors.investment && <p className="text-red-500 text-xs mt-1">{errors.investment}</p>}
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-6 m-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2"><Icon name="tree" size={20} />Assign Trees (Optional)</h3>
          <p className="text-sm text-gray-600 mb-4">Only unassigned trees are shown</p>
          {treesLoading ? (
            <div className="text-center py-8"><Icon name="spinner" size={24} className="mx-auto text-green-600 animate-spin" /><p className="text-gray-600 mt-2">Loading available trees...</p></div>
          ) : (
            <>
              <div className="relative mb-4">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2"><Icon name="search" size={18} className="text-gray-400" /></div>
                <input type="text" placeholder="Search trees by ID or block..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
              </div>
              {filteredTrees.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-white rounded-lg border border-gray-200">
                  <Icon name="tree" size={48} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-lg mb-2">No available trees found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto p-2">
                  {filteredTrees.map((tree) => {
                    const isSelected = selectedTrees.some((t) => t._id === tree._id);
                    return (
                      <div key={tree._id} onClick={() => toggleTreeSelection(tree)}
                        className={`bg-white border rounded-lg p-4 cursor-pointer transition ${isSelected ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-green-300 hover:bg-green-50"}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div><p className="font-semibold text-gray-800">{tree.treeId}</p><p className="text-xs text-gray-500">Block: {tree.block}</p></div>
                          <input type="checkbox" checked={isSelected} onChange={() => toggleTreeSelection(tree)} className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${tree.healthStatus === "Healthy" ? "bg-green-100 text-green-800" : tree.healthStatus === "Warning" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>{tree.healthStatus}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${tree.lifecycleStatus === "Growing" ? "bg-blue-100 text-blue-800" : tree.lifecycleStatus === "Harvested" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-800"}`}>{tree.lifecycleStatus}</span>
                          </div>
                          <p>Planted: {tree.plantedDate ? new Date(tree.plantedDate).toLocaleDateString() : "N/A"}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 p-6 border-t">
          <button type="button" onClick={() => { resetForm(); onClose(); }} className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition" disabled={loading}>Cancel</button>
          <button type="submit" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center gap-2" disabled={loading}>
            {loading ? <><Icon name="spinner" size={20} className="animate-spin" />Creating...</> : <><Icon name="plus" size={20} />Create Investor</>}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// Alert Component
const Alert = ({ type = "info", message, onClose, duration = 5000 }) => {
  const bgColor = { success: "bg-green-100 text-green-800 border-green-300", error: "bg-red-100 text-red-800 border-red-300", info: "bg-blue-100 text-blue-800 border-blue-300", warning: "bg-yellow-100 text-yellow-800 border-yellow-300" };
  const iconName = { success: "check", error: "close", info: "info", warning: "info" };
  useEffect(() => { if (duration) { const t = setTimeout(() => { if (onClose) onClose(); }, duration); return () => clearTimeout(t); } }, [duration, onClose]);
  return (
    <div className={`fixed top-4 right-4 z-50 border rounded-lg p-4 shadow-lg ${bgColor[type]} flex items-center gap-3`}>
      <Icon name={iconName[type]} size={20} />
      <span>{message}</span>
      {onClose && <button onClick={onClose} className="ml-4 text-current opacity-70 hover:opacity-100"><Icon name="x" size={16} /></button>}
    </div>
  );
};

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function InvestorCertificateManager() {
  const [investors, setInvestors] = useState([]);
  const [stats, setStats] = useState({ totalInvestors: 0, activeInvestors: 0, totalInvestment: 0, assignedTrees: 0, availableTrees: 0 });
  const [expandedInvestor, setExpandedInvestor] = useState(null);
  const [certificates, setCertificates] = useState({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isHarvestCertModalOpen, setIsHarvestCertModalOpen] = useState(false);
  const [selectedInvestorForEdit, setSelectedInvestorForEdit] = useState(null);
  const [selectedInvestorForCert, setSelectedInvestorForCert] = useState(null);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  const showAlert = useCallback((type, message, duration = 5000) => { setAlert({ type, message }); setTimeout(() => setAlert(null), duration); }, []);

  const loadInvestors = useCallback(async () => {
    try {
      const response = await api.investors.getAll();
      if (response.success) setInvestors(response.data || []);
      else showAlert("error", response.message || "Failed to load investors");
    } catch (error) { showAlert("error", `Failed to connect to server: ${error.message}`); }
  }, [showAlert]);

  const loadStats = useCallback(async () => {
    try { const r = await api.investors.getStats(); if (r.success) setStats(r.data); } catch { }
  }, []);

  const loadCertificates = async (investorId) => {
    try {
      const r = await api.certificates.getByInvestor(investorId);
      setCertificates((prev) => ({ ...prev, [investorId]: r.success ? (r.data || []) : [] }));
    } catch { setCertificates((prev) => ({ ...prev, [investorId]: [] })); }
  };

  const initializeData = useCallback(async () => {
    setLoading(true);
    try { await Promise.all([loadInvestors(), loadStats()]); }
    catch { } finally { setLoading(false); }
  }, [loadInvestors, loadStats]);

  useEffect(() => { initializeData(); }, [initializeData]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete investor "${name}"? This will release all their trees.`)) return;
    try {
      const r = await api.investors.delete(id);
      if (r.success) { showAlert("success", "Investor deleted successfully"); await initializeData(); }
      else showAlert("error", r.message || "Failed to delete investor");
    } catch { showAlert("error", "Failed to delete investor"); }
  };

  const calcTotal = (inv) => inv?.investment || 0;
  const calcAllTotal = () => investors.reduce((t, inv) => t + calcTotal(inv), 0);

  const toggleInvestor = async (investor) => {
    if (expandedInvestor === investor._id) { setExpandedInvestor(null); }
    else { setExpandedInvestor(investor._id); if (!certificates[investor._id]) await loadCertificates(investor._id); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Icon name="spinner" size={64} className="text-blue-600 mx-auto mb-4" />
          <p className="text-gray-700 text-lg font-medium">Loading Investor Data...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidePanel />
      <div className="flex-1 ml-0 md:ml-64 overflow-auto p-4">

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg"><Icon name="users" size={32} className="text-blue-600" /></div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Investor Management</h1>
                <p className="text-gray-600 mt-1">Manage investors, assign trees, and generate certificates</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => { initializeData(); showAlert("info", "Refreshing data...", 2000); }}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition shadow-md">
                <Icon name="refresh" size={20} />Refresh Data
              </button>
              <button onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md">
                <Icon name="plus" size={20} />Create Investor
              </button>
            </div>
          </div>
        </div>

        {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {[
            ["Total Investors", stats.totalInvestors || investors.length, "border-blue-500", "text-blue-600"],
            ["Active Investors", stats.activeInvestors || investors.filter(i => i.status === "active").length, "border-green-500", "text-green-600"],
            ["Total Investment", `$${calcAllTotal().toLocaleString()}`, "border-purple-500", "text-purple-600"],
            ["Assigned Trees", stats.assignedTrees || investors.reduce((s, i) => s + (i.investedTrees?.length || 0), 0), "border-orange-500", "text-orange-600"],
            ["Available Trees", stats.availableTrees || 0, "border-cyan-500", "text-cyan-600"],
          ].map(([label, value, border, color]) => (
            <div key={label} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${border}`}>
              <p className="text-sm text-gray-600 font-medium">{label}</p>
              <p className={`text-2xl font-bold ${color} mt-2`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Investors List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Investors & Certificates</h2>
                <p className="text-sm text-gray-600 mt-1">Showing {investors.length} investor{investors.length !== 1 ? "s" : ""}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Icon name="dollar" size={20} className="text-green-600" />
                <span>Total Investment: LKR {calcAllTotal().toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {investors.length === 0 ? (
              <div className="text-center py-12 px-4">
                <Icon name="users" size={64} className="mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">No investors found</p>
                <p className="text-gray-600 mb-6">Get started by creating your first investor</p>
                <button onClick={() => setIsCreateModalOpen(true)} className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 mx-auto">
                  <Icon name="plus" size={20} />Create First Investor
                </button>
              </div>
            ) : (
              investors.map((investor) => {
                const investorTotal = calcTotal(investor);
                const treeCount = investor.investedTrees?.length || 0;
                return (
                  <div key={investor._id}>
                    <div className="p-6 hover:bg-gray-50 transition">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <h3 className="text-lg font-semibold text-gray-800">{investor.name}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${investor.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>{investor.status}</span>
                            {investor.investorId && <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">ID: {investor.investorId}</span>}
                            {treeCount > 0 && <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">{treeCount} tree{treeCount !== 1 ? "s" : ""}</span>}
                            <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 flex items-center gap-1"><Icon name="money" size={12} />${investorTotal.toLocaleString()}</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-2"><span className="font-medium">Email:</span><span className="truncate">{investor.email}</span></div>
                            <div className="flex items-center gap-2"><span className="font-medium">Phone:</span><span>{investor.phone || "N/A"}</span></div>
                            <div className="flex items-center gap-2"><span className="font-medium">Trees:</span><span className="font-semibold text-green-700">{treeCount} tree{treeCount !== 1 ? "s" : ""}</span></div>
                          </div>
                          {treeCount > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {investor.investedTrees.slice(0, 4).map((ti, idx) => (
                                <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-50 text-green-700 rounded border border-green-200">
                                  <Icon name="tree" size={12} />{ti.tree?.treeId || ti.treeId || `Tree ${idx + 1}`}
                                </span>
                              ))}
                              {treeCount > 4 && <span className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">+{treeCount - 4} more</span>}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <button onClick={() => { setSelectedInvestorForEdit(investor); setIsEditModalOpen(true); }}
                            className="flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition border border-blue-200">
                            <Icon name="edit" size={18} /><span className="text-sm">Edit</span>
                          </button>

                          {/* ── HARVEST CERT BUTTON ── */}
                          <button
                            onClick={() => { setSelectedInvestorForCert(investor); setIsHarvestCertModalOpen(true); }}
                            className="flex items-center gap-1 px-3 py-2 text-amber-700 hover:bg-amber-50 rounded-lg transition border border-amber-300 bg-amber-50"
                            title="Download Harvest Certificate"
                          >
                            <Icon name="download" size={18} />
                            <span className="text-sm font-medium">Harvest Cert</span>
                          </button>

                          <button onClick={() => handleDelete(investor._id, investor.name)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition border border-red-200">
                            <Icon name="delete" size={18} />
                          </button>
                          <button onClick={() => toggleInvestor(investor)}
                            className={`p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition border border-gray-200 ${expandedInvestor === investor._id ? "transform rotate-180" : ""}`}>
                            <Icon name="chevronDown" size={18} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedInvestor === investor._id && (
                      <div className="bg-gray-50 p-6 border-t border-gray-200">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2"><Icon name="tree" size={18} />Assigned Trees ({treeCount})</h4>
                              <div className="text-sm font-semibold text-green-700">Investment: ${investorTotal.toLocaleString()}</div>
                            </div>
                            {treeCount > 0 ? (
                              <div className="space-y-3">
                                {investor.investedTrees.map((ti, idx) => (
                                  <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2">
                                      <div><p className="font-semibold text-gray-800">{ti.tree?.treeId || ti.treeId || `Tree ${idx + 1}`}</p><p className="text-xs text-gray-500">Block: {ti.tree?.block || "N/A"}</p></div>
                                      <span className={`px-2 py-1 text-xs rounded-full ${ti.tree?.healthStatus === "Healthy" ? "bg-green-100 text-green-800" : ti.tree?.healthStatus === "Warning" ? "bg-yellow-100 text-yellow-800" : ti.tree?.healthStatus === "Dead" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`}>{ti.tree?.healthStatus || "Unknown"}</span>
                                    </div>
                                    <div className="text-xs text-gray-600 space-y-1">
                                      <p>Lifecycle: {ti.tree?.lifecycleStatus || "N/A"}</p>
                                      <p>Planted: {ti.tree?.plantedDate ? new Date(ti.tree.plantedDate).toLocaleDateString() : "N/A"}</p>
                                      <p>NFC Tag: {ti.tree?.nfcTagId || "N/A"}</p>
                                      {ti.investedAt && <p className="text-gray-500">Assigned: {new Date(ti.investedAt).toLocaleDateString()}</p>}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-8 text-gray-500 text-sm bg-white rounded-lg border border-gray-200">No trees assigned to this investor</div>
                            )}
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                              <Icon name="award" size={18} />Certificates ({certificates[investor._id]?.length || 0})
                            </h4>
                            {certificates[investor._id]?.length > 0 ? (
                              <div className="space-y-4">
                                {certificates[investor._id].map((cert) => (
                                  <div key={cert.certificateId || cert._id} className="bg-white border border-gray-200 rounded-lg p-4">
                                    <p className="font-medium">{cert.certificateType || cert.type || "Certificate"}</p>
                                    <p className="text-sm text-gray-600">Generated: {new Date(cert.generatedAt || cert.issueDate || cert.createdAt).toLocaleDateString()}</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-8 text-gray-500 text-sm bg-white rounded-lg border border-gray-200">No certificates generated yet</div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateInvestorModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSuccess={() => { initializeData(); setIsCreateModalOpen(false); }} />
      <EditInvestorModal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedInvestorForEdit(null); }} investor={selectedInvestorForEdit} onSuccess={() => { initializeData(); setIsEditModalOpen(false); setSelectedInvestorForEdit(null); }} />
      <HarvestCertificateModal isOpen={isHarvestCertModalOpen} onClose={() => { setIsHarvestCertModalOpen(false); setSelectedInvestorForCert(null); }} investor={selectedInvestorForCert} />
    </div>
  );
}