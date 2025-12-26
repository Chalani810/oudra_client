// oudra-client/src/components/EmployeeMgt/AddEmployeeModal.jsx
import React, { useState } from "react";
import { X, Plus } from "lucide-react";

const AddEmployeeModal = ({ isOpen, onClose, onSave }) => {
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    profileImg: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};
    
    if (!employee.name.trim()) newErrors.name = "Name is required";
    if (!employee.email.trim()) newErrors.email = "Email is required";
    if (!employee.phone.trim()) newErrors.phone = "Phone is required";
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (employee.email && !emailRegex.test(employee.email)) {
      newErrors.email = "Invalid email format";
    }
    
    // Phone validation (Sri Lankan format)
    const phoneRegex = /^\+94\d{9}$/;
    if (employee.phone && !phoneRegex.test(employee.phone)) {
      newErrors.phone = "Format: +94XXXXXXXXX (12 digits)";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEmployee(prev => ({ ...prev, profileImg: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    onSave(employee);
    resetForm();
  };

  const resetForm = () => {
    setEmployee({
      name: "",
      email: "",
      phone: "",
      profileImg: null,
    });
    setPreviewImage(null);
    setErrors({});
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Add New Field Worker</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              <img
                src={previewImage || "https://via.placeholder.com/128"}
                alt="Profile preview"
                className="w-full h-full rounded-full object-cover border-4 border-gray-200"
              />
              <label className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full cursor-pointer hover:bg-green-700">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Plus size={20} />
              </label>
            </div>
            <p className="text-sm text-gray-500">Click camera icon to upload photo</p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={employee.name}
              onChange={handleChange}
              className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="John Doe"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={employee.email}
              onChange={handleChange}
              className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="worker@agarwood.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={employee.phone}
              onChange={handleChange}
              className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="+94712345678"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          {/* Note about field worker */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This will create a field worker record. 
              A login account can be created for this worker later from the user management section.
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Add Field Worker
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;