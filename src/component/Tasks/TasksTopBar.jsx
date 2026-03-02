// oudra-client/src/components/Tasks/TasksTopBar.jsx
// CHANGES FROM EXISTING:
//  1. Redesigned top bar to match Tree/Employee Management style (title + button left, search + filter right)
//  2. Added collapsible filter panel with: Task ID, Type, Priority, Assigned Employee, Block, Due Date range, Status
//  3. Active filter count badge on Filter button
//  4. Clear All Filters button
//  5. onFilter prop added

import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import AddTaskModal from "./AddTaskModal";
import { employeeService } from "../../services/employeeService";

const TASK_TYPES = [
  "inspection", "weeding", "fertilizing", "land clearing", "planting",
  "special treatments", "road maintenance", "pruning", "inoculation",
  "fence maintenance", "take measurements", "harvesting", "other"
];

const PRIORITY_OPTIONS = ["low", "medium", "high", "urgent"];
const BLOCK_OPTIONS    = ["Block-A", "Block-B", "Block-C", "Block-D", "Block-E", "Block-F"];
const STATUS_OPTIONS   = ["pending", "assigned", "in_progress", "completed", "cancelled", "overdue"];

const STATUS_LABELS = {
  pending: "Pending", assigned: "Assigned", in_progress: "In Progress",
  completed: "Completed", cancelled: "Cancelled", overdue: "Overdue"
};

const EMPTY_FILTERS = {
  taskId:       "",
  taskType:     "",
  priority:     "",
  assignedTo:   "",
  block:        "",
  dueDateFrom:  "",
  dueDateTo:    "",
  status:       "",
};

const TasksTopBar = ({ onTaskCreated, onSearch, onFilter }) => {
  const [isAddModalOpen,  setAddModalOpen]   = useState(false);
  const [searchTerm,      setSearchTerm]     = useState("");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filters,         setFilters]         = useState(EMPTY_FILTERS);
  const [employees,       setEmployees]       = useState([]);

  // Load employee list for the "Assigned Employee" dropdown
  useEffect(() => {
    employeeService.getAllEmployees()
      .then(res => setEmployees(res.data || []))
      .catch(err => console.error("Error loading employees for filter:", err));
  }, []);

  const activeFilterCount = Object.values(filters).filter(v => v !== "").length;

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

  const handleTaskCreated = () => {
    setAddModalOpen(false);
    onTaskCreated?.();
  };

  return (
    <>
      <div className="bg-white border-b">
        {/* ── Top row ───────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4">
          {/* Title + New Task button */}
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Tasks & Workforce Management</h1>
            <button
              onClick={() => setAddModalOpen(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={20} />
              New Task
            </button>
          </div>

          {/* Search + Filter toggle */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={() => setShowFilterPanel(prev => !prev)}
              className={`relative flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                showFilterPanel || activeFilterCount > 0
                  ? "bg-green-50 border-green-500 text-green-700"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Filter size={20} />
              Filter
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
                Filter Tasks
                {activeFilterCount > 0 && (
                  <span className="ml-2 text-green-600">({activeFilterCount} active)</span>
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
              {/* Task ID */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Task ID</label>
                <input
                  type="text"
                  name="taskId"
                  value={filters.taskId}
                  onChange={handleFilterChange}
                  placeholder="e.g. TASK-001"
                  className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Task Type */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                <select
                  name="taskType"
                  value={filters.taskType}
                  onChange={handleFilterChange}
                  className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Types</option>
                  {TASK_TYPES.map(t => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Priority</label>
                <select
                  name="priority"
                  value={filters.priority}
                  onChange={handleFilterChange}
                  className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Priorities</option>
                  {PRIORITY_OPTIONS.map(p => (
                    <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                  ))}
                </select>
              </div>

              {/* Assigned Employee */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Assigned Employee</label>
                <select
                  name="assignedTo"
                  value={filters.assignedTo}
                  onChange={handleFilterChange}
                  className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Employees</option>
                  {employees.map(emp => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name} ({emp.empId})
                    </option>
                  ))}
                </select>
              </div>

              {/* Block */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Block</label>
                <select
                  name="block"
                  value={filters.block}
                  onChange={handleFilterChange}
                  className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Blocks</option>
                  {BLOCK_OPTIONS.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Statuses</option>
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </div>

              {/* Due Date From */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Due Date From</label>
                <input
                  type="date"
                  name="dueDateFrom"
                  value={filters.dueDateFrom}
                  onChange={handleFilterChange}
                  className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Due Date To */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Due Date To</label>
                <input
                  type="date"
                  name="dueDateTo"
                  value={filters.dueDateTo}
                  onChange={handleFilterChange}
                  className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onTaskCreated={handleTaskCreated}
      />
    </>
  );
};

export default TasksTopBar;