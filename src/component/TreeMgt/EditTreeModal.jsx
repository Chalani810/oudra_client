// path: oudra-client/src/component/TreeMgt/EditTreeModal.jsx
import React, { useState, useEffect } from "react";
import { X, AlertCircle, User, ChevronDown } from "lucide-react";
import { treeService } from "../../services/treeService";

const EditTreeModal = ({ isOpen, onClose, tree, onSave }) => {
  const [formData, setFormData] = useState({
    investorId: "",
    investorName: "",
    block: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [investors, setInvestors] = useState([]);
  const [isLoadingInvestors, setIsLoadingInvestors] = useState(false);
  const [showInvestorDropdown, setShowInvestorDropdown] = useState(false);

  // Initialize form with tree data and load investors
  useEffect(() => {
    if (tree && isOpen) {
      setFormData({
        investorId: tree.investorId || "",
        investorName: tree.investorName || "",
        block: tree.block || "",
      });
      
      fetchInvestors();
    }
  }, [tree, isOpen]);

  const fetchInvestors = async () => {
    try {
      setIsLoadingInvestors(true);
      const response = await fetch('http://localhost:5000/api/investors');
      const data = await response.json();
      
      if (data.success) {
        setInvestors(data.data || []);
      } else {
        console.error('Failed to load investors:', data.error);
      }
    } catch (error) {
      console.error('Error fetching investors:', error);
    } finally {
      setIsLoadingInvestors(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInvestorSelect = (investor) => {
    setFormData(prev => ({
      ...prev,
      investorId: investor.investorId || investor._id,
      investorName: investor.name
    }));
    setShowInvestorDropdown(false);
  };

  const handleClearInvestor = () => {
    setFormData(prev => ({
      ...prev,
      investorId: "",
      investorName: ""
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

  const filteredInvestors = investors.filter(investor => 
    investor.status === 'active'
  );

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

            {/* Investor Selection - Optional */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign to Investor (Optional)
              </label>
              
              {/* Selected Investor Display */}
              {formData.investorId ? (
                <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <User className="text-blue-600" size={18} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{formData.investorName}</p>
                        <p className="text-sm text-gray-600">ID: {formData.investorId}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearInvestor}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowInvestorDropdown(!showInvestorDropdown)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent flex items-center justify-between hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <User className="text-gray-400" size={18} />
                      <span className="text-gray-500">Select an investor (optional)</span>
                    </div>
                    <ChevronDown className={`text-gray-400 transition-transform ${showInvestorDropdown ? 'rotate-180' : ''}`} size={18} />
                  </button>

                  {/* Investor Dropdown */}
                  {showInvestorDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      <div className="p-2">
                        {isLoadingInvestors ? (
                          <div className="p-4 text-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
                            <p className="text-gray-500 text-sm mt-2">Loading investors...</p>
                          </div>
                        ) : filteredInvestors.length === 0 ? (
                          <div className="p-4 text-center">
                            <p className="text-gray-500">No active investors found</p>
                            <a
                              href="/investor-management"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-700 text-sm font-medium mt-2 inline-block"
                            >
                              Create new investor
                            </a>
                          </div>
                        ) : (
                          <>
                            <div className="px-3 py-2 border-b">
                              <p className="text-xs text-gray-500 font-medium">
                                {filteredInvestors.length} active investor{filteredInvestors.length !== 1 ? 's' : ''} available
                              </p>
                            </div>
                            {filteredInvestors.map((investor) => (
                              <button
                                key={investor._id}
                                type="button"
                                onClick={() => handleInvestorSelect(investor)}
                                className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3"
                              >
                                <div className="p-2 bg-gray-100 rounded-lg">
                                  <User className="text-gray-600" size={16} />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-gray-800">{investor.name}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                      {investor.investorId || investor._id.slice(-8).toUpperCase()}
                                    </span>
                                    {investor.investment && (
                                      <span className="text-xs text-gray-600">
                                        ${investor.investment.toLocaleString()}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Quick Add Investor Link */}
              <div className="mt-2">
                <a
                  href="/investor-management"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-green-600 hover:text-green-700 font-medium inline-flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create new investor
                </a>
              </div>
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