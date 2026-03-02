import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// API Configuration
const API_URL = "http://localhost:5000/api";

const api = {
  investors: {
    getAll: () => fetch(`${API_URL}/investors`).then((r) => r.json()),
    getAvailableTrees: () =>
      fetch(`${API_URL}/investors/trees/available`).then((r) => r.json()),
    getInvestorTrees: (id) =>
      fetch(`${API_URL}/investors/${id}/trees`).then((r) => r.json()),
    getById: (id) => fetch(`${API_URL}/investors/${id}`).then((r) => r.json()),
    create: (data) =>
      fetch(`${API_URL}/investors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    update: (id, data) =>
      fetch(`${API_URL}/investors/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    delete: (id) =>
      fetch(`${API_URL}/investors/${id}`, {
        method: "DELETE",
      }).then((r) => r.json()),
    assignTree: (id, treeId) =>
      fetch(`${API_URL}/investors/${id}/assign-tree`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ treeId }),
      }).then((r) => r.json()),
    unassignTree: (id, treeId) =>
      fetch(`${API_URL}/investors/${id}/unassign-tree/${treeId}`, {
        method: "POST",
      }).then((r) => r.json()),
    bulkAssignTrees: (id, treeIds) =>
      fetch(`${API_URL}/investors/${id}/bulk-assign-trees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ treeIds }),
      }).then((r) => r.json()),
    getTreesForBulkAssignment: () =>
      fetch(`${API_URL}/investors/trees/all-for-assignment`).then((r) =>
        r.json()
      ),
    getStats: () =>
      fetch(`${API_URL}/investors/stats/overview`).then((r) => r.json()),
  },
  certificates: {
    generate: (data) =>
      fetch(`${API_URL}/certificates/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    generateHarvest: (data) =>
      fetch(`${API_URL}/certificates/generate-harvest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    getByInvestor: (investorId) =>
      fetch(`${API_URL}/certificates/investor/${investorId}`).then((r) =>
        r.json()
      ),
    // ✅ FIX 2: New endpoint for harvestable trees
    getHarvestableTrees: (investorId) =>
      fetch(`${API_URL}/certificates/harvestable/${investorId}`).then((r) =>
        r.json()
      ),
  },
};

// Icons Component (keep as is)
const Icon = ({ name, size = 20, className = "" }) => {
  const icons = {
    plus: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 5v14m-7-7h14" />
      </svg>
    ),
    edit: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
    delete: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    ),
    close: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6m0-6 6 6" />
      </svg>
    ),
    award: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="8" r="7" />
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
      </svg>
    ),
    users: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    chevronDown: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    ),
    tree: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 22v-7" />
        <path d="M8 15h8" />
        <path d="M12 2v5" />
        <path d="M18 12a6 6 0 1 0-12 0" />
      </svg>
    ),
    search: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
    check: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    spinner: (
      <svg
        className="animate-spin"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    ),
    info: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4m0-4h.01" />
      </svg>
    ),
    harvest: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M4 18v-6a6 6 0 0 1 6-6h0a6 6 0 0 1 6 6v6" />
        <path d="M4 18H2" />
        <path d="M8 18H6" />
        <path d="M14 18h-2" />
        <path d="M16 18h-2" />
        <path d="M20 18h-2" />
        <path d="M12 8v8" />
        <path d="m15 5-6 6" />
        <path d="m9 5 6 6" />
      </svg>
    ),
    money: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6" />
      </svg>
    ),
    dollar: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6" />
      </svg>
    ),
    user: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    refresh: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
      </svg>
    ),
    x: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
  };

  return <span className={className}>{icons[name] || icons.info}</span>;
};

// Modal Component (keep as is)
const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`bg-white rounded-lg shadow-xl w-full ${sizes[size]} max-h-[90vh] overflow-hidden flex flex-col`}
      >
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <Icon name="close" size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

// ✅ FIXED: Edit Investor Modal with Tree Management
const EditInvestorModal = ({ isOpen, onClose, investor, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    investment: 0,
    status: "active",
  });
  const [availableTrees, setAvailableTrees] = useState([]);
  const [investorTrees, setInvestorTrees] = useState([]);
  const [selectedTreesToAdd, setSelectedTreesToAdd] = useState([]);
  const [selectedTreesToRemove, setSelectedTreesToRemove] = useState([]);
  const [loading, setLoading] = useState(false);
  const [treesLoading, setTreesLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isOpen && investor) {
      initializeData();
    }
  }, [isOpen, investor]);

  const initializeData = async () => {
    setLoading(true);
    try {
      // Load investor data
      const investorRes = await api.investors.getById(investor._id);
      if (investorRes.success) {
        const investorData = investorRes.data;
        setFormData({
          name: investorData.name,
          email: investorData.email,
          phone: investorData.phone,
          investment: investorData.investment || 0,
          status: investorData.status || "active",
        });

        // Load investor's current trees
        const treesRes = await api.investors.getInvestorTrees(investor._id);
        if (treesRes.success) {
          setInvestorTrees(treesRes.data || []);
        }

        // Load all trees for bulk assignment
        const allTreesRes = await api.investors.getTreesForBulkAssignment();
        if (allTreesRes.success) {
          setAvailableTrees(allTreesRes.data || []);
        }
      }
    } catch (error) {
      console.error("Error initializing edit data:", error);
    } finally {
      setLoading(false);
      setTreesLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const toggleTreeToAdd = (tree) => {
    if (selectedTreesToAdd.some((t) => t._id === tree._id)) {
      setSelectedTreesToAdd((prev) => prev.filter((t) => t._id !== tree._id));
    } else {
      // Check if tree is already assigned to investor
      if (!investorTrees.some((t) => t._id === tree._id)) {
        setSelectedTreesToAdd((prev) => [...prev, tree]);
      }
    }
  };

  const toggleTreeToRemove = (tree) => {
    if (selectedTreesToRemove.some((t) => t._id === tree._id)) {
      setSelectedTreesToRemove((prev) =>
        prev.filter((t) => t._id !== tree._id)
      );
    } else {
      setSelectedTreesToRemove((prev) => [...prev, tree]);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    }

    const investment = parseFloat(formData.investment);
    if (isNaN(investment) || investment < 0) {
      newErrors.investment = "Investment must be a valid number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // ✅ FIX 1: Prepare basic investor update data
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        investment: parseFloat(formData.investment),
        status: formData.status,
      };

      // ✅ FIX 2: First update the investor basic info
      const response = await api.investors.update(investor._id, updateData);

      if (!response.success) {
        throw new Error(response.message || "Failed to update investor");
      }

      // ✅ FIX 3: Handle tree assignments separately
      if (selectedTreesToRemove.length > 0) {
        for (const tree of selectedTreesToRemove) {
          await api.investors.unassignTree(investor._id, tree._id);
        }
      }

      if (selectedTreesToAdd.length > 0) {
        const treeIds = selectedTreesToAdd.map((t) => t._id);
        await api.investors.bulkAssignTrees(investor._id, treeIds);
      }

      alert(`✅ Investor updated successfully!`);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating investor:", error);
      alert(
        `❌ Failed to update investor: ${error.message || "Unknown error"}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSingleTree = async (treeId, treeName) => {
    if (!window.confirm(`Remove tree "${treeName}" from this investor?`))
      return;

    try {
      setLoading(true);
      const response = await api.investors.unassignTree(investor._id, treeId);
      if (response.success) {
        alert("✅ Tree removed successfully");
        initializeData(); // Refresh data
      } else {
        alert(`❌ Failed to remove tree: ${response.message}`);
      }
    } catch (error) {
      console.error("Error removing tree:", error);
      alert("❌ Failed to remove tree");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAddTrees = async () => {
    if (selectedTreesToAdd.length === 0) {
      alert("Please select trees to add");
      return;
    }

    try {
      setLoading(true);
      const treeIds = selectedTreesToAdd.map((t) => t._id);
      const response = await api.investors.bulkAssignTrees(
        investor._id,
        treeIds
      );

      if (response.success) {
        alert(`✅ ${response.message || "Trees added successfully"}`);
        setSelectedTreesToAdd([]);
        initializeData(); // Refresh data
      } else {
        alert(`❌ Failed to add trees: ${response.message}`);
      }
    } catch (error) {
      console.error("Error bulk adding trees:", error);
      alert("❌ Failed to add trees");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkRemoveTrees = async () => {
    if (selectedTreesToRemove.length === 0) {
      alert("Please select trees to remove");
      return;
    }

    if (
      !window.confirm(
        `Remove ${selectedTreesToRemove.length} trees from this investor?`
      )
    )
      return;

    try {
      setLoading(true);
      // Remove trees one by one
      let successCount = 0;
      let failCount = 0;

      for (const tree of selectedTreesToRemove) {
        try {
          const response = await api.investors.unassignTree(
            investor._id,
            tree._id
          );
          if (response.success) {
            successCount++;
          } else {
            failCount++;
          }
        } catch (error) {
          failCount++;
        }
      }

      alert(
        `✅ ${successCount} trees removed successfully. Failed: ${failCount}`
      );
      setSelectedTreesToRemove([]);
      initializeData(); // Refresh data
    } catch (error) {
      console.error("Error bulk removing trees:", error);
      alert("❌ Failed to remove trees");
    } finally {
      setLoading(false);
    }
  };

  const filteredAvailableTrees = availableTrees.filter((tree) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      (tree.treeId && tree.treeId.toLowerCase().includes(search)) ||
      (tree.block && tree.block.toLowerCase().includes(search)) ||
      tree.currentInvestor?.investorName?.toLowerCase().includes(search)
    );
  });

  if (!investor) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Investor - ${investor.name}`}
      size="xl"
    >
      {loading && !formData.name ? (
        <div className="flex justify-center items-center p-8">
          <Icon name="spinner" size={32} className="text-blue-600" />
          <span className="ml-3 text-gray-600">Loading investor data...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg m-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Investor Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-3 border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-3 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full p-3 border ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="+1234567890"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Investment Amount ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="investment"
                  value={formData.investment}
                  onChange={handleChange}
                  className={`w-full p-3 border ${
                    errors.investment ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="10000"
                  min="0"
                  step="0.01"
                />
                {errors.investment && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.investment}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Investor's Current Trees Section */}
          <div className="bg-green-50 p-6 m-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Icon name="tree" size={20} />
                  Investor's Current Trees ({investorTrees.length})
                </h3>
                <p className="text-sm text-gray-600">
                  Trees currently assigned to this investor
                </p>
              </div>
              {selectedTreesToRemove.length > 0 && (
                <button
                  type="button"
                  onClick={handleBulkRemoveTrees}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                >
                  <Icon name="delete" size={16} />
                  Remove Selected ({selectedTreesToRemove.length})
                </button>
              )}
            </div>

            {investorTrees.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-white rounded-lg border border-gray-200">
                <Icon
                  name="tree"
                  size={48}
                  className="mx-auto text-gray-400 mb-2"
                />
                <p className="text-lg mb-2">
                  No trees assigned to this investor
                </p>
                <p className="text-sm">Assign trees using the section below</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {investorTrees.map((tree) => {
                  const isSelected = selectedTreesToRemove.some(
                    (t) => t._id === tree._id
                  );
                  return (
                    <div
                      key={tree._id}
                      className={`bg-white border rounded-lg p-4 ${
                        isSelected
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {tree.treeId}
                          </p>
                          <p className="text-xs text-gray-500">
                            Block: {tree.block}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveSingleTree(tree._id, tree.treeId)
                            }
                            className="p-1 text-red-600 hover:text-red-800 transition"
                            title="Remove tree"
                          >
                            <Icon name="x" size={16} />
                          </button>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleTreeToRemove(tree)}
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                          />
                        </div>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              tree.healthStatus === "Healthy"
                                ? "bg-green-100 text-green-800"
                                : tree.healthStatus === "Warning"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {tree.healthStatus}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              tree.lifecycleStatus === "Growing"
                                ? "bg-blue-100 text-blue-800"
                                : tree.lifecycleStatus === "Harvested"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {tree.lifecycleStatus}
                          </span>
                        </div>
                        <p>
                          Planted:{" "}
                          {tree.plantedDate
                            ? new Date(tree.plantedDate).toLocaleDateString()
                            : "N/A"}
                        </p>
                        {tree.gps && tree.gps.lat && (
                          <p className="text-xs text-gray-500 truncate">
                            GPS: {tree.gps.lat.toFixed(4)},{" "}
                            {tree.gps.lng.toFixed(4)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Add Trees Section */}
          <div className="bg-blue-50 p-6 m-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Icon name="plus" size={20} />
                  Add More Trees
                </h3>
                <p className="text-sm text-gray-600">
                  Select available trees to assign to this investor
                </p>
              </div>
              {selectedTreesToAdd.length > 0 && (
                <button
                  type="button"
                  onClick={handleBulkAddTrees}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                >
                  <Icon name="plus" size={16} />
                  Add Selected ({selectedTreesToAdd.length})
                </button>
              )}
            </div>

            <div className="relative mb-4">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Icon name="search" size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search available trees by ID, block, or current investor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {treesLoading ? (
              <div className="flex justify-center items-center p-8">
                <Icon name="spinner" size={32} className="text-green-600" />
                <span className="ml-3 text-gray-600">
                  Loading available trees...
                </span>
              </div>
            ) : filteredAvailableTrees.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-white rounded-lg border border-gray-200">
                <Icon
                  name="tree"
                  size={48}
                  className="mx-auto text-gray-400 mb-2"
                />
                <p className="text-lg mb-2">No available trees found</p>
                <p className="text-sm">All trees are currently assigned</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAvailableTrees.map((tree) => {
                  const isSelected = selectedTreesToAdd.some(
                    (t) => t._id === tree._id
                  );
                  const isAlreadyAssigned = investorTrees.some(
                    (t) => t._id === tree._id
                  );

                  return (
                    <div
                      key={tree._id}
                      className={`bg-white border rounded-lg p-4 cursor-pointer transition ${
                        isSelected
                          ? "border-green-500 bg-green-50"
                          : isAlreadyAssigned
                          ? "border-gray-300 bg-gray-100 cursor-not-allowed"
                          : "border-gray-200 hover:border-green-300 hover:bg-green-50"
                      }`}
                      onClick={() =>
                        !isAlreadyAssigned && toggleTreeToAdd(tree)
                      }
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {tree.treeId}
                          </p>
                          <p className="text-xs text-gray-500">
                            Block: {tree.block}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {isAlreadyAssigned ? (
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                              Assigned
                            </span>
                          ) : (
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleTreeToAdd(tree)}
                              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                          )}
                        </div>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              tree.healthStatus === "Healthy"
                                ? "bg-green-100 text-green-800"
                                : tree.healthStatus === "Warning"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {tree.healthStatus}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              tree.currentInvestor
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {tree.currentInvestor
                              ? tree.currentInvestor.investorName
                              : "Available"}
                          </span>
                        </div>
                        <p>Lifecycle: {tree.lifecycleStatus}</p>
                        {tree.currentInvestor && (
                          <p className="text-xs text-red-600">
                            Currently assigned to:{" "}
                            {tree.currentInvestor.investorName}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 p-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Icon name="spinner" size={20} />
                  Saving...
                </>
              ) : (
                <>
                  <Icon name="check" size={20} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

// ✅ FIX 1: Create Investor Modal with Card-based Layout (matches Edit Investor)
const CreateInvestorModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    investment: 0,
    status: "active",
  });

  const [availableTrees, setAvailableTrees] = useState([]);
  const [selectedTrees, setSelectedTrees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [treesLoading, setTreesLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAvailableTrees();
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      investment: 0,
      status: "active",
    });
    setSelectedTrees([]);
    setSearchTerm("");
    setErrors({});
  };

  const fetchAvailableTrees = async () => {
    try {
      setTreesLoading(true);
      const response = await api.investors.getAvailableTrees();

      if (response.success) {
        setAvailableTrees(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching available trees:", error);
    } finally {
      setTreesLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const toggleTreeSelection = (tree) => {
    setSelectedTrees((prev) => {
      const isSelected = prev.some((t) => t._id === tree._id);
      if (isSelected) {
        return prev.filter((t) => t._id !== tree._id);
      } else {
        return [...prev, tree];
      }
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    }

    const investment = parseFloat(formData.investment);
    if (!formData.investment || isNaN(investment) || investment <= 0) {
      newErrors.investment = "Investment must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        investment: parseFloat(formData.investment),
        treeIds: selectedTrees.map((t) => t._id),
      };

      const response = await api.investors.create(payload);

      if (response.success) {
        alert(`✅ Investor created successfully!`);
        if (onSuccess) onSuccess();
        onClose();
        resetForm();
      } else {
        alert(
          `❌ Failed to create investor: ${
            response.message || response.error || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error creating investor:", error);
      alert("❌ Failed to create investor. Please check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const filteredTrees = availableTrees.filter((tree) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      (tree.treeId && tree.treeId.toLowerCase().includes(search)) ||
      (tree.block && tree.block.toLowerCase().includes(search))
    );
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Investor"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ✅ FIX 1: Investor Information Card */}
        <div className="bg-blue-50 p-6 m-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Investor Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-3 border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full p-3 border ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="+1234567890"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Investment ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="investment"
                value={formData.investment}
                onChange={handleChange}
                className={`w-full p-3 border ${
                  errors.investment ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="10000"
                min="0"
                step="0.01"
              />
              {errors.investment && (
                <p className="text-red-500 text-xs mt-1">{errors.investment}</p>
              )}
            </div>
          </div>
        </div>

        {/* ✅ FIX 1: Assign Trees Card */}
        <div className="bg-green-50 p-6 m-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <Icon name="tree" size={20} />
            Assign Trees (Optional)
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Only unassigned trees are shown
          </p>

          {treesLoading ? (
            <div className="text-center py-8">
              <Icon
                name="spinner"
                size={24}
                className="mx-auto text-green-600 animate-spin"
              />
              <p className="text-gray-600 mt-2">Loading available trees...</p>
            </div>
          ) : (
            <>
              <div className="relative mb-4">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Icon name="search" size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search trees by ID or block..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {filteredTrees.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-white rounded-lg border border-gray-200">
                  <Icon
                    name="tree"
                    size={48}
                    className="mx-auto text-gray-400 mb-2"
                  />
                  <p className="text-lg mb-2">No available trees found</p>
                  <p className="text-sm">
                    All trees are currently assigned to other investors
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto p-2">
                  {filteredTrees.map((tree) => {
                    const isSelected = selectedTrees.some(
                      (t) => t._id === tree._id
                    );
                    return (
                      <div
                        key={tree._id}
                        onClick={() => toggleTreeSelection(tree)}
                        className={`bg-white border rounded-lg p-4 cursor-pointer transition ${
                          isSelected
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-green-300 hover:bg-green-50"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-gray-800">
                              {tree.treeId}
                            </p>
                            <p className="text-xs text-gray-500">
                              Block: {tree.block}
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleTreeSelection(tree)}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                tree.healthStatus === "Healthy"
                                  ? "bg-green-100 text-green-800"
                                  : tree.healthStatus === "Warning"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {tree.healthStatus}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                tree.lifecycleStatus === "Growing"
                                  ? "bg-blue-100 text-blue-800"
                                  : tree.lifecycleStatus === "Harvested"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {tree.lifecycleStatus}
                            </span>
                          </div>
                          <p>
                            Planted:{" "}
                            {tree.plantedDate
                              ? new Date(tree.plantedDate).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer buttons */}
        <div className="flex justify-end gap-3 p-6 border-t">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Icon name="spinner" size={20} className="animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Icon name="plus" size={20} />
                Create Investor
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// ✅ FIX 2: Generate Certificate Modal with Harvest Certificate Rules
const GenerateCertificateModal = ({
  isOpen,
  onClose,
  investor,
  onCertificateGenerated,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    certificateType: "ownership",
    harvestDate: new Date().toISOString().split("T")[0],
    harvestAmount: 0,
    notes: "",
  });
  // ✅ FIX 2: New state for harvested trees
  const [harvestedTrees, setHarvestedTrees] = useState([]);
  const [selectedTreeId, setSelectedTreeId] = useState("");
  const [treesLoading, setTreesLoading] = useState(false);

  // ✅ FIX 2: Fetch harvested trees when modal opens for harvest certificates
  useEffect(() => {
    if (isOpen && investor) {
      if (formData.certificateType === "harvest") {
        fetchHarvestedTrees();
      } else {
        setHarvestedTrees([]);
        setSelectedTreeId("");
      }
    }
  }, [isOpen, investor, formData.certificateType]);

  const fetchHarvestedTrees = async () => {
    if (!investor) return;

    try {
      setTreesLoading(true);
      const response = await api.certificates.getHarvestableTrees(investor._id);
      if (response.success) {
        setHarvestedTrees(response.data || []);
      } else {
        alert(`❌ Failed to load harvested trees: ${response.message}`);
        setHarvestedTrees([]);
      }
    } catch (error) {
      console.error("Error fetching harvested trees:", error);
      alert("❌ Failed to load harvested trees");
      setHarvestedTrees([]);
    } finally {
      setTreesLoading(false);
    }
  };
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ FIX 2: Validate harvest certificate
    if (formData.certificateType === "harvest") {
      if (!selectedTreeId) {
        alert("❌ Please select a harvested tree");
        return;
      }

      const selectedTree = harvestedTrees.find((t) => t._id === selectedTreeId);
      if (!selectedTree) {
        alert("❌ Selected tree not found");
        return;
      }

      if (selectedTree.lifecycleStatus !== "Harvested") {
        alert("❌ Only harvested trees can have harvest certificates");
        return;
      }

      // Validate harvest amount
      if (!formData.harvestAmount || parseFloat(formData.harvestAmount) <= 0) {
        alert("❌ Harvest amount must be greater than 0");
        return;
      }
    }

    setLoading(true);
    try {
      if (formData.certificateType === "ownership") {
        // Ownership certificate logic
        const response = await api.certificates.generate({
          investorId: investor._id,
          certificateType: "ownership",
          notes: formData.notes,
        });

        if (response.success) {
          alert(`✅ Ownership certificate generated successfully!`);
        } else {
          alert(`❌ ${response.message || "Failed to generate certificate"}`);
          return;
        }
      } else if (formData.certificateType === "harvest") {
        // ✅ FIX 2: Harvest certificate with blockchain verification
        const payload = {
          investorId: investor._id,
          treeId: selectedTreeId,
          harvestDate: formData.harvestDate,
          harvestAmount: parseFloat(formData.harvestAmount),
          notes: formData.notes,
        };

        console.log(" ++++++++++++++++");

        const data = await api.certificates.generateHarvest(payload);

        console.log("djhsdhbfhsdifbsibdc",data.data?.certificateId);
        if (data.alreadyExists && data.data?.certificateId) {
          navigate(`/certificates/${data.data.certificateId}`);
          onClose();
          return;
        }

        // ✅ Case 2: Newly generated certificate → navigate
        if (data.success && data.data?.certificateId) {
          alert("✅ Harvest certificate generated successfully!");
          navigate(`/certificates/${data.data.certificateId}`);
          onClose();
          return;
        }

        alert("✅ Harvest certificate issued & verified on blockchain");
      }

      if (onCertificateGenerated) onCertificateGenerated();
      onClose();
    } catch (error) {
      console.error("Error generating certificate:", error);
      alert(
        "❌ Failed to generate certificate. Please check console for details."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!investor) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Generate Certificate - ${investor.name}`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Certificate Type
          </label>
          <select
            value={formData.certificateType}
            onChange={(e) =>
              setFormData({ ...formData, certificateType: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="ownership">Ownership Certificate</option>
            <option value="harvest">Harvest Certificate</option>
          </select>
        </div>

        {/* ✅ FIX 2: Harvest Certificate Specific Fields */}
        {formData.certificateType === "harvest" && (
          <>
            {/* Harvested Tree Selection */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Icon name="tree" size={18} />
                Select Harvested Tree
              </h4>

              {treesLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Icon
                    name="spinner"
                    size={24}
                    className="text-green-600 animate-spin"
                  />
                  <span className="ml-2 text-gray-600">
                    Loading harvested trees...
                  </span>
                </div>
              ) : harvestedTrees.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <Icon
                    name="tree"
                    size={32}
                    className="mx-auto text-gray-400 mb-2"
                  />
                  <p className="font-medium mb-1">No harvested trees found</p>
                  <p className="text-sm">
                    This investor has no trees with 'Harvested' status. Only
                    trees that have been harvested can receive harvest
                    certificates.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Harvested Trees{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedTreeId}
                      onChange={(e) => setSelectedTreeId(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">-- Select a harvested tree --</option>
                      {harvestedTrees.map((tree) => (
                        <option key={tree._id} value={tree._id}>
                          {tree.treeId} (Block: {tree.block}) - Harvested
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-2">
                      Only shows trees that belong to this investor and have
                      'Harvested' status.
                    </p>
                  </div>

                  {/* Selected Tree Info */}
                  {selectedTreeId && (
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-700">
                        Selected Tree:
                      </p>
                      {(() => {
                        const tree = harvestedTrees.find(
                          (t) => t._id === selectedTreeId
                        );
                        return tree ? (
                          <div className="mt-2 text-sm text-gray-600">
                            <p>
                              <strong>ID:</strong> {tree.treeId}
                            </p>
                            <p>
                              <strong>Block:</strong> {tree.block}
                            </p>
                            <p>
                              <strong>Status:</strong>
                              <span
                                className={`ml-2 px-2 py-1 rounded-full text-xs ${
                                  tree.lifecycleStatus === "Harvested"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {tree.lifecycleStatus}
                              </span>
                            </p>
                            {tree.plantedDate && (
                              <p>
                                <strong>Planted:</strong>{" "}
                                {new Date(
                                  tree.plantedDate
                                ).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Harvest Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Harvest Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.harvestDate}
                onChange={(e) =>
                  setFormData({ ...formData, harvestDate: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            {/* Harvest Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Harvest Amount (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.harvestAmount}
                onChange={(e) =>
                  setFormData({ ...formData, harvestAmount: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="0.01"
                step="0.01"
                placeholder="Enter harvest amount in kilograms"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                This will be verified on the blockchain before certificate
                generation.
              </p>
            </div>
          </>
        )}

        {/* Notes Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
            placeholder="Additional notes for the certificate..."
          />
        </div>

        {/* Info Box */}
        {formData.certificateType === "harvest" && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <Icon
                name="info"
                size={20}
                className="text-blue-600 flex-shrink-0"
              />
              <div>
                <p className="text-sm font-medium text-blue-800 mb-1">
                  Harvest Certificate Requirements:
                </p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Tree must be in 'Harvested' status</li>
                  <li>• Tree must belong to this investor</li>
                  <li>• Harvest must be verified on the blockchain</li>
                  <li>• Each tree can only have one harvest certificate</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center gap-2"
            disabled={
              loading ||
              (formData.certificateType === "harvest" &&
                harvestedTrees.length === 0)
            }
          >
            {loading ? (
              <>
                <Icon name="spinner" size={20} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Icon name="award" size={20} />
                Generate Certificate
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// Alert Component (keep as is)
const Alert = ({ type = "info", message, onClose, duration = 5000 }) => {
  const bgColor = {
    success: "bg-green-100 text-green-800 border-green-300",
    error: "bg-red-100 text-red-800 border-red-300",
    info: "bg-blue-100 text-blue-800 border-blue-300",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
  };

  const iconName = {
    success: "check",
    error: "close",
    info: "info",
    warning: "info",
  };

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 border rounded-lg p-4 shadow-lg ${bgColor[type]} flex items-center gap-3`}
    >
      <Icon name={iconName[type]} size={20} />
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-current opacity-70 hover:opacity-100"
        >
          <Icon name="x" size={16} />
        </button>
      )}
    </div>
  );
};

// Main Investor Certificate Manager Component
export default function InvestorCertificateManager() {
  const [investors, setInvestors] = useState([]);
  const [stats, setStats] = useState({
    totalInvestors: 0,
    activeInvestors: 0,
    totalInvestment: 0,
    assignedTrees: 0,
    availableTrees: 0,
  });
  const [expandedInvestor, setExpandedInvestor] = useState(null);
  const [certificates, setCertificates] = useState({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isGenerateCertModalOpen, setIsGenerateCertModalOpen] = useState(false);
  const [selectedInvestorForEdit, setSelectedInvestorForEdit] = useState(null);
  const [selectedInvestorForCert, setSelectedInvestorForCert] = useState(null);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  const showAlert = useCallback((type, message, duration = 5000) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), duration);
  }, []);

  const loadInvestors = useCallback(async () => {
    try {
      const response = await api.investors.getAll();

      if (response.success) {
        const investorsData = response.data || [];
        setInvestors(investorsData);
      } else {
        showAlert("error", response.message || "Failed to load investors");
      }
    } catch (error) {
      console.error("Load investors error:", error);
      showAlert("error", `Failed to connect to server: ${error.message}`);
    }
  }, [showAlert]);

  const loadStats = useCallback(async () => {
    try {
      const response = await api.investors.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  }, []);

  const loadCertificates = async (investorId) => {
    try {
      const response = await api.certificates.getByInvestor(investorId);
      if (response.success) {
        setCertificates((prev) => ({
          ...prev,
          [investorId]: response.data || [],
        }));
      }
    } catch (error) {
      console.error("Failed to load certificates:", error);
      setCertificates((prev) => ({ ...prev, [investorId]: [] }));
    }
  };

  const initializeData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([loadInvestors(), loadStats()]);
    } catch (error) {
      console.error("Initialization error:", error);
    } finally {
      setLoading(false);
    }
  }, [loadInvestors, loadStats]);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const handleDelete = async (id, name) => {
    if (
      !window.confirm(
        `Are you sure you want to delete investor "${name}"? This will release all their trees.`
      )
    )
      return;

    try {
      const response = await api.investors.delete(id);
      if (response.success) {
        showAlert("success", "Investor deleted successfully");
        await initializeData();
      } else {
        showAlert("error", response.message || "Failed to delete investor");
      }
    } catch (error) {
      console.error("Delete error:", error);
      showAlert("error", "Failed to delete investor");
    }
  };

  const calculateInvestorTotalInvestment = (investor) => {
    if (!investor) return 0;
    return investor.investment || 0;
  };

  const calculateTotalInvestmentAcrossInvestors = () => {
    return investors.reduce((total, investor) => {
      return total + calculateInvestorTotalInvestment(investor);
    }, 0);
  };

  const openEditModal = (investor) => {
    setSelectedInvestorForEdit(investor);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedInvestorForEdit(null);
  };

  const openGenerateCertModal = (investor) => {
    setSelectedInvestorForCert(investor);
    setIsGenerateCertModalOpen(true);
  };

  const closeGenerateCertModal = () => {
    setIsGenerateCertModalOpen(false);
    setSelectedInvestorForCert(null);
  };

  const handleCertificateGenerated = async () => {
    if (selectedInvestorForCert) {
      await loadCertificates(selectedInvestorForCert._id);
    }
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const toggleInvestor = async (investor) => {
    if (expandedInvestor === investor._id) {
      setExpandedInvestor(null);
    } else {
      setExpandedInvestor(investor._id);
      if (!certificates[investor._id]) {
        await loadCertificates(investor._id);
      }
    }
  };

  const handleCreateInvestorSuccess = () => {
    initializeData();
    closeCreateModal();
  };

  const handleEditInvestorSuccess = () => {
    initializeData();
    closeEditModal();
  };

  const handleRefresh = () => {
    initializeData();
    showAlert("info", "Refreshing data...", 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Icon
            name="spinner"
            size={64}
            className="text-blue-600 mx-auto mb-4"
          />
          <p className="text-gray-700 text-lg font-medium">
            Loading Investor Data...
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Please wait while we fetch your data
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Icon name="users" size={32} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Investor Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage investors, assign trees, and generate certificates
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleRefresh}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition shadow-md"
              >
                <Icon name="refresh" size={20} />
                Refresh Data
              </button>
              <button
                onClick={openCreateModal}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md"
              >
                <Icon name="plus" size={20} />
                Create Investor
              </button>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
            <p className="text-sm text-gray-600 font-medium">Total Investors</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {stats.totalInvestors || investors.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
            <p className="text-sm text-gray-600 font-medium">
              Active Investors
            </p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {stats.activeInvestors ||
                investors.filter((inv) => inv.status === "active").length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
            <p className="text-sm text-gray-600 font-medium">
              Total Investment
            </p>
            <p className="text-2xl font-bold text-purple-600 mt-2">
              ${calculateTotalInvestmentAcrossInvestors().toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500">
            <p className="text-sm text-gray-600 font-medium">Assigned Trees</p>
            <p className="text-2xl font-bold text-orange-600 mt-2">
              {stats.assignedTrees ||
                investors.reduce(
                  (sum, inv) => sum + (inv.investedTrees?.length || 0),
                  0
                )}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-cyan-500">
            <p className="text-sm text-gray-600 font-medium">Available Trees</p>
            <p className="text-2xl font-bold text-cyan-600 mt-2">
              {stats.availableTrees || 0}
            </p>
          </div>
        </div>

        {/* Investors List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Investors & Certificates
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Showing {investors.length} investor
                  {investors.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Icon name="dollar" size={20} className="text-green-600" />
                <span>
                  Total Investment: $
                  {calculateTotalInvestmentAcrossInvestors().toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {investors.length === 0 ? (
              <div className="text-center py-12 px-4">
                <Icon
                  name="users"
                  size={64}
                  className="mx-auto text-gray-400 mb-4"
                />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  No investors found
                </p>
                <p className="text-gray-600 mb-6">
                  Get started by creating your first investor
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={openCreateModal}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                  >
                    <Icon name="plus" size={20} />
                    Create First Investor
                  </button>
                  <button
                    onClick={handleRefresh}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center justify-center gap-2"
                  >
                    <Icon name="refresh" size={20} />
                    Refresh
                  </button>
                </div>
              </div>
            ) : (
              investors.map((investor) => {
                const investorTotalInvestment =
                  calculateInvestorTotalInvestment(investor);
                const treeCount = investor.investedTrees?.length || 0;

                return (
                  <div key={investor._id}>
                    {/* Investor Row */}
                    <div className="p-6 hover:bg-gray-50 transition">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <h3 className="text-lg font-semibold text-gray-800">
                              {investor.name}
                            </h3>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                investor.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : investor.status === "inactive"
                                  ? "bg-gray-100 text-gray-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {investor.status}
                            </span>
                            {investor.investorId && (
                              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                ID: {investor.investorId}
                              </span>
                            )}
                            {treeCount > 0 && (
                              <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">
                                {treeCount} tree{treeCount !== 1 ? "s" : ""}
                              </span>
                            )}
                            <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 flex items-center gap-1">
                              <Icon name="money" size={12} />$
                              {investorTotalInvestment.toLocaleString()}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Email:</span>
                              <span className="truncate">{investor.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Phone:</span>
                              <span>{investor.phone || "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Trees:</span>
                              <span className="font-semibold text-green-700">
                                {treeCount} tree{treeCount !== 1 ? "s" : ""}
                              </span>
                            </div>
                          </div>

                          {/* Investor's Trees Preview */}
                          {treeCount > 0 && (
                            <div className="mt-3">
                              <div className="flex flex-wrap gap-2">
                                {investor.investedTrees
                                  .slice(0, 4)
                                  .map((treeItem, index) => (
                                    <span
                                      key={index}
                                      className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-50 text-green-700 rounded border border-green-200"
                                    >
                                      <Icon name="tree" size={12} />
                                      {treeItem.tree?.treeId ||
                                        treeItem.treeId ||
                                        `Tree ${index + 1}`}
                                    </span>
                                  ))}
                                {treeCount > 4 && (
                                  <span className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                    +{treeCount - 4} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Edit Investor Button */}
                          <button
                            onClick={() => openEditModal(investor)}
                            className="flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition border border-blue-200"
                            title="Edit Investor"
                          >
                            <Icon name="edit" size={18} />
                            <span className="text-sm">Edit</span>
                          </button>
                          <button
                            onClick={() => openGenerateCertModal(investor)}
                            className="flex items-center gap-1 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition border border-green-200"
                            title="Generate Harvest Certificate"
                          >
                            <Icon name="harvest" size={18} />
                            <span className="text-sm">Harvest Cert</span>
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(investor._id, investor.name)
                            }
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition border border-red-200"
                            title="Delete Investor"
                          >
                            <Icon name="delete" size={18} />
                          </button>
                          <button
                            onClick={() => toggleInvestor(investor)}
                            className={`p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition border border-gray-200 ${
                              expandedInvestor === investor._id
                                ? "transform rotate-180"
                                : ""
                            }`}
                          >
                            <Icon name="chevronDown" size={18} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details with Full Trees List */}
                    {expandedInvestor === investor._id && (
                      <div className="bg-gray-50 p-6 border-t border-gray-200">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Trees Section */}
                          <div>
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Icon name="tree" size={18} />
                                Assigned Trees ({treeCount})
                              </h4>
                              <div className="text-right">
                                <div className="text-sm font-semibold text-green-700">
                                  Investment: $
                                  {investorTotalInvestment.toLocaleString()}
                                </div>
                              </div>
                            </div>

                            {treeCount > 0 ? (
                              <div className="space-y-3">
                                {investor.investedTrees.map(
                                  (treeItem, index) => (
                                    <div
                                      key={index}
                                      className="bg-white border border-gray-200 rounded-lg p-4"
                                    >
                                      <div className="flex justify-between items-start mb-2">
                                        <div>
                                          <p className="font-semibold text-gray-800">
                                            {treeItem.tree?.treeId ||
                                              treeItem.treeId ||
                                              `Tree ${index + 1}`}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            Block:{" "}
                                            {treeItem.tree?.block || "N/A"}
                                          </p>
                                        </div>
                                        <div className="text-right">
                                          <span
                                            className={`px-2 py-1 text-xs rounded-full ${
                                              treeItem.tree?.healthStatus ===
                                              "Healthy"
                                                ? "bg-green-100 text-green-800"
                                                : treeItem.tree
                                                    ?.healthStatus === "Warning"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : treeItem.tree
                                                    ?.healthStatus === "Dead"
                                                ? "bg-red-100 text-red-800"
                                                : "bg-gray-100 text-gray-800"
                                            }`}
                                          >
                                            {treeItem.tree?.healthStatus ||
                                              "Unknown"}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="text-xs text-gray-600 space-y-1">
                                        <p>
                                          Lifecycle:{" "}
                                          {treeItem.tree?.lifecycleStatus ||
                                            "N/A"}
                                        </p>
                                        <p>
                                          Planted:{" "}
                                          {treeItem.tree?.plantedDate
                                            ? new Date(
                                                treeItem.tree.plantedDate
                                              ).toLocaleDateString()
                                            : "N/A"}
                                        </p>
                                        <p>
                                          NFC Tag:{" "}
                                          {treeItem.tree?.nfcTagId || "N/A"}
                                        </p>
                                        {treeItem.investedAt && (
                                          <p className="text-gray-500 text-xs">
                                            Assigned:{" "}
                                            {new Date(
                                              treeItem.investedAt
                                            ).toLocaleDateString()}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            ) : (
                              <div className="text-center py-8 text-gray-500 text-sm bg-white rounded-lg border border-gray-200">
                                No trees assigned to this investor
                              </div>
                            )}
                          </div>

                          {/* Certificates Section */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                              <Icon name="award" size={18} />
                              Certificates (
                              {certificates[investor._id]?.length || 0})
                            </h4>

                            {certificates[investor._id]?.length > 0 ? (
                              <div className="space-y-4">
                                {certificates[investor._id].map((cert) => (
                                  <div
                                    key={cert.certificateId || cert._id}
                                    className="bg-white border border-gray-200 rounded-lg p-4"
                                  >
                                    <p className="font-medium">
                                      {cert.certificateType || "Certificate"}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      Generated:{" "}
                                      {new Date(
                                        cert.generatedAt || cert.createdAt
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-8 text-gray-500 text-sm bg-white rounded-lg border border-gray-200">
                                No certificates generated yet
                              </div>
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
      <CreateInvestorModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSuccess={handleCreateInvestorSuccess}
      />

      {/* Edit Investor Modal */}
      <EditInvestorModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        investor={selectedInvestorForEdit}
        onSuccess={handleEditInvestorSuccess}
      />

      <GenerateCertificateModal
        isOpen={isGenerateCertModalOpen}
        onClose={closeGenerateCertModal}
        investor={selectedInvestorForCert}
        onCertificateGenerated={handleCertificateGenerated}
      />
    </div>
  );
}

// Add this component to your InvestorCertificateManager.jsx

// const GenerateHarvestCertificateModal = ({
//   isOpen,
//   onClose,
//   investor,
//   onSuccess,
// }) => {
//   const [harvestedTrees, setHarvestedTrees] = useState([]);
//   const [selectedTreeId, setSelectedTreeId] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [treesLoading, setTreesLoading] = useState(false);

//   useEffect(() => {
//     if (isOpen && investor) {
//       fetchHarvestedTrees();
//     }
//   }, [isOpen, investor]);

//   const fetchHarvestedTrees = async () => {
//     try {
//       setTreesLoading(true);
//       const response = await fetch(
//         `http://localhost:5000/api/certificates/harvestable/${investor._id}`
//       );
//       const data = await response.json();

//       console.log(data);

//       if (data.success) {
//         setHarvestedTrees(data.data || []);
//       } else {
//         console.error("Failed to fetch harvested trees:", data.error);
//         setHarvestedTrees([]);
//       }
//     } catch (error) {
//       console.error("Error fetching harvested trees:", error);
//       setHarvestedTrees([]);
//     } finally {
//       setTreesLoading(false);
//     }
//   };

// const navigate = useNavigate();

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   if (!selectedTreeId) {
//     alert("Please select a harvested tree");
//     return;
//   }

//   setLoading(true);
//   try {
//     const response = await fetch(
//       "http://localhost:5000/api/certificates/generate-harvest",
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ treeId: selectedTreeId }),
//       }
//     );

//     const data = await response.json();

//     console.log(data);

//     // ✅ Case 1: Certificate already exists → navigate
//     if (data.alreadyExists && data.data?.certificateId) {
//       navigate(`/certificates/${data.data.certificateId}`);
//       onClose();
//       return;
//     }

//     // ✅ Case 2: Newly generated certificate → navigate
//     if (data.success && data.data?.certificateId) {
//       alert("✅ Harvest certificate generated successfully!");
//       navigate(`/certificates/${data.data.certificateId}`);
//       onSuccess?.();
//       onClose();
//       return;
//     }

//     // ❌ Real error
//     alert(`❌ Failed: ${data.error || "Unknown error"}`);
//   } catch (error) {
//     console.error("Certificate generation error:", error);
//     alert(`❌ Error: ${error.message}`);
//   } finally {
//     setLoading(false);
//   }
// };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
//         <div className="flex items-center justify-between p-6 border-b">
//           <h2 className="text-xl font-bold text-gray-800">
//             Generate Harvest Certificate
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             <svg
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//             >
//               <circle cx="12" cy="12" r="10" />
//               <path d="m15 9-6 6m0-6 6 6" />
//             </svg>
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           <div className="bg-blue-50 p-4 rounded-lg">
//             <p className="text-sm text-gray-700">
//               <span className="font-medium">Investor:</span> {investor?.name}
//             </p>
//           </div>

//           <div className="bg-green-50 p-4 rounded-lg border border-green-200">
//             <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
//               <svg
//                 width="18"
//                 height="18"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//               >
//                 <path d="M12 22v-7" />
//                 <path d="M8 15h8" />
//                 <path d="M12 2v5" />
//                 <path d="M18 12a6 6 0 1 0-12 0" />
//               </svg>
//               Select Harvested Tree
//             </h4>

//             {treesLoading ? (
//               <div className="flex items-center justify-center py-4">
//                 <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
//                 <span className="ml-2 text-gray-600">Loading...</span>
//               </div>
//             ) : harvestedTrees.length === 0 ? (
//               <div className="text-center py-4 text-gray-500">
//                 <p className="font-medium mb-1">No harvested trees found</p>
//                 <p className="text-sm">
//                   This investor has no trees with 'Harvested' status.
//                 </p>
//               </div>
//             ) : (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Available Harvested Trees{" "}
//                   <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   value={selectedTreeId}
//                   onChange={(e) => setSelectedTreeId(e.target.value)}
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
//                   required
//                 >
//                   <option value="">-- Select a harvested tree --</option>
//                   {harvestedTrees.map((tree) => (
//                     <option key={tree._id} value={tree._id}>
//                       {tree.treeId} (Block: {tree.block})
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             )}
//           </div>

//           <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
//             <div className="flex items-start gap-2">
//               <svg
//                 width="20"
//                 height="20"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 className="text-blue-600 flex-shrink-0"
//               >
//                 <circle cx="12" cy="12" r="10" />
//                 <path d="M12 16v-4m0-4h.01" />
//               </svg>
//               <div>
//                 <p className="text-sm font-medium text-blue-800 mb-1">
//                   Requirements:
//                 </p>
//                 <ul className="text-xs text-blue-700 space-y-1">
//                   <li>• Tree must be in 'Harvested' status</li>
//                   <li>• Certificate will be blockchain verified</li>
//                   <li>• One certificate per tree only</li>
//                 </ul>
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-end gap-3 pt-4 border-t">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
//               disabled={loading}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
//               disabled={loading || harvestedTrees.length === 0}
//             >
//               {loading ? "Generating..." : "Generate Certificate"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };
