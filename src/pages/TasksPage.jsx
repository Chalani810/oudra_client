// oudra-client/src/pages/TasksPage.jsx
// CHANGES FROM EXISTING:
//  1. Added searchTerm and filters state
//  2. Passes onSearch and onFilter to TasksTopBar
//  3. Passes searchTerm and filters down to TasksTable

import React, { useState } from "react";
import TasksTopBar from "../component/Tasks/TasksTopBar";
import TasksTable from "../component/Tasks/TasksTable";
import SidePanel from "../component/SidePanel";

const TasksPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters,    setFilters]    = useState({});
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTaskCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidePanel />
      <div className="flex-1 ml-0 md:ml-64 overflow-auto">
        <TasksTopBar
          onTaskCreated={handleTaskCreated}
          onSearch={setSearchTerm}
          onFilter={setFilters}
        />
        <div className="p-6">
          <div className="bg-white rounded-xl shadow-sm">
            <TasksTable
              key={refreshKey}
              searchTerm={searchTerm}
              filters={filters}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksPage;