
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const SidePanel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [isTreeManagementOpen, setIsTreeManagementOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/admindashboard" },
    { 
      name: "Tree Management", 
      path: "/treemgt",
      children: [
        { name: "IoT Sensor Data", path: "/iot-sensor-data" },
        { name: "Resin Analysis & AI Insights", path: "/resin-dashboard" },
      ]
    },
    { name: "Tasks & Workforce", path: "/taskmgt" },
    { name: "Investments", path: "/investor-management" },
    { name: "Employees", path: "/employee-mgt" },
    { name: "Customers", path: "" },
    { name: "Settings", path: "" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/signin");
  };

  const toggleTreeManagement = () => {
    setIsTreeManagementOpen(!isTreeManagementOpen);
  };

  const isTreeManagementActive = () => {
    return menuItems
      .find(item => item.name === "Tree Management")
      ?.children?.some(child => child.path === location.pathname) || false;
  };

  return (
    <aside className="w-64 bg-white p-4 border-r fixed h-full flex flex-col">
      {/* Logo */}
      <div className="text-2xl font-extrabold text-black">
        <span className="text-green-600">Ou</span>dra
      </div>

      {/* Scrollable Navigation Links */}
      <nav className="flex flex-col gap-1 mt-8 overflow-y-auto flex-grow">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.name === "Tree Management" && isTreeManagementActive());
          const hasChildren = item.children && item.children.length > 0;

          return (
            <div key={item.name} className="flex flex-col">
              {hasChildren ? (
                <>
                  {/* Tree Management with Dropdown */}
                  <button
                    onClick={() => {
                    navigate(item.path); // Navigate to /treemgt
                    toggleTreeManagement(); // Toggle dropdown
                  }}
                  className={`px-3 py-2 rounded hover:bg-green-100 transition text-left flex items-center justify-between ${
                  isActive
                  ? "bg-green-500 text-white font-semibold"
                  : "text-gray-700"
              }`}
                  >
                    <span>{item.name}</span>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-4 w-4 transition-transform ${
      isTreeManagementOpen ? "rotate-180" : ""
    }`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
</button>
                  
                  {/* Dropdown Content */}
                  {isTreeManagementOpen && (
                    <div className="ml-4 mt-1 flex flex-col gap-1 border-l-2 border-green-300 pl-2">
                      {item.children.map((child) => {
                        const isChildActive = location.pathname === child.path;
                        return (
                          <Link
                            key={child.name}
                            to={child.path}
                            className={`px-3 py-2 rounded hover:bg-green-50 transition ${
                              isChildActive
                                ? "bg-green-300 text-white font-semibold"
                                : "text-gray-600"
                            }`}
                          >
                            {child.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                /* Regular Menu Item */
                <Link
                  to={item.path}
                  className={`px-3 py-2 rounded hover:bg-green-100 transition ${
                    isActive
                      ? "bg-green-500 text-white font-semibold"
                      : "text-gray-700"
                  }`}
                >
                  {item.name}
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      {/* Fixed Profile and Logout Section at Bottom */}
      <div className="mt-auto pb-4 border-t pt-4 bg-white sticky bottom-0">
        <div className="flex items-center gap-3 mb-3">
          {/* Profile Image */}
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
            {user?.photoUrl ? (
              <img
                src={user.photoUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-600 text-lg font-semibold">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </span>
            )}
          </div>

          {/* User Name */}
          <div>
            <p className="font-medium text-gray-800">
              {`${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
                "User"}
            </p>
            <p className="text-xs text-gray-500">{user?.role || "Admin"}</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full px-3 py-2 text-left rounded hover:bg-gray-100 text-gray-700 flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default SidePanel;