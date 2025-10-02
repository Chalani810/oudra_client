import React, { useState, useEffect } from 'react';
import profilePlaceholder from '../../assets/profile_placeholder.jpg';
const AddEmployeeModel = ({ isOpen, onClose, onSave, employeeData, occupationOptions }) => {
  const [employee, setEmployee] = useState({
    name: '',
    email: '',
    phone: '',
    occupation: '',
    profileImg: '',
  });
  const [previewImage, setPreviewImage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (employeeData) {
      setEmployee({
        name: employeeData.name || '',
        email: employeeData.email || '',
        phone: employeeData.phone || '',
        occupation: employeeData.occupation || '',
        profileImg: employeeData.profileImg || '',
      });
      setPreviewImage(employeeData.profileImg || '');
    } else {
      setEmployee({
        name: '',
        email: '',
        phone: '',
        occupation: '',
        profileImg: '',
      });
      setPreviewImage('');
    }

  }, [employeeData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEmployee({ ...employee, file });
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, phone, occupation } = employee;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!name || !email || !phone || !occupation) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!phoneRegex.test(phone)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }
  
    setError('');
    onSave(employee);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-[400px] relative shadow-xl">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col items-center space-y-4">
            <label className="relative">
              <img
                src={previewImage || profilePlaceholder}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
              <input
                type="file"
                name="profileImg"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleImageChange}
              />
            </label>

            <input
              name="name"
              value={employee.name}
              onChange={handleChange}
              placeholder="Name"
              className="border p-2 w-full rounded"
              required
            />
            <input
              name="email"
              value={employee.email}
              onChange={handleChange}
              placeholder="Email"
              className="border p-2 w-full rounded"
              type="email"
              required
            />
            <input
              name="phone"
              value={employee.phone}
              onChange={handleChange}
              placeholder="Phone number"
              className="border p-2 w-full rounded"
              required
            />

            <select
              name="occupation"
              value={employee.occupation?._id}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            >
              <option value="">Select Occupation</option>
              {occupationOptions?.map((option) => (
                <option key={option._id} value={option._id}>
                  {option.title}
                </option>
              ))}
            </select>

            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>

          <div className="flex justify-end mt-6 space-x-2">
            <button 
              type="button"
              onClick={onClose}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded"
            >
              {employeeData ? 'Save' : 'Add user'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModel;