import React, { useState } from "react";
import { Bell, Search, Filter } from "lucide-react";

const ResinTopbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchQuery('');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Add your search logic here
    }
  };

  const handleNotificationClick = () => {
    console.log('Notification clicked');
    // Add your notification logic here
  };

  const handleFilterClick = () => {
    console.log('Filter clicked');
    // Add your filter logic here
  };

  return (
    <div className="flex items-center justify-between bg-white px-6 py-4 shadow-sm border-b border-gray-200">
      {/* Left Section - Title */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">Resin Analysis & AI Insights</h2>
        <p className="text-sm text-gray-600 mt-1">
          Monitor and analyze resin productivity across new generations
        </p>
      </div>

      {/* Right Section - Search, Filters, Notifications */}
      <div className="flex items-center space-x-4">
        {/* Search - Toggleable */}
        <div className="flex items-center space-x-2">
          {!isSearchOpen && (
            <button
              onClick={handleSearchToggle}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-gray-600" />
            </button>
          )}
          
          {isSearchOpen && (
            <form onSubmit={handleSearchSubmit} className="flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search trees, analytics, resin scores..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 w-64"
                  autoFocus
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                
                {/* Close Search Button */}
                <button
                  type="button"
                  onClick={handleSearchToggle}
                  className="absolute right-3 top-2.5"
                >
                  <span className="text-gray-500 hover:text-gray-700 text-lg">×</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Filters Button - Now with Icon */}
        <button 
          onClick={handleFilterClick}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          aria-label="Filters"
        >
          <Filter className="h-5 w-5 text-gray-600" />
        </button>

        {/* Notifications */}
        <button 
          onClick={handleNotificationClick}
          className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            3
          </span>
        </button>
      </div>
    </div>
  );
};

export default ResinTopbar;