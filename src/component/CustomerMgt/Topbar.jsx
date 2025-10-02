import React from "react";
import { Bell, Search } from "lucide-react";

const Topbar = () => {
  return (
    <div className="flex items-center justify-between bg-red-200 px-6 py-4 shadow-sm">
      <h2 className="text-2xl font-semibold">Customer Management Page</h2>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
        </div>
        <button className="px-4 py-2 bg-white border rounded-lg text-sm font-medium">Filters</button>
        <Bell className="text-gray-700" />
        <img src="/profile.jpg" alt="Profile" className="w-8 h-8 rounded-full" />
      </div>
    </div>
  );
};

export default Topbar;
