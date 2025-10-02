// Side Panel
import React from "react";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white p-4 border-r hidden md:block">
      {/* Logo */}
      <div className="text-2xl font-extrabold text-black">
        <span className="text-red-500">Glim</span>mer
      </div>
      
      {/* Navigation Links */}
      <nav className="mt-6 flex flex-col gap-2 text-sm">
  {["Home", "Calendar", "All Products", "Bills", "Events", "Customers", "Employees", "Employee Payroll", "Settings"].map((item) => (
    <a
      key={item}
      href="#"
      className={`px-3 py-2 rounded hover:bg-red-100 ${
        item === "Customers" ? "bg-red-400 text-white" : "text-gray-700"
      }`}
    >
      {item}
    </a>
  ))}
</nav>

    </aside>
  );
};

export default Sidebar;
