// path: src/component/TreeMgt/AddTreeModal.jsx
import React, { useState, useEffect } from "react";
import { X, User, ChevronDown } from "lucide-react";
import { treeService } from "../../services/treeService";
import { useNavigate } from "react-router-dom";

const AddTreeModal = ({ isOpen, onClose, onSave }) => {
  const navigate = useNavigate();
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

  // Set plantedDate to current date when modal opens
  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        plantedDate: formattedDate
      }));
      
      // Load investors when modal opens
      fetchInvestors();
    }
  }, [isOpen]);

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

  const handleNavigateToInvestors = () => {
    // Close the modal first
    onClose();
    // Then navigate to the investor management page
    setTimeout(() => {
      navigate('/investors');
    }, 100);
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

  // Filter active investors
  const activeInvestors = investors.filter(investor => 
    investor.status === 'active'
  );

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
                        ) : activeInvestors.length === 0 ? (
                          <div className="p-4 text-center">
                            <p className="text-gray-500 mb-2">No active investors found</p>
                            <button
                              type="button"
                              onClick={handleNavigateToInvestors}
                              className="text-green-600 hover:text-green-700 text-sm font-medium"
                            >
                              Go to Investor Management
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="px-3 py-2 border-b">
                              <p className="text-xs text-gray-500 font-medium">
                                {activeInvestors.length} active investor{activeInvestors.length !== 1 ? 's' : ''} available
                              </p>
                            </div>
                            {activeInvestors.map((investor) => (
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
                            <div className="p-2 border-t mt-2">
                              <button
                                type="button"
                                onClick={handleNavigateToInvestors}
                                className="w-full text-left p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors flex items-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Go to Investor Management to create new investor
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Quick Investor Management Link */}
              <div className="mt-2">
                <button
                  type="button"
                  onClick={handleNavigateToInvestors}
                  className="text-sm text-green-600 hover:text-green-700 font-medium inline-flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Manage Investors
                </button>
              </div>
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