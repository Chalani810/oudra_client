import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const menuItems = [
    { name: "Prediction", path: "/dashboard" },
    { name: "Orders", path: "/admin-bills" },
    { name: "Events", path: "/adminEvents" },
    { name: "All Products", path: "/AdminProduct" },
    { name: "Customers", path: "/customers" },
    { name: "Employees", path: "/EmployeeManagement" },
    { name: "Employee Payroll", path: "/employee-payroll" },
    { name: "Settings", path: "/settings" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/signin");
  };

  return (
    <aside className="w-64 bg-white p-4 border-r fixed h-full flex flex-col">
      {/* Logo */}
      <div className="text-2xl font-extrabold text-black">
        <span className="text-red-500">Glim</span>mer
      </div>

      {/* Scrollable Navigation Links */}
      <nav className="flex flex-col gap-2 mt-8 overflow-y-auto flex-grow">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`px-3 py-2 rounded hover:bg-red-100 transition ${
                isActive
                  ? "bg-red-400 text-white font-semibold"
                  : "text-gray-700"
              }`}
            >
              {item.name}
            </Link>
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

export default Sidebar;