// path: oudra-client/src/pages/TreeMgtPage.jsx
// CHANGES FROM EXISTING:
//  1. Added searchTerm and filters state
//  2. Passes onSearch and onFilter handlers to TreeMgtTopBar
//  3. Passes searchTerm and filters down to TreeTable

import React, { useState } from "react";
import TreeMgtTopBar from "../component/TreeMgt/TreeMgtTopBar";
import TreeTable from "../component/TreeMgt/TreeTable";
import SidePanel from "../component/SidePanel";

const TreeMgtPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters,    setFilters]    = useState({});
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTreeAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidePanel />

      <div className="flex-1 ml-0 md:ml-64 overflow-auto">
        <TreeMgtTopBar
          onTreeAdded={handleTreeAdded}
          onSearch={setSearchTerm}
          onFilter={setFilters}
        />

        <div className="p-6">
          <div className="bg-white rounded-xl shadow-sm">
            <TreeTable
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

export default TreeMgtPage;