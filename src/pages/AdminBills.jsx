// src/pages/AdminBills.jsx

import React from "react";
import OrderTable from "../component/AdminOrder/OrderTable";
import Sidebar from "../component/AdminEvent/Sidebar";

const AdminBills = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto ml-0 md:ml-64">
        <div className="p-4 md:p-6 lg:p-8">
          <div className="max-w-full mx-auto">
            {/* Table Container */}
            <div className="w-full overflow-x-auto rounded-xl shadow-sm bg-white">
              <OrderTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBills;