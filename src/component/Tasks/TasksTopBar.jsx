// oudra-client/src/components/Tasks/TasksTopBar.jsx
import React, { useState } from "react";
import { Search, Filter, Plus } from "lucide-react";
import AddTaskModal from "./AddTaskModal";

const TasksTopBar = ({ onTaskCreated, onSearch }) => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleTaskCreated = () => {
    setAddModalOpen(false);
    onTaskCreated?.();
  };

  return (
    <>
      <div className="flex items-center justify-between bg-white px-6 py-4 shadow-sm border-b border-gray-200">
        {/* LEFT - Title */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Tasks & Workforce Management
          </h2>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center space-x-4">
          {/* Filter Button */}
          <button
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            aria-label="Filter"
          >
            <Filter size={20} className="text-gray-600" />
          </button>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search Task"
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-60 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          {/* New Task Button */}
          <button 
            className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            onClick={() => setAddModalOpen(true)}
          >
            <Plus size={18} className="mr-2" />
            New Task
          </button>
        </div>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onTaskCreated={handleTaskCreated}
      />
    </>
  );
};

export default TasksTopBar;