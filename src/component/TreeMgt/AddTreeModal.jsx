// path: src/component/TreeMgt/AddTreeModal.jsx
import React, { useState, useEffect } from "react";
import { X, ShieldCheck } from "lucide-react"; // Added ShieldCheck icon
import { treeService } from "../../services/treeService";

const AddTreeModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    investorId: "",
    investorName: "",
    block: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.block.trim()) newErrors.block = "Block is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const submitData = {
          ...formData,
          healthStatus: "Healthy",
          lifecycleStatus: "Growing",
          inoculationCount: 0,
          blockchainStatus: "Pending", // Set initial status for Polygon Sync
          gps: { lat: 0, lng: 0 },
          lastUpdatedBy: "web-admin"
        };

        await treeService.createTree(submitData);
        onSave();
        handleClose();
      } catch (error) {
        console.error('Error creating tree:', error);
        alert('Failed to create tree.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    setFormData({ investorId: "", investorName: "", block: "" });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-800">Register New Tree</h2>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Block *</label>
              <select
                name="block"
                value={formData.block}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Select Block</option>
                {['A', 'B', 'C', 'D', 'E', 'F'].map(b => (
                  <option key={b} value={`Block-${b}`}>Block {b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Investor ID</label>
              <input
                type="text"
                name="investorId"
                value={formData.investorId}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="INV-000"
              />
            </div>

            {/* Blockchain Notice */}
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex gap-3">
              <ShieldCheck className="text-blue-600 shrink-0" size={20} />
              <div>
                <p className="text-xs font-semibold text-blue-800 uppercase tracking-wider">Blockchain Integration</p>
                <p className="text-xs text-blue-600 mt-1">
                  Once registered, this tree will be queued for the next Polygon Network synchronization cycle.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={handleClose} className="px-6 py-2 text-gray-600 border rounded-lg">Cancel</button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              {isSubmitting ? "Processing..." : "Register Tree"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTreeModal;