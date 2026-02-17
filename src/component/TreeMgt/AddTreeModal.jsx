//path: src/component/TreeMgt/AddTreeModal.jsx
import React, { useState, useEffect } from "react";
import { X, Calendar } from "lucide-react";
import { treeService } from "../../services/treeService";

const AddTreeModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    investorId: "",
    investorName: "",
    block: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set plantedDate to current date when modal opens
  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        plantedDate: formattedDate
      }));
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!formData.block.trim()) newErrors.block = "Block is required";
    
    // Block validation
    if (formData.block && !/^Block-[A-F]$/.test(formData.block)) {
      newErrors.block = "Block must be in format Block-A through Block-F";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        // Prepare the data for API call with default values
        const submitData = {
          ...formData,
          // Default values as per requirements
          healthStatus: "Healthy", // Always healthy when planted
          lifecycleStatus: "Growing", // Always growing when planted
          inoculationCount: 0, // Always 0 when planted
          readyForInoculation: false,
          readyForHarvest: false,
          nfcTagId: null, // No NFC assigned yet
          gps: { lat: 0, lng: 0 }, // Default GPS
          lastInspection: null,
          inspectedBy: null,
          offlineUpdated: false,
          lastUpdatedBy: "web-admin"
        };

        await treeService.createTree(submitData);
        onSave();
        
        // Reset form after successful submission
        setFormData({
          investorId: "",
          investorName: "",
          block: ""
        });
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
      investorId: "",
      investorName: "",
      block: ""
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-800">Add a New Tree</h2>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            
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

            {/* Auto-generated Info */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h3 className="text-sm font-medium text-gray-700">Other Information</h3>
              <div className="text-sm text-gray-600">
                <p><strong>Planted Date:</strong> {formData.plantedDate}</p>
                <p><strong>Initial Age:</strong> 0 years 0 months</p>
                <p><strong>Health Status:</strong> Healthy</p>
                <p><strong>Lifecycle Status:</strong> Growing</p>
                <p><strong>Inoculation Count:</strong> 0</p>
                <p><strong>NFC Tag:</strong> Not assigned yet</p>
                <p><strong>GPS:</strong> Not captured yet</p>
              </div>
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
              {isSubmitting ? "Creating..." : "Register Tree"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTreeModal;