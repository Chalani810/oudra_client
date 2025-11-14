// Side Panel
import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ activeItem = "Customers" }) => {
  const navItems = [
    { name: "Home", path: "/admin" },
    { name: "Calendar", path: "/admin/calendar" },
    { name: "All Products", path: "/admin/products" },
    { name: "Orders", path: "/admin/bills" },
    { name: "Events", path: "/adminevents" },
    { name: "Customers", path: "/customers" },
    { name: "CertificateCard", path: "/admin/CertificateCard" },
    { name: "Employee Payroll", path: "/admin/payroll" },
    { name: "Settings", path: "/admin/settings" }
  ];

  return (
    <aside className="w-64 bg-white p-4 border-r hidden md:block">
      {/* Logo */}
      <div className="text-2xl font-extrabold text-black">
        <span className="text-green-500">Ou</span>dra
      </div>
      
      {/* Navigation Links */}
      <nav className="mt-6 flex flex-col gap-2 text-sm">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`px-3 py-2 rounded hover:bg-green-100 ${
              item.name === activeItem ? "bg-green-400 text-white" : "text-gray-700"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;