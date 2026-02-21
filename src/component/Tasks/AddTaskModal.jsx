// oudra-client/src/components/Tasks/AddTaskModal.jsx
import React, { useState, useEffect } from "react";
import { X, Calendar, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { employeeService } from "../../services/employeeService";
import { treeService } from "../../services/treeService";
import { taskService } from "../../services/taskService";

// TASK TYPES
const taskTypes = [
  "inspection",
  "weeding", 
  "fertilizing",
  "land clearing",
  "planting",
  "special treatments",
  "road maintenance",
  "pruning",
  "inoculation",
  "fence maintenance",
  "take measurements",
  "harvesting",
  "other"
];

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" }
];

const blockOptions = ["Block-A", "Block-B", "Block-C", "Block-D", "Block-E", "Block-F"];

const AddTaskModal = ({ isOpen, onClose, onTaskCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    taskType: "inspection", 
    priority: "medium",
    assignedTo: "",
    block: "",
    trees: [],
    specificTree: "",
    dueDate: "",
    notes: ""
  });
  
  const [employees, setEmployees] = useState([]);
  const [allTrees, setAllTrees] = useState([]);
  const [filteredTrees, setFilteredTrees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiStatus, setApiStatus] = useState({
    trees: { loading: false, error: null },
    employees: { loading: false, error: null }
  });
  const [showTreeSelection, setShowTreeSelection] = useState(false); // NEW: Collapsible state

  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
      fetchTrees();
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.block && allTrees.length > 0) {
      console.log("🔍 Filtering trees for block:", formData.block);
      
      const normalizeBlock = (block) => {
        if (!block) return "";
        return block.toString()
          .toUpperCase()
          .replace(/\s+/g, '')
          .replace(/-/g, '')
          .replace(/^BLOCK/, '');
      };
      
      const normalizedSelectedBlock = normalizeBlock(formData.block);
      console.log("Normalized selected block:", normalizedSelectedBlock);
      
      const filtered = allTrees.filter(tree => {
        const treeBlock = tree.block || "";
        const normalizedTreeBlock = normalizeBlock(treeBlock);
        return normalizedTreeBlock === normalizedSelectedBlock;
      });
      
      console.log(`✅ Found ${filtered.length} trees in ${formData.block}`);
      setFilteredTrees(filtered);
    } else {
      setFilteredTrees([]);
    }
  }, [formData.block, allTrees]);

  const fetchEmployees = async () => {
    try {
      setApiStatus(prev => ({ ...prev, employees: { loading: true, error: null } }));
      console.log("👥 Fetching employees...");
      const response = await employeeService.getAllEmployees();
      console.log("✅ Employees fetched:", response.data?.length || 0);
      setEmployees(response.data || []);
      setApiStatus(prev => ({ ...prev, employees: { loading: false, error: null } }));
    } catch (error) {
      console.error("❌ Error fetching employees:", error);
      setApiStatus(prev => ({ ...prev, employees: { loading: false, error: error.message } }));
    }
  };

  const fetchTrees = async () => {
    try {
      setApiStatus(prev => ({ ...prev, trees: { loading: true, error: null } }));
      console.log("🌳 Fetching trees from treeService...");
      
      const trees = await treeService.getAllTrees();
      
      console.log("📊 Trees received:", {
        count: trees.length,
        isArray: Array.isArray(trees)
      });
      
      setAllTrees(trees);
      setApiStatus(prev => ({ ...prev, trees: { loading: false, error: null } }));
      
    } catch (error) {
      console.error("❌ Error fetching trees:", error);
      setApiStatus(prev => ({ ...prev, trees: { loading: false, error: error.message } }));
      setAllTrees([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleTreeSelection = (treeId) => {
    setFormData(prev => {
      const currentTrees = [...prev.trees];
      const index = currentTrees.indexOf(treeId);
      
      if (index === -1) {
        currentTrees.push(treeId);
      } else {
        currentTrees.splice(index, 1);
      }
      
      return { ...prev, trees: currentTrees };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.assignedTo) newErrors.assignedTo = "Please assign to an employee";
    if (!formData.block) newErrors.block = "Block is required";
    if (!formData.dueDate) newErrors.dueDate = "Due date is required";
    
    const selectedDate = new Date(formData.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      newErrors.dueDate = "Due date cannot be in the past";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      console.log("📝 Creating task with data:", formData);
      
      // Preparing data for API - Tree selection is OPTIONAL
      const taskData = {
        title: formData.title,
        description: formData.description || "",
        taskType: formData.taskType,
        priority: formData.priority,
        assignedTo: formData.assignedTo,
        block: formData.block,
        dueDate: new Date(formData.dueDate).toISOString(),
        notes: formData.notes || ""
      };
      
      // Only adding tree-related fields if they exist
      if (formData.trees.length > 0) {
        taskData.trees = formData.trees;
      }
      
      if (formData.specificTree) {
        taskData.specificTree = formData.specificTree;
      }
      
      console.log("🚀 Sending task data to API:", taskData);
      
      const response = await taskService.createTask(taskData);
      console.log("✅ Task creation response:", response);
      
      alert("Task created successfully!");
      onTaskCreated();
      resetForm();
      onClose();
    } catch (error) {
      console.error("❌ Error creating task:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      let errorMessage = "Failed to create task. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      taskType: "inspection",
      priority: "medium",
      assignedTo: "",
      block: "",
      trees: [],
      specificTree: "",
      dueDate: "",
      notes: ""
    });
    setErrors({});
    setShowTreeSelection(false);
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-800">
            Create New Task
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter task title"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Task Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Type
              </label>
              <select
                name="taskType"
                value={formData.taskType}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {taskTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Assigned To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign To <span className="text-red-500">*</span>
              </label>
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.assignedTo ? "border-red-500" : "border-gray-300"
                }`}
                disabled={apiStatus.employees.loading}
              >
                <option value="">Select Employee</option>
                {employees.map(employee => (
                  <option key={employee._id} value={employee._id}>
                    {employee.name} ({employee.empId})
                  </option>
                ))}
              </select>
              {errors.assignedTo && <p className="text-red-500 text-sm mt-1">{errors.assignedTo}</p>}
            </div>

            {/* Block */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Block <span className="text-red-500">*</span>
              </label>
              <select
                name="block"
                value={formData.block}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.block ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Block</option>
                {blockOptions.map(block => (
                  <option key={block} value={block}>{block}</option>
                ))}
              </select>
              {errors.block && <p className="text-red-500 text-sm mt-1">{errors.block}</p>}
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  min={getMinDate()}
                  className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.dueDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter task description (optional)"
            />
          </div>

          {/* Tree Selection - Collapsible Section */}
          <div className="border rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setShowTreeSelection(!showTreeSelection)}
              className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <h3 className="text-lg font-medium text-gray-800">
                Tree Selection (Optional)
              </h3>
              {showTreeSelection ? (
                <ChevronUp className="text-gray-500" size={20} />
              ) : (
                <ChevronDown className="text-gray-500" size={20} />
              )}
            </button>
            
            {showTreeSelection && (
              <div className="p-4 space-y-4">
                {/* Specific Tree (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specific Tree (Optional)
                  </label>
                  <select
                    name="specificTree"
                    value={formData.specificTree}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={filteredTrees.length === 0}
                  >
                    <option value="">Select a specific tree (optional)</option>
                    {filteredTrees.map(tree => (
                      <option key={tree._id} value={tree._id}>
                        {tree.treeId} - {tree.block} {tree.nfcTagId ? `(NFC: ${tree.nfcTagId})` : ""}
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    Select a specific tree if task applies to only one tree
                  </p>
                </div>

                {/* Multiple Trees (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Multiple Trees (Optional)
                  </label>
                  {formData.block ? (
                    <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-3">
                      {filteredTrees.length === 0 ? (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <div className="flex items-start">
                            <AlertCircle className="text-yellow-600 mt-0.5 mr-2" size={18} />
                            <div>
                              <p className="text-sm text-yellow-700 font-medium">No trees found</p>
                              <p className="text-xs text-yellow-600 mt-1">
                                No trees found in "{formData.block}"
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-gray-500 mb-2">
                            Found {filteredTrees.length} tree(s) in {formData.block}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {filteredTrees.map(tree => (
                              <label key={tree._id} className="flex items-center p-2 hover:bg-gray-50 rounded border border-gray-200">
                                <input
                                  type="checkbox"
                                  checked={formData.trees.includes(tree._id)}
                                  onChange={() => handleTreeSelection(tree._id)}
                                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm">
                                  <span className="font-medium">{tree.treeId}</span>
                                  <span className="text-gray-500 ml-2">({tree.block})</span>
                                  {tree.nfcTagId && <span className="text-gray-400 ml-2">NFC: {tree.nfcTagId}</span>}
                                </span>
                              </label>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <AlertCircle className="text-blue-600 mt-0.5 mr-2" size={18} />
                        <div>
                          <p className="text-sm text-blue-700 font-medium">Select a block first</p>
                          <p className="text-xs text-blue-600 mt-1">
                            Please select a block from the dropdown above to see available trees.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    Select multiple trees if task applies to specific trees. 
                    If no trees selected, task applies to ALL trees in the block.
                  </p>
                  {formData.trees.length > 0 && (
                    <p className="text-green-600 text-sm mt-2 font-medium">
                      ✅ Selected {formData.trees.length} tree(s)
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Notes (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="2"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Any additional notes or instructions (optional)"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
              disabled={loading || apiStatus.trees.loading || apiStatus.employees.loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                "Create Task"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;