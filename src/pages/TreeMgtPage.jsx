//path: oudra-client(web app front end)/src/pages/TreeMgtPage.jsx
import React from "react";
import TreeMgtTopBar from "../component/TreeMgt/TreeMgtTopBar";
import TreeTable from "../component/TreeMgt/TreeTable";
import SidePanel from "../component/SidePanel"; 

const TreeMgtPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Side Panel */}
      <SidePanel />

      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-64 overflow-auto">
        
        {/* Top bar */}
        <TreeMgtTopBar />

        <div className="p-6">
          <div className="bg-white rounded-xl shadow-sm">
            <TreeTable />
          </div>
        </div>
      </div>
    </div>
  );
};
export default TreeMgtPage;
