// src/component/NotificationPopup.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NotificationPopup = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  var BASE_url = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${BASE_url}/api/resin-notifications/unread`);
      setNotifications(response.data.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
      const intervalId = setInterval(fetchNotifications, 5000);
      return () => clearInterval(intervalId);
    }
  }, [isOpen]);

  const markAsRead = async (id) => {
    try {
      setNotifications(notifications.filter(notif => notif._id !== id));
      await axios.patch(`${BASE_url}/api/resin-notifications/${id}/read`);
    } catch (error) {
      console.error("Error marking as read:", error);
      fetchNotifications();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop to close when clicking outside */}
      <div className="fixed inset-0 z-40" onClick={onClose}></div>

      {/* Popup Container */}
      <div className="absolute left-16 top-10 w-100 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-slate-800"> Alerts</h3>
          <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
            {notifications.length} New
          </span>
        </div>

        {/* Scrollable List */}
        <div className="max-h-[400px] overflow-y-auto">
          {loading ? (
            <div className="p-10 text-center text-gray-400">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-gray-500 text-sm">No new alerts ✨</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div key={notif._id} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-bold text-gray-900">{notif.title}</h4>
                  <span className="text-[10px] text-gray-400">
                    {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2 mb-3">{notif.message}</p>
                
                <div className="flex items-center justify-between">
                   <div className="flex gap-2">
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                        {(notif.resinScore * 100).toFixed(0)}%
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        notif.riskLevel === 'High' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                      }`}>
                        {notif.riskLevel}
                      </span>
                   </div>
                   <button 
                    onClick={() => markAsRead(notif._id)}
                    className="text-[10px] font-semibold text-slate-500 hover:text-green-600"
                   >
                     Mark as Read
                   </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </>
  );
};

export default NotificationPopup;