// src/components/Tasks/TasksTable.jsx
import React from "react";
import { Edit, Trash2 } from "lucide-react";

const sampleTasks = Array.from({ length: 14 }).map((_, i) => ({
  id: 456723,
  task: "Weeding",
  createdOn: "10-04-2025",
  treeId: "T-00001",
  assignedBy: "Lakshan",
  assignedTo: "Sumudu",
  notes: "Need a new trimmer",
  status: ["Completed", "Pending", "Ongoing", "Overdue"][i % 4],
}));

const statusColors = {
  Completed: "bg-green-100 text-green-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Ongoing: "bg-blue-100 text-blue-800",
  Overdue: "bg-red-100 text-red-800",
};

const TasksTable = () => {
  return (
    <div className="overflow-x-auto w-full bg-white rounded-xl shadow-sm">

      <table className="w-full text-sm border-collapse">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="p-3 text-left font-medium">Task ID</th>
            <th className="p-3 text-left font-medium">Task</th>
            <th className="p-3 text-left font-medium">Created On</th>
            <th className="p-3 text-left font-medium">Tree ID</th>
            <th className="p-3 text-left font-medium">Assigned By</th>
            <th className="p-3 text-left font-medium">Assigned To</th>
            <th className="p-3 text-left font-medium">Notes</th>
            <th className="p-3 text-left font-medium">Status</th>
            <th className="p-3 text-center font-medium">Action</th>
          </tr>
        </thead>

        <tbody>
          {sampleTasks.map((task, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="p-3">{task.id}</td>
              <td className="p-3">{task.task}</td>
              <td className="p-3">{task.createdOn}</td>
              <td className="p-3">{task.treeId}</td>
              <td className="p-3">{task.assignedBy}</td>
              <td className="p-3">{task.assignedTo}</td>
              <td className="p-3">{task.notes}</td>
              <td className="p-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[task.status]}`}>
                  {task.status}
                </span>
              </td>
              <td className="p-3 flex justify-center space-x-3">
                <Edit className="text-gray-600 hover:text-blue-700 cursor-pointer" size={18} />
                <Trash2 className="text-gray-600 hover:text-red-700 cursor-pointer" size={18} />
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
};

export default TasksTable;