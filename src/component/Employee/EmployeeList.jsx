import React from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const EmployeeList = ({ employees, onEdit, onDelete }) => {

  return (
    <div className="space-y-4">
      {employees.map((employee) => (
        <div
          key={employee.id}
          className="border p-4 rounded-md shadow-sm flex justify-between items-center"
        >
          <div className="flex items-center gap-4">
            <img
              src={employee?.profileImg}
              alt={employee.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">{employee.name}</p>
              <p className="text-sm text-gray-500">{employee.email}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => onEdit(employee)} className="text-blue-500 hover:text-blue-700">
              <FiEdit2 size={18} />
            </button>
            <button onClick={() => onDelete(employee._id)} className="text-red-500 hover:text-red-700">
              <FiTrash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmployeeList;
