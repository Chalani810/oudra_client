// oudra-client/src/pages/TasksPage.jsx
import React from "react";
//import Sidebar from "../components/SideBar";
import TasksTopBar from "../component/Tasks/TasksTopBar";
import TasksTable from "../component/Tasks/TasksTable";

const TasksPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/*<Sidebar /> */}

      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-64 overflow-auto">

        {/* Top bar */}
        <TasksTopBar />

        <div className="p-6">
          <div className="bg-white rounded-xl shadow-sm">
            <TasksTable />
          </div>
        </div>

      </div>
    </div>
  );
};

export default TasksPage;
