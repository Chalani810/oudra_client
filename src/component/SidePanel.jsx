// src/component/SidePanel.js
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const SidePanel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  
  // --- Notification Logic ---
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const popupRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/resin-notifications/unread');
      setNotifications(response.data.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 5000);
    
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsPopupOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      clearInterval(intervalId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const markAsRead = async (id, e) => {
    e.preventDefault();
    try {
      setNotifications(notifications.filter(notif => notif._id !== id));
      await axios.patch(`http://localhost:5000/api/resin-notifications/${id}/read`);
    } catch (error) {
      console.error("Error marking as read:", error);
      fetchNotifications();
    }
  };

  // --- UI State Logic ---
  const [isTreeManagementOpen, setIsTreeManagementOpen] = useState(
    location.pathname.startsWith("/iot-sensor-data") ||
    location.pathname.startsWith("/resin-analysis-table") ||
    location.pathname === "/treemgt"
  );

  const menuItems = [
    { name: "Dashboard", path: "/admindashboard" },
    { 
      name: "Tree Management", 
      path: "/treemgt",
      children: [
        { name: "IoT Sensor Data", path: "/iot-sensor-data" },
        { name: "Resin Analysis & AI Insights", path: "/resin-analysis-table" }
      ]
    },
    { name: "Tasks & Workforce", path: "/taskmgt" },
    { name: "Investments", path: "/investor-management" },
    { name: "Employees", path: "/employee-mgt" },
    { name: "Investors", path: "/admin/manage-investor-logins" },
    { name: "Settings", path: "" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/signin");
  };

  const isTreeManagementActive = () => {
    return menuItems
      .find(item => item.name === "Tree Management")
      ?.children?.some(child => child.path === location.pathname) || false;
  };

  return (
    <aside className="w-64 bg-white p-4 border-r fixed h-full flex flex-col z-20">
      {/* Logo and Notification Icon */}
      <div className="flex items-center justify-between mb-8 relative" ref={popupRef}>
        <div className="text-2xl font-extrabold text-black">
          <span className="text-green-600">Ou</span>dra
        </div>
        
        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setIsPopupOpen(!isPopupOpen)}
            className={`p-2 rounded-full transition-colors relative ${
              notifications.length > 0 ? "text-red-500" : "text-gray-500"
            } hover:bg-gray-100`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {notifications.length > 0 && (
              <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-red-600 ring-2 ring-white animate-pulse"></span>
            )}
          </button>

          {/* Popup Dropdown with Green Border */}
          {isPopupOpen && (
            <div className="absolute left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border-2 border-green-500 z-50 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-left">
              {/* Header with light green tint */}
              <div className="p-4 border-b border-green-100 bg-green-50 flex justify-between items-center">
                <h3 className="font-bold text-green-900 text-sm">Alerts</h3>
                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {notifications.length} Unread
                </span>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm">
                    No new alerts at this time.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div key={notif._id} className="p-4 border-b border-gray-50 hover:bg-green-50 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-gray-900 text-xs">{notif.title}</h4>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600 mb-3 line-clamp-2">{notif.message}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <span className="text-[9px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                            {(notif.resinScore).toFixed(0)}% Score
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            notif.riskLevel === 'High' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {notif.riskLevel} Risk
                          </span>
                        </div>
                        <button 
                          onClick={(e) => markAsRead(notif._id, e)}
                          className="text-[10px] font-bold text-slate-500 hover:text-green-600 transition-colors"
                        >
                          Mark as Read ✓
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <nav className="flex flex-col gap-1 overflow-y-auto flex-grow">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.name === "Tree Management" && isTreeManagementActive());
          const hasChildren = item.children && item.children.length > 0;

          return (
            <div key={item.name} className="flex flex-col">
              {hasChildren ? (
                <>
                  <button
                    onClick={() => {
                      if (item.path) navigate(item.path);
                      setIsTreeManagementOpen(!isTreeManagementOpen);
                    }}
                    className={`px-3 py-2 rounded hover:bg-green-100 transition text-left flex items-center justify-between ${
                      isActive ? "bg-green-500 text-white font-semibold" : "text-gray-700"
                    }`}
                  >
                    <span>{item.name}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 transition-transform ${isTreeManagementOpen ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isTreeManagementOpen && (
                    <div className="ml-4 mt-1 flex flex-col gap-1 border-l-2 border-green-300 pl-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          to={child.path}
                          className={`px-3 py-2 rounded hover:bg-green-50 transition ${
                            location.pathname === child.path ? "bg-green-300 text-white font-semibold" : "text-gray-600"
                          }`}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  className={`px-3 py-2 rounded hover:bg-green-100 transition ${
                    isActive ? "bg-green-500 text-white font-semibold" : "text-gray-700"
                  }`}
                >
                  {item.name}
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      <div className="mt-auto pb-4 border-t pt-4 bg-white sticky bottom-0">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
            {user?.photoUrl ? (
              <img src={user.photoUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-600 text-lg font-semibold">
                {user?.firstName?.charAt(0).toUpperCase() || "U"}
              </span>
            )}
          </div>
          <div>
            <p className="font-medium text-gray-800 text-sm leading-tight">
              {`${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "User"}
            </p>
            <p className="text-xs text-gray-500">{user?.role || "Admin"}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full px-3 py-2 text-left rounded hover:bg-gray-100 text-gray-700 transition flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default SidePanel;