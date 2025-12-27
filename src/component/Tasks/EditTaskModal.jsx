// oudra-client/src/components/Tasks/EditTaskModal.jsx
import React, { useState, useEffect } from "react";
import { X, Calendar, AlertCircle, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { employeeService } from "../../services/employeeService";
import { treeService } from "../../services/treeService";
import { taskService } from "../../services/taskService";

// FINAL TASK TYPES - Use exactly these values
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

const statusOptions = [
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "assigned", label: "Assigned", color: "bg-blue-100 text-blue-800" },
  { value: "in_progress", label: "In Progress", color: "bg-purple-100 text-purple-800" },
  { value: "completed", label: "Completed", color: "bg-green-100 text-green-800" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
  { value: "overdue", label: "Overdue", color: "bg-red-200 text-red-900" }
];

const EditTaskModal = ({ isOpen, onClose, task, onTaskUpdated }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    taskType: "inspection",
    priority: "medium",
    status: "assigned",
    assignedTo: "",
    block: "",
    trees: [],
    specificTree: "",
    dueDate: "",
    notes: "",
    fieldWorkerNotes: ""
  });
  
  const [employees, setEmployees] = useState([]);
  const [allTrees, setAllTrees] = useState([]);
  const [filteredTrees, setFilteredTrees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showTreeSelection, setShowTreeSelection] = useState(false);

  useEffect(() => {
    if (task && isOpen) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        taskType: task.taskType || "inspection",
        priority: task.priority || "medium",
        status: task.status || "assigned",
        assignedTo: task.assignedTo?._id || task.assignedTo || "",
        block: task.block || "",
        trees: task.trees?.map(t => t._id || t) || [],
        specificTree: task.specificTree?._id || task.specificTree || "",
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "",
        notes: task.notes || "",
        fieldWorkerNotes: task.fieldWorkerNotes || ""
      });
    }
  }, [task, isOpen]);

  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
      fetchTrees();
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.block && allTrees.length > 0) {
      const normalizeBlock = (block) => {
        if (!block) return "";
        return block.toString()
          .toUpperCase()
          .replace(/\s+/g, '')
          .replace(/-/g, '')
          .replace(/^BLOCK/, '');
      };
      
      const normalizedSelectedBlock = normalizeBlock(formData.block);
      const filtered = allTrees.filter(tree => {
        const treeBlock = tree.block || "";
        const normalizedTreeBlock = normalizeBlock(treeBlock);
        return normalizedTreeBlock === normalizedSelectedBlock;
      });
      
      console.log(`Filtered ${filtered.length} trees for block ${formData.block}`);
      setFilteredTrees(filtered);
    } else {
      setFilteredTrees([]);
    }
  }, [formData.block, allTrees]);

  const fetchEmployees = async () => {
    try {
      const response = await employeeService.getAllEmployees();
      setEmployees(response.data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchTrees = async () => {
    try {
      const trees = await treeService.getAllTrees();
      setAllTrees(trees);
    } catch (error) {
      console.error("Error fetching trees:", error);
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
      const taskData = {
        ...formData,
        dueDate: new Date(formData.dueDate).toISOString(),
        trees: formData.trees.length > 0 ? formData.trees : undefined,
        specificTree: formData.specificTree || undefined
      };
      
      console.log("Updating task with data:", taskData);
      await taskService.updateTask(task._id, taskData);
      alert("Task updated successfully!");
      onTaskUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating task:", error);
      alert(`Failed to update task: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Edit Task
            </h2>
            <p className="text-sm text-gray-500">Task ID: {task.taskId}</p>
          </div>
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

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {statusOptions.map(option => (
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
                          <p className="text-sm text-blue-700">
                            Please select a block first to see available trees
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

          {/* Notes */}
          <div className="space-y-4">
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
                placeholder="Notes for the field worker (optional)"
              />
            </div>

            {task.fieldWorkerNotes && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                  <CheckCircle className="mr-2" size={16} />
                  Field Worker Notes
                </h4>
                <p className="text-sm text-blue-700">{task.fieldWorkerNotes}</p>
              </div>
            )}
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
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;