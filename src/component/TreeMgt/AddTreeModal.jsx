//path: src/component/TreeMgt/AddTreeModal.jsx

import React, { useState, useEffect } from "react";
import { X, Calendar } from "lucide-react";
import { treeService } from "../../services/treeService";

const AddTreeModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nfcTagId: "",
    plantedDate: "",
    investorId: "",
    investorName: "",
    block: "",
    gps: { lat: "", lng: "" },
    healthStatus: "Healthy",
    lifecycleStatus: "Growing",
    inoculationCount: 0
  });

  const [errors, setErrors] = useState({});
  const [calculatedAge, setCalculatedAge] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate age when planted date changes
  useEffect(() => {
    if (formData.plantedDate) {
      const age = calculateAge(formData.plantedDate);
      setCalculatedAge(age);
    } else {
      setCalculatedAge("");
    }
  }, [formData.plantedDate]);

  const calculateAge = (plantedDate) => {
    const planted = new Date(plantedDate);
    const now = new Date();
    
    let years = now.getFullYear() - planted.getFullYear();
    let months = now.getMonth() - planted.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    if (months === 0 && now.getDate() < planted.getDate()) {
      years--;
      months = 11;
    } else if (now.getDate() < planted.getDate()) {
      months--;
    }
    
    return `${years} years ${months} months`;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (name === 'lat' || name === 'lng') {
      setFormData(prev => ({
        ...prev,
        gps: {
          ...prev.gps,
          [name]: value ? parseFloat(value) : ""
        }
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value ? parseInt(value) : 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!formData.nfcTagId.trim()) newErrors.nfcTagId = "NFC Tag ID is required";
    if (!formData.block.trim()) newErrors.block = "Block is required";
    if (!formData.plantedDate) newErrors.plantedDate = "Planted date is required";
    
    // GPS validation (optional but if provided, must be valid)
    if (formData.gps.lat && isNaN(formData.gps.lat)) newErrors.gps = "Latitude must be a number";
    if (formData.gps.lng && isNaN(formData.gps.lng)) newErrors.gps = "Longitude must be a number";
    
    // Date validation
    if (formData.plantedDate) {
      const planted = new Date(formData.plantedDate);
      const today = new Date();
      if (planted > today) newErrors.plantedDate = "Planted date cannot be in the future";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        // Prepare the data for API call
        const submitData = {
        ...formData,
        gps: formData.gps.lat && formData.gps.lng 
          ? { lat: parseFloat(formData.gps.lat), lng: parseFloat(formData.gps.lng) }
          : { lat: 0, lng: 0 },
        investorId: formData.investorId || null,
        investorName: formData.investorName || null,
        lastInspection: null,
        inspectedBy: null,
        readyForInoculation: false, // Set based on business logic
        readyForHarvest: false, // Set based on business logic
        offlineUpdated: false
      };

      await treeService.createTree(submitData);
      onSave();
        
        // Reset form after successful submission
        setFormData({
        nfcTagId: "",
        plantedDate: "",
        investorId: "",
        investorName: "",
        block: "",
        gps: { lat: "", lng: "" },
        healthStatus: "Healthy",
        lifecycleStatus: "Growing",
        inoculationCount: 0
      });
      setCalculatedAge("");
      setErrors({});
    } catch (error) {
      console.error('Error creating tree:', error);
      alert('Failed to create tree. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }
};

  const handleClose = () => {
    setFormData({
      nfcTagId: "",
      plantedDate: "",
      investorId: "",
      investorName: "",
      block: "",
      gps: { lat: "", lng: "" },
      healthStatus: "Healthy",
      lifecycleStatus: "Growing",
      inoculationCount: 0
    });
    setCalculatedAge("");
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-800">Add New Tree</h2>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* NFC Tag ID - Required */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NFC Tag ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nfcTagId"
                value={formData.nfcTagId}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter NFC Tag ID (e.g., NFC-123456)"
                required
              />
              {errors.nfcTagId && (
                <p className="text-red-500 text-xs mt-1">{errors.nfcTagId}</p>
              )}
            </div>

            {/* Planted Date - Required */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Planted Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="plantedDate"
                  value={formData.plantedDate}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
              {errors.plantedDate && (
                <p className="text-red-500 text-xs mt-1">{errors.plantedDate}</p>
              )}
            </div>

            {/* Calculated Age - Readonly */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calculated Age
              </label>
              <input
                type="text"
                value={calculatedAge}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                placeholder="Age will be calculated automatically"
              />
            </div>

            {/* Block - Required */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Block <span className="text-red-500">*</span>
              </label>
              <select
                name="block"
                value={formData.block}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="">Select Block</option>
                <option value="Block-A">Block A</option>
                <option value="Block-B">Block B</option>
                <option value="Block-C">Block C</option>
                <option value="Block-D">Block D</option>
                <option value="Block-E">Block E</option>
                <option value="Block-F">Block F</option>
              </select>
              {errors.block && (
                <p className="text-red-500 text-xs mt-1">{errors.block}</p>
              )}
            </div>

            {/* Lifecycle Status - Required with default */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lifecycle Status <span className="text-red-500">*</span>
              </label>
              <select
                name="lifecycleStatus"
                value={formData.lifecycleStatus}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="Growing">Growing</option>
                <option value="Ready for 1st Inoculation">Ready for 1st Inoculation</option>
                <option value="Inoculated Once">Inoculated Once</option>
                <option value="Ready for 2nd Inoculation">Ready for 2nd Inoculation</option>
                <option value="Inoculated Twice">Inoculated Twice</option>
                <option value="Ready for Harvest">Ready for Harvest</option>
                <option value="Harvested">Harvested</option>
              </select>
            </div>

            {/* Health Status - Required with default */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Health Status <span className="text-red-500">*</span>
              </label>
              <select
                name="healthStatus"
                value={formData.healthStatus}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="Healthy">Healthy</option>
                <option value="Warning">Warning</option>
                <option value="Damaged">Damaged</option>
                <option value="Dead">Dead</option>
              </select>
            </div>

            {/* OPTIONAL FIELDS */}

            {/* Investor ID - Optional */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Investor ID
              </label>
              <input
                type="text"
                name="investorId"
                value={formData.investorId}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Optional (e.g., INV-001)"
              />
            </div>

            {/* Investor Name - Optional */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Investor Name
              </label>
              <input
                type="text"
                name="investorName"
                value={formData.investorName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Optional"
              />
            </div>

            {/* GPS Coordinates - Optional */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GPS Coordinates (Optional)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    step="any"
                    name="lat"
                    value={formData.gps.lat}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Latitude (e.g., 6.9271)"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    step="any"
                    name="lng"
                    value={formData.gps.lng}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Longitude (e.g., 79.8612)"
                  />
                </div>
              </div>
              {errors.gps && (
                <p className="text-red-500 text-xs mt-1">{errors.gps}</p>
              )}
            </div>

            {/* Inoculation Count - Required with default */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Inoculation Count <span className="text-red-500">*</span>
              </label>
              <select
                name="inoculationCount"
                value={formData.inoculationCount}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value={0}>0</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
              </select>
            </div>

            {/* System Fields Info */}
            <div className="md:col-span-2 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">System-Generated Fields</h3>
              <p className="text-sm text-blue-600">
                The following fields will be automatically generated by the system:
              </p>
              <ul className="text-sm text-blue-600 mt-1 list-disc list-inside">
                <li><strong>Tree ID:</strong> Auto-generated (T-000001, T-000002, etc.)</li>
                <li><strong>Last Updated At:</strong> Current timestamp</li>
                <li><strong>Last Updated By:</strong> Your user account</li>
                <li><strong>Is Archived:</strong> False (default)</li>
                <li><strong>Updated At:</strong> Current timestamp</li>
              </ul>
            </div>

          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Tree"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTreeModal;