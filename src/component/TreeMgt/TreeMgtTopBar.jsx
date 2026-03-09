// path: src/component/TreeMgt/TreeMgtTopBar.jsx
// CHANGES FROM EXISTING:
//  1. Added filter panel toggle button with active filter count badge
//  2. Added filter panel with dropdowns for Block, Health Status, Lifecycle Status
//     and inputs for Tree ID, Investor ID, Age range (min/max)
//  3. Added Clear Filters button
//  4. onFilter prop now receives a filters object instead of being unused

import React, { useState } from "react";
import { Plus, Search, Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import AddTreeModal from "./AddTreeModal";
import SuccessModal from "../SuccessModal"; 

const BLOCKS = ["Block-A", "Block-B", "Block-C", "Block-D", "Block-E", "Block-F"];

const HEALTH_STATUSES = ["Healthy", "Warning", "Damaged", "Dead"];

const LIFECYCLE_STATUSES = [
  "Growing",
  "Ready for 1st Inoculation",
  "Inoculated Once",
  "Ready for 2nd Inoculation",
  "Inoculated Twice",
  "Ready for Harvest",
  "Harvested",
];

const EMPTY_FILTERS = {
  block:           "",
  healthStatus:    "",
  lifecycleStatus: "",
  treeId:          "",
  investorId:      "",
  ageMin:          "",
  ageMax:          "",
};

const TreeMgtTopBar = ({ onTreeAdded, onSearch, onFilter }) => {
  const [isAddModalOpen,   setAddModalOpen]   = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // Add this line
  const [searchTerm,       setSearchTerm]     = useState("");
  const [showFilterPanel,  setShowFilterPanel] = useState(false);
  const [filters,          setFilters]         = useState(EMPTY_FILTERS);

  // Count how many filters are currently active
  const activeFilterCount = Object.values(filters).filter((v) => v !== "").length;

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...filters, [name]: value };
    setFilters(updated);
    onFilter?.(updated);
  };

  const handleClearFilters = () => {
    setFilters(EMPTY_FILTERS);
    onFilter?.(EMPTY_FILTERS);
  };

  return (
    <>
      <div className="bg-white border-b">
        {/* ── Top row ───────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4">
          {/* Title + Add */}
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Tree Management</h1>
            <button
              onClick={() => setAddModalOpen(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={20} />
              New Tree
            </button>
          </div>

          {/* Search + Filter toggle */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:w-64">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search trees..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Filter toggle button */}
            <button
              onClick={() => setShowFilterPanel((prev) => !prev)}
              className={`relative flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                showFilterPanel || activeFilterCount > 0
                  ? "bg-green-50 border-green-500 text-green-700"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Filter size={20} />
              Filter
              {/* Active filter count badge */}
              {activeFilterCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
              {showFilterPanel ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>

        {/* ── Filter panel ──────────────────────────────────────── */}
        {showFilterPanel && (
          <div className="border-t px-4 py-4 bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-gray-700">
                Filter Trees
                {activeFilterCount > 0 && (
                  <span className="ml-2 text-green-600">
                    ({activeFilterCount} active)
                  </span>
                )}
              </h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition-colors"
                >
                  <X size={14} />
                  Clear All Filters
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {/* Tree ID */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Tree ID
                </label>
                <input
                  type="text"
                  name="treeId"
                  value={filters.treeId}
                  onChange={handleFilterChange}
                  placeholder="e.g. T-000012"
                  className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Investor ID */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Investor ID
                </label>
                <input
                  type="text"
                  name="investorId"
                  value={filters.investorId}
                  onChange={handleFilterChange}
                  placeholder="e.g. INV-001"
                  className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Block */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Block
                </label>
                <select
                  name="block"
                  value={filters.block}
                  onChange={handleFilterChange}
                  className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Blocks</option>
                  {BLOCKS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Health Status */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Health Status
                </label>
                <select
                  name="healthStatus"
                  value={filters.healthStatus}
                  onChange={handleFilterChange}
                  className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Health Statuses</option>
                  {HEALTH_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Lifecycle Status */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Lifecycle Status
                </label>
                <select
                  name="lifecycleStatus"
                  value={filters.lifecycleStatus}
                  onChange={handleFilterChange}
                  className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Lifecycle Statuses</option>
                  {LIFECYCLE_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Age Min */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Min Age (years)
                </label>
                <input
                  type="number"
                  name="ageMin"
                  value={filters.ageMin}
                  onChange={handleFilterChange}
                  placeholder="e.g. 1"
                  min="0"
                  className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Age Max */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Max Age (years)
                </label>
                <input
                  type="number"
                  name="ageMax"
                  value={filters.ageMax}
                  onChange={handleFilterChange}
                  placeholder="e.g. 5"
                  min="0"
                  className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

     {/* Add Tree Modal */}
      <AddTreeModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={() => {
          setAddModalOpen(false);
          setIsSuccessModalOpen(true); // Open success modal
          onTreeAdded?.(); // Refresh the table
        }}
      />

      {/* Success Modal */}
      <SuccessModal 
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Tree Registered!"
        message="The new tree has been successfully added to the system and queued for blockchain synchronization."
      />
    </>
  );
};

export default TreeMgtTopBar;