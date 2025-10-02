// Navbar.jsx
import React from "react";

const Navbar = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-white border-b">
      <div></div> {/* Placeholder if needed */}
      <div className="flex items-center gap-4">
        <button>🔔</button>
        
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div> {/* User avatar */}
      </div>
    </header>
  );
};

export default Navbar;
