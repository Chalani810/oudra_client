import React, { useState, useEffect } from "react";
import { FiSearch, FiShoppingCart, FiUser, FiLogOut } from "react-icons/fi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import authEvents from "../utils/authEvents";

const Header = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }

    const handleLogin = (userData) => {
      setIsLoggedIn(true);
      setUser(userData);
    };

    authEvents.on("login", handleLogin);

    return () => {
      authEvents.off("login", handleLogin);
    };
  }, []);

  // Helper function to check if a path is active
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  const toggleProfileMenu = () => {
    setShowProfileMenu((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setShowProfileMenu(false);
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm py-4 px-8 flex items-center justify-between relative">
      {/* Left: Logo */}
      <div className="text-2xl font-extrabold">
        <span className="text-black">Gli</span>
        <span className="text-red-600">mm</span>
        <span className="text-black">er</span>
      </div>

      {/* Center: Navigation */}
      <nav className="space-x-8 font-semibold hidden md:flex">
        <Link
          to="/"
          className={`text-black hover:text-red-600 ${
            isActive("/") ? "text-red-600" : ""
          }`}
        >
          Home
        </Link>
        <Link
          to="/customerviewevent"
          className={`text-black hover:text-red-600 ${
            isActive("/customerviewevent") ? "text-red-600" : ""
          }`}
        >
          Events
        </Link>
        {isLoggedIn && (
          <Link
            to={`/orders/${user._id}`}
            className={`text-black hover:text-red-600 ${
              isActive(`/orders/${user._id}`) ? "text-red-600" : ""
            }`}
          >
            Order History
          </Link>
        )}
        <Link
          to="/AboutUs"
          className={`text-black hover:text-red-600 ${
            isActive("/AboutUs") ? "text-red-600" : ""
          }`}
        >
          About Us
        </Link>
        <Link
          to="/contactUs"
          className={`text-black hover:text-red-600 ${
            isActive("/contactUs") ? "text-red-600" : ""
          }`}
        >
          Contact Us
        </Link>
      </nav>

        <div className="flex items-center space-x-4">

        {/* Cart Icon */}
        <div className="relative">
          <Link to="/cart">
            <FiShoppingCart className="text-2xl" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-600 rounded-full"></span>
          </Link>
        </div>

        {/* Conditional rendering based on login status */}
        {!isLoggedIn ? (
          <>
            <Link to="/signup">
              <button className="bg-white px-4 py-1 rounded-full shadow text-sm font-medium hover:shadow-md">
                Sign Up
              </button>
            </Link>
            <Link to="/signin">
              <button className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-red-700">
                Sign In
              </button>
            </Link>
          </>
        ) : (
          <div className="relative">
            <button
              onClick={toggleProfileMenu}
              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
            >
              {user?.photoUrl ? (
                <img
                  src={user.photoUrl}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <FiUser className="text-gray-600" />
              )}
            </button>

            {/* Profile dropdown menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <Link
                  to="/customerprofile"
                  className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                    isActive("/customerprofile") ? "text-red-600" : ""
                  }`}
                  onClick={() => setShowProfileMenu(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <FiLogOut className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
