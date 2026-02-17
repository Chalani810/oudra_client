// oudra-client/src/components/Tasks/TasksTable.jsx
import React, { useState, useEffect } from "react";
import { Edit, Trash2, RefreshCw, Eye, Calendar, AlertCircle, CheckCircle } from "lucide-react";
import { taskService } from "../../services/taskService";
import EditTaskModal from "./EditTaskModal";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  assigned: "bg-blue-100 text-blue-800",
  in_progress: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  overdue: "bg-red-200 text-red-900"
};

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800"
};

const TasksTable = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getAllTasks();
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      alert("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId, taskTitle) => {
    if (window.confirm(`Are you sure you want to delete "${taskTitle}"? This action cannot be undone.`)) {
      try {
        await taskService.deleteTask(taskId);
        alert("Task deleted successfully");
        fetchTasks();
      } catch (error) {
        console.error("Error deleting task:", error);
        alert("Failed to delete task");
      }
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleViewDetails = (task) => {
    setSelectedTask(task);
    setShowDetails(true);
  };

  const handleTaskUpdated = () => {
    setIsEditModalOpen(false);
    setEditingTask(null);
    fetchTasks();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: "Pending",
      assigned: "Assigned",
      in_progress: "In Progress",
      completed: "Completed",
      cancelled: "Cancelled",
      overdue: "Overdue"
    };
    return statusMap[status] || status;
  };

  const getPriorityText = (priority) => {
    const priorityMap = {
      low: "Low",
      medium: "Medium",
      high: "High",
      urgent: "Urgent"
    };
    return priorityMap[priority] || priority;
  };

  const isTaskOverdue = (dueDate, status) => {
    if (status === "completed" || status === "cancelled") return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dueDate) < today;
  };

  // Update task statuses to check for overdue
  const updatedTasks = tasks.map(task => {
    if (isTaskOverdue(task.dueDate, task.status) && task.status !== "overdue") {
      return { ...task, status: "overdue" };
    }
    return task;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto w-full bg-white rounded-xl shadow-sm">
        {/* Table Header with Refresh */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Tasks ({tasks.length})
          </h2>
          <button 
            onClick={fetchTasks}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3 text-left font-medium">Task ID</th>
              <th className="p-3 text-left font-medium">Title</th>
              <th className="p-3 text-left font-medium">Type</th>
              <th className="p-3 text-left font-medium">Priority</th>
              <th className="p-3 text-left font-medium">Assigned To</th>
              <th className="p-3 text-left font-medium">Block</th>
              <th className="p-3 text-left font-medium">Due Date</th>
              <th className="p-3 text-left font-medium">Status</th>
              <th className="p-3 text-center font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {updatedTasks.map((task) => (
              <tr key={task._id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-mono text-xs">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                    {task.taskId}
                  </span>
                </td>
                <td className="p-3 font-medium">
                  <div className="max-w-xs truncate" title={task.title}>
                    {task.title}
                  </div>
                  {task.description && (
                    <div className="text-xs text-gray-500 truncate max-w-xs" title={task.description}>
                      {task.description}
                    </div>
                  )}
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    {task.taskType}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${priorityColors[task.priority]}`}>
                    {getPriorityText(task.priority)}
                  </span>
                </td>
                <td className="p-3">
                  {task.assignedTo ? (
                    <div>
                      <div className="font-medium">{task.assignedTo.name}</div>
                      <div className="text-xs text-gray-500">{task.assignedTo.empId}</div>
                    </div>
                  ) : (
                    "Unassigned"
                  )}
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-semibold">
                    Block {task.block}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} className="text-gray-400" />
                    <span className={isTaskOverdue(task.dueDate, task.status) ? "text-red-600 font-semibold" : ""}>
                      {formatDate(task.dueDate)}
                    </span>
                  </div>
                  {isTaskOverdue(task.dueDate, task.status) && (
                    <div className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle size={10} />
                      Overdue
                    </div>
                  )}
                </td>
                <td className="p-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[task.status]}`}>
                    {getStatusText(task.status)}
                  </span>
                  {task.completedAt && (
                    <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <CheckCircle size={10} />
                      {formatDate(task.completedAt)}
                    </div>
                  )}
                </td>
                <td className="p-3">
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={() => handleViewDetails(task)}
                      className="text-gray-600 hover:text-green-700 transition-colors p-1"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleEdit(task)}
                      className="text-gray-600 hover:text-blue-700 transition-colors p-1"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(task._id, task.title)}
                      className="text-gray-600 hover:text-red-700 transition-colors p-1"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {tasks.length === 0 && (
          <div className="text-center p-8 text-gray-500">
            <div className="mb-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-2">
                <AlertCircle size={24} className="text-gray-400" />
              </div>
            </div>
            <p className="text-lg font-medium mb-2">No tasks found</p>
            <p className="text-sm">Click "New Task" to create your first task.</p>
          </div>
        )}
      </div>

      {/* Task Details Modal */}
      {showDetails && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Task Details</h2>
                <p className="text-sm text-gray-500">Task ID: {selectedTask.taskId}</p>
              </div>
              <button 
                onClick={() => setShowDetails(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-gray-500">✕</span>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Title</h3>
                  <p className="text-gray-900 font-medium">{selectedTask.title}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Type</h3>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    {selectedTask.taskType}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Priority</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${priorityColors[selectedTask.priority]}`}>
                    {getPriorityText(selectedTask.priority)}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[selectedTask.status]}`}>
                    {getStatusText(selectedTask.status)}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Block</h3>
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-semibold">
                    Block {selectedTask.block}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Due Date</h3>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} className="text-gray-400" />
                    <span>{formatDate(selectedTask.dueDate)}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedTask.description && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedTask.description}</p>
                </div>
              )}

              {/* Assigned To */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Assigned To</h3>
                {selectedTask.assignedTo ? (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{selectedTask.assignedTo.name}</p>
                      <p className="text-sm text-gray-500">{selectedTask.assignedTo.email}</p>
                      <p className="text-xs text-gray-400">ID: {selectedTask.assignedTo.empId}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Not assigned</p>
                )}
              </div>

              {/* Trees */}
              {(selectedTask.trees && selectedTask.trees.length > 0) || selectedTask.specificTree ? (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Related Trees</h3>
                  <div className="space-y-2">
                    {selectedTask.specificTree && (
                      <div className="p-2 bg-green-50 border border-green-200 rounded">
                        <p className="text-sm font-medium text-green-800">Specific Tree:</p>
                        <p className="text-sm text-green-700">
                          {selectedTask.specificTree.treeId} - NFC: {selectedTask.specificTree.nfcTagId || "Not assigned"}
                        </p>
                      </div>
                    )}
                    {selectedTask.trees && selectedTask.trees.length > 0 && (
                      <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                        <p className="text-sm font-medium text-blue-800">Multiple Trees ({selectedTask.trees.length}):</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedTask.trees.map((tree, index) => (
                            <span key={index} className="text-xs bg-white px-2 py-1 rounded border">
                              {tree.treeId}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}

              {/* Notes */}
              {selectedTask.notes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Manager Notes</h3>
                  <p className="text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    {selectedTask.notes}
                  </p>
                </div>
              )}

              {/* Field Worker Notes */}
              {selectedTask.fieldWorkerNotes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Field Worker Notes
                  </h3>
                  <p className="text-gray-600 bg-green-50 p-3 rounded-lg border border-green-200">
                    {selectedTask.fieldWorkerNotes}
                  </p>
                </div>
              )}

              {/* Completion Notes */}
              {selectedTask.completionNotes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Completion Notes</h3>
                  <p className="text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                    {selectedTask.completionNotes}
                  </p>
                </div>
              )}

              {/* Timeline */}
              <div className="border-t pt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Timeline</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Created:</span>
                    <span className="font-medium">{formatDate(selectedTask.createdAt)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Assigned:</span>
                    <span className="font-medium">{selectedTask.assignedAt ? formatDate(selectedTask.assignedAt) : "Not assigned"}</span>
                  </div>
                  {selectedTask.completedAt && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Completed:</span>
                      <span className="font-medium text-green-600">{formatDate(selectedTask.completedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t">
              <button
                onClick={() => setShowDetails(false)}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTask(null);
        }}
        task={editingTask}
        onTaskUpdated={handleTaskUpdated}
      />
    </>
  );
};

export default TasksTable;