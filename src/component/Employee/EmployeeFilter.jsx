import React, { useState } from 'react';

const EmployeeFilter = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Search"
      className="border rounded-md p-2 w-64"
      value={searchTerm}
      onChange={handleChange}
    />
  );
};

export default EmployeeFilter;
