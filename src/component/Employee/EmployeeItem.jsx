import React from 'react';

const EmployeeItem = ({ employee }) => {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-4 flex items-center gap-3">
        <img
          src={employee.imageUrl} // 👈 Corrected from avatar ➔ imageUrl
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <div className="font-semibold">{employee.name}</div>
          <div className="text-sm text-gray-500">{employee.email}</div>
        </div>
      </td>
      <td className="p-4">{employee.userId}</td>
      <td className="p-4">{employee.email}</td>
      <td className="p-4">{employee.dateAdded}</td>
      <td className="p-4 text-right">
        <button className="text-gray-600 hover:text-gray-900">
          ⋮
        </button>
      </td>
    </tr>
  );
};

export default EmployeeItem;


