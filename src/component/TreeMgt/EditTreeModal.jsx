//path:oudra-client/src/component/TreeMgt/EditTreeModal.jsx
import React, { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
import { treeService } from "../../services/treeService";

const EditTreeModal = ({ isOpen, onClose, tree, onSave }) => {
  const [formData, setFormData] = useState({
    investorId: "",
    investorName: "",
    block: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with tree data
  useEffect(() => {
    if (tree && isOpen) {
      setFormData({
        investorId: tree.investorId || "",
        investorName: tree.investorName || "",
        block: tree.block || "",
      });
    }
  }, [tree, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.block.trim()) {
      newErrors.block = "Block is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const updates = {
          ...formData,
          lastUpdatedBy: "web-admin"
        };

        await treeService.updateTree(tree.treeId, updates);
        onSave();
        onClose();
      } catch (error) {
        console.error('Error updating tree:', error);
        alert('Failed to update tree. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!isOpen || !tree) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-800">
            Edit Tree - {tree.treeId}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Current Tree Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Current Status</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>NFC Tag:</strong> {tree.nfcTagId || 'Not assigned yet'}</p>
              <p><strong>Health Status:</strong> {tree.healthStatus}</p>
              <p><strong>Lifecycle:</strong> {tree.lifecycleStatus}</p>
              <p><strong>GPS:</strong> {tree.gps.lat !== 0 ? `${tree.gps.lat.toFixed(6)}, ${tree.gps.lng.toFixed(6)}` : 'Not captured yet'}</p>
              <p><strong>Inoculation Count:</strong> {tree.inoculationCount}</p>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Note: Health status, lifecycle, GPS, and NFC assignment are managed by field workers via mobile app.
            </div>
          </div>

          {/* Manager Editable Fields */}
          <div className="space-y-4">
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
          </div>

          {/* NFC Information (Read-only) */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">NFC Tag Information</h3>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="text-yellow-600 mt-0.5 mr-2" size={18} />
                <div>
                  <p className="text-sm text-yellow-700">
                    NFC tag management is handled by field workers via mobile app.
                  </p>
                  <p className="text-sm text-yellow-600 mt-1">
                    Current NFC Tag: <span className="font-medium">{tree.nfcTagId || 'Not assigned yet'}</span>
                  </p>
                  <p className="text-xs text-yellow-500 mt-2">
                    Field workers will:
                    <ul className="list-disc list-inside ml-2 mt-1">
                      <li>Assign NFC tags to new trees</li>
                      <li>Replace damaged NFC tags</li>
                      <li>Update GPS coordinates</li>
                      <li>Monitor health and lifecycle status</li>
                    </ul>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTreeModal;