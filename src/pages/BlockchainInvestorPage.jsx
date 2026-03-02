import React, { useState, useEffect, useCallback } from 'react';

// API Configuration
const API_URL = 'http://localhost:5000/api';

const api = {
  investors: {
    getAll: () => fetch(`${API_URL}/investors`).then(r => r.json()),
    create: (data) => fetch(`${API_URL}/investors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),
    update: (id, data) => fetch(`${API_URL}/investors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),
    delete: (id) => fetch(`${API_URL}/investors/${id}`, {
      method: 'DELETE'
    }).then(r => r.json())
  },
  certificates: {
    generate: (data) => fetch(`${API_URL}/certificates/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),
    getByInvestor: (investorId) => fetch(`${API_URL}/certificates/investor/${investorId}`).then(r => r.json())
  },
  trees: {
    getAll: () => fetch(`${API_URL}/trees`).then(r => r.json()),
    getAvailable: () => fetch(`${API_URL}/trees/available`).then(r => r.json())
  }
};

// Icons
const PlusIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14m-7-7h14"/></svg>);
const EditIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>);
const DeleteIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>);
const XCircleIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6m0-6 6 6"/></svg>);
const AwardIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>);
const UsersIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
const TreeIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 7h18M3 17h18"/></svg>);
const ChevronDownIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>);
const CheckIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>);
const SearchIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>);

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XCircleIcon />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const Alert = ({ type, message, onClose }) => {
  const styles = {
    success: 'bg-green-50 border-green-500 text-green-800',
    error: 'bg-red-50 border-red-500 text-red-800'
  };

  return (
    <div className={`border-l-4 p-4 rounded-lg ${styles[type]} flex items-center justify-between mb-4 shadow`}>
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-4 text-2xl font-bold hover:opacity-70">×</button>
    </div>
  );
};

const TreeStatusBadge = ({ status }) => {
  const styles = {
    Healthy: 'bg-green-100 text-green-800',
    Warning: 'bg-yellow-100 text-yellow-800',
    Damaged: 'bg-red-100 text-red-800',
    Dead: 'bg-gray-800 text-white'
  };

  return (
    <span className={`px-2 py-1 text-xs rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};

const LifecycleBadge = ({ status }) => {
  const styles = {
    'Growing': 'bg-blue-100 text-blue-800',
    'Ready for 1st Inoculation': 'bg-purple-100 text-purple-800',
    'Inoculated Once': 'bg-indigo-100 text-indigo-800',
    'Ready for 2nd Inoculation': 'bg-purple-100 text-purple-800',
    'Inoculated Twice': 'bg-indigo-100 text-indigo-800',
    'Ready for Harvest': 'bg-orange-100 text-orange-800',
    'Harvested': 'bg-green-100 text-green-800'
  };

  return (
    <span className={`px-2 py-1 text-xs rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};

export default function InvestorCertificateManager() {
  const [investors, setInvestors] = useState([]);
  const [expandedInvestor, setExpandedInvestor] = useState(null);
  const [certificates, setCertificates] = useState({});
  const [trees, setTrees] = useState([]);
  const [availableTrees, setAvailableTrees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [editingInvestor, setEditingInvestor] = useState(null);
  const [selectedInvestor, setSelectedInvestor] = useState(null);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    investment: '',
    status: 'active',
    treeIds: []
  });
  const [certFormData, setCertFormData] = useState({
    treeIds: '',
    certificateType: 'INVESTOR_AUTH'
  });
  const [treeSearch, setTreeSearch] = useState('');
  const [selectedTreeIds, setSelectedTreeIds] = useState([]);

  const showAlert = useCallback((type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  }, []);

  const loadInvestors = useCallback(async () => {
    try {
      const response = await api.investors.getAll();
      if (response.success) {
        setInvestors(response.data || []);
      } else {
        showAlert('error', response.message || 'Failed to load investors');
      }
    } catch (error) {
      console.error('Load investors error:', error);
      showAlert('error', `Failed to connect to server: ${error.message}`);
    }
  }, [showAlert]);

  const loadTrees = async () => {
    try {
      const response = await api.trees.getAll();
      if (response.success || Array.isArray(response)) {
        const treesData = Array.isArray(response) ? response : response.data || response.trees || [];
        setTrees(treesData);
        
        // Load available trees
        const availableResponse = await api.trees.getAvailable();
        if (availableResponse.success || Array.isArray(availableResponse)) {
          const availableData = Array.isArray(availableResponse) ? availableResponse : availableResponse.data || availableResponse.trees || [];
          setAvailableTrees(availableData);
        }
      }
    } catch (error) {
      console.error('Failed to load trees:', error);
    }
  };

  const loadCertificates = async (investorId) => {
    try {
      const response = await api.certificates.getByInvestor(investorId);
      if (response.success) {
        setCertificates(prev => ({ ...prev, [investorId]: response.data || [] }));
      }
    } catch (error) {
      console.error('Failed to load certificates:', error);
      setCertificates(prev => ({ ...prev, [investorId]: [] }));
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await Promise.all([loadInvestors(), loadTrees()]);
      setLoading(false);
    };
    initializeData();
  }, [loadInvestors]);

  const handleSubmit = async () => {
    try {
      if (!formData.name || !formData.email || !formData.investment) {
        showAlert('error', 'Please fill in all required fields');
        return;
      }

      const investorData = {
        ...formData,
        investment: parseFloat(formData.investment),
        treeIds: selectedTreeIds
      };

      let response;
      if (editingInvestor) {
        response = await api.investors.update(editingInvestor._id, investorData);
      } else {
        response = await api.investors.create(investorData);
      }

      if (response.success) {
        showAlert('success', `Investor ${editingInvestor ? 'updated' : 'created'} successfully`);
        await loadInvestors();
        await loadTrees();
        closeModal();
      } else {
        showAlert('error', response.message || 'Operation failed');
      }
    } catch (error) {
      console.error(error);
      showAlert('error', error.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this investor?')) return;

    try {
      const response = await api.investors.delete(id);
      if (response.success) {
        showAlert('success', 'Investor deleted successfully');
        await loadInvestors();
        await loadTrees();
      } else {
        showAlert('error', response.message || 'Failed to delete investor');
      }
    } catch (error) {
      console.error(error);
      showAlert('error', 'Failed to delete investor');
    }
  };

  const openModal = (investor = null) => {
    if (investor) {
      setEditingInvestor(investor);
      setFormData({
        name: investor.name,
        email: investor.email,
        phone: investor.phone,
        investment: investor.investment.toString(),
        status: investor.status,
        treeIds: investor.treeIds || []
      });
      setSelectedTreeIds(investor.treeIds || []);
    } else {
      setEditingInvestor(null);
      setFormData({ name: '', email: '', phone: '', investment: '', status: 'active', treeIds: [] });
      setSelectedTreeIds([]);
    }
    setTreeSearch('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingInvestor(null);
    setFormData({ name: '', email: '', phone: '', investment: '', status: 'active', treeIds: [] });
    setSelectedTreeIds([]);
    setTreeSearch('');
  };

  const openCertModal = (investor) => {
    setSelectedInvestor(investor);
    setCertFormData({ treeIds: '', certificateType: 'INVESTOR_AUTH' });
    setIsCertModalOpen(true);
  };

  const closeCertModal = () => {
    setIsCertModalOpen(false);
    setSelectedInvestor(null);
    setCertFormData({ treeIds: '', certificateType: 'INVESTOR_AUTH' });
  };

  const generateCertificate = async () => {
    try {
      if (!selectedInvestor) {
        showAlert('error', 'Please select an investor');
        return;
      }

      const treeIds = certFormData.treeIds.split(',').map(id => id.trim()).filter(Boolean);

      const response = await api.certificates.generate({
        investorId: selectedInvestor._id,
        treeIds,
        certificateType: certFormData.certificateType
      });

      if (response.success) {
        showAlert('success', 'Certificate generated successfully');
        await loadCertificates(selectedInvestor._id);
        closeCertModal();
      } else {
        showAlert('error', response.message || 'Failed to generate certificate');
      }
    } catch (error) {
      console.error(error);
      showAlert('error', 'Failed to generate certificate');
    }
  };

  const toggleInvestor = async (investor) => {
    if (expandedInvestor === investor._id) {
      setExpandedInvestor(null);
    } else {
      setExpandedInvestor(investor._id);
      if (!certificates[investor._id]) {
        await loadCertificates(investor._id);
      }
    }
  };

  const toggleTreeSelection = (treeId) => {
    setSelectedTreeIds(prev => {
      if (prev.includes(treeId)) {
        return prev.filter(id => id !== treeId);
      } else {
        return [...prev, treeId];
      }
    });
  };

  const isTreeAvailable = (tree) => {
    // A tree is available if:
    // 1. It's not assigned to any investor, OR
    // 2. If we're editing an investor, it's assigned to this investor
    const isAssignedToOthers = investors.some(inv => 
      inv.treeIds?.includes(tree.treeId) && inv._id !== (editingInvestor?._id)
    );
    
    if (isAssignedToOthers) return false;
    
    // If we're editing an investor and this tree is already assigned to them, it's available
    if (editingInvestor && editingInvestor.treeIds?.includes(tree.treeId)) return true;
    
    // Otherwise check if it's in available trees list
    return availableTrees.some(available => available.treeId === tree.treeId);
  };

  const getInvestorTrees = (investor) => {
    return trees.filter(tree => investor.treeIds?.includes(tree.treeId));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return "Invalid Date";
    }
  };

  const calculateAge = (plantedDate) => {
    if (!plantedDate) return "N/A";
    
    try {
      const planted = new Date(plantedDate);
      const now = new Date();
      const diffTime = Math.abs(now - planted);
      const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
      const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
      
      return `${diffYears}Y ${diffMonths}M`;
    } catch (e) {
      return "N/A";
    }
  };

  const filteredTrees = trees.filter(tree => {
    if (!treeSearch) return true;
    
    const searchLower = treeSearch.toLowerCase();
    return (
      (tree.treeId && tree.treeId.toLowerCase().includes(searchLower)) ||
      (tree.block && tree.block.toLowerCase().includes(searchLower)) ||
      (tree.nfcTagId && tree.nfcTagId.toLowerCase().includes(searchLower))
    );
  });

  // Calculate total trees assigned
  const totalAssignedTrees = investors.reduce((total, investor) => {
    return total + (investor.treeIds?.length || 0);
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UsersIcon />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Investor Management</h1>
                <p className="text-gray-600 mt-1">Manage investors and their tree assignments</p>
              </div>
            </div>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
            >
              <PlusIcon />
              Add Investor
            </button>
          </div>
        </div>

        {/* Alerts */}
        {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <p className="text-sm text-gray-600 font-medium">Total Investors</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{investors.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <p className="text-sm text-gray-600 font-medium">Active Investors</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {investors.filter(inv => inv.status === 'active').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <p className="text-sm text-gray-600 font-medium">Total Investment</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              ${investors.reduce((sum, inv) => sum + (inv.investment || 0), 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-amber-500">
            <div className="flex items-center gap-2">
              <TreeIcon />
              <p className="text-sm text-gray-600 font-medium">Total Trees</p>
            </div>
            <p className="text-3xl font-bold text-amber-600 mt-2">{totalAssignedTrees}</p>
          </div>
        </div>

        {/* Investors List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">Investors & Their Trees</h2>
          </div>

          <div className="divide-y">
            {investors.map((investor) => {
              const investorTrees = getInvestorTrees(investor);
              const treeCount = investor.treeIds?.length || 0;
              
              return (
                <div key={investor._id}>
                  {/* Investor Row */}
                  <div className="p-6 hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">{investor.name}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            investor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {investor.status}
                          </span>
                          {treeCount > 0 && (
                            <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              <TreeIcon size={12} />
                              {treeCount} tree{treeCount !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                          <p><span className="font-medium">Email:</span> {investor.email}</p>
                          <p><span className="font-medium">Phone:</span> {investor.phone}</p>
                          <p><span className="font-medium">Investment:</span> ${investor.investment?.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openCertModal(investor)}
                          className="flex items-center gap-1 px-3 py-2 text-green-600 hover:bg-green-50 rounded transition"
                          title="Generate Certificate"
                        >
                          <AwardIcon />
                          <span className="text-sm">Generate Cert</span>
                        </button>
                        <button
                          onClick={() => openModal(investor)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                          title="Edit"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => handleDelete(investor._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                          title="Delete"
                        >
                          <DeleteIcon />
                        </button>
                        <button
                          onClick={() => toggleInvestor(investor)}
                          className={`p-2 text-gray-600 hover:bg-gray-100 rounded transition ${
                            expandedInvestor === investor._id ? 'transform rotate-180' : ''
                          }`}
                        >
                          <ChevronDownIcon />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded View - Trees & Certificates */}
                  {expandedInvestor === investor._id && (
                    <div className="bg-gray-50 p-6 border-t">
                      {/* Investor's Trees Section */}
                      {treeCount > 0 ? (
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <TreeIcon />
                            Assigned Trees ({treeCount})
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {investorTrees.map((tree) => (
                              <div key={tree.treeId} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow transition">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <p className="font-semibold text-gray-800 text-sm">{tree.treeId}</p>
                                    <p className="text-xs text-gray-500 mt-1">Block: {tree.block}</p>
                                  </div>
                                  {tree.nfcTagId && (
                                    <span className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs">
                                      {tree.nfcTagId}
                                    </span>
                                  )}
                                </div>
                                
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <TreeStatusBadge status={tree.healthStatus} />
                                    <LifecycleBadge status={tree.lifecycleStatus} />
                                  </div>
                                  
                                  <div className="text-xs text-gray-600 space-y-1">
                                    <p><span className="font-medium">Planted:</span> {formatDate(tree.plantedDate)}</p>
                                    <p><span className="font-medium">Age:</span> {calculateAge(tree.plantedDate)}</p>
                                    <p><span className="font-medium">Inoculations:</span> {tree.inoculationCount || 0}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="mb-6 text-center py-4 text-gray-500 text-sm">
                          No trees assigned to this investor
                        </div>
                      )}

                      {/* Certificates Section */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                          <AwardIcon />
                          Certificates ({certificates[investor._id]?.length || 0})
                        </h4>

                        {certificates[investor._id]?.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {certificates[investor._id].map((cert) => (
                              <div key={cert.certificateId} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <p className="font-semibold text-gray-800 text-sm">{cert.certificateId}</p>
                                    <p className="text-xs text-gray-500 mt-1">{cert.type}</p>
                                  </div>
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    cert.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {cert.status}
                                  </span>
                                </div>
                                
                                <div className="space-y-1 mb-3">
                                  <p className="text-xs text-gray-600">
                                    <span className="font-medium">Trees:</span> {cert.treeIds?.length || 0}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    <span className="font-medium">Issued:</span> {new Date(cert.issuedAt).toLocaleDateString()}
                                  </p>
                                  {cert.verificationMetadata && (
                                    <div className="flex items-center gap-2 mt-2">
                                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                                        <div 
                                          className="bg-green-600 h-2 rounded-full"
                                          style={{ width: `${cert.verificationMetadata.chainIntegrityScore || 0}%` }}
                                        />
                                      </div>
                                      <span className="text-xs font-medium">{cert.verificationMetadata.chainIntegrityScore || 0}%</span>
                                    </div>
                                  )}
                                </div>

                                <button
                                  onClick={() => window.open(`/certificate/${investor._id}`, '_blank')}
                                  className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs"
                                >
                                  View Certificate
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500 text-sm">
                            No certificates generated yet
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {investors.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No investors found. Click "Add Investor" to get started.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Investor Modal with Tree Selection */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingInvestor ? 'Edit Investor' : 'Add New Investor'}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Investment Amount *</label>
              <input
                type="number"
                value={formData.investment}
                onChange={(e) => setFormData({ ...formData, investment: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Selected Trees ({selectedTreeIds.length})
              </label>
              <div className="flex items-center gap-2 flex-wrap min-h-[40px] p-2 border border-gray-300 rounded-lg bg-gray-50">
                {selectedTreeIds.length === 0 ? (
                  <span className="text-gray-500 text-sm">No trees selected</span>
                ) : (
                  selectedTreeIds.map(treeId => {
                    const tree = trees.find(t => t.treeId === treeId);
                    return tree ? (
                      <span key={treeId} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {tree.treeId}
                        <button
                          type="button"
                          onClick={() => toggleTreeSelection(treeId)}
                          className="ml-1 text-blue-800 hover:text-blue-900"
                        >
                          ×
                        </button>
                      </span>
                    ) : null;
                  })
                )}
              </div>
            </div>
          </div>

          {/* Tree Selection Section */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Select Trees</h3>
                <p className="text-sm text-gray-600">Choose from available trees</p>
              </div>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search trees by ID, block, or NFC..."
                  value={treeSearch}
                  onChange={(e) => setTreeSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
              {filteredTrees.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No trees found
                </div>
              ) : (
                <div className="divide-y">
                  {filteredTrees.map((tree) => {
                    const isAvailable = isTreeAvailable(tree);
                    const isSelected = selectedTreeIds.includes(tree.treeId);
                    const isAssignedToOthers = investors.some(inv => 
                      inv.treeIds?.includes(tree.treeId) && inv._id !== (editingInvestor?._id)
                    );

                    return (
                      <div
                        key={tree.treeId}
                        className={`p-4 flex items-center justify-between hover:bg-gray-50 ${
                          !isAvailable ? 'bg-gray-100 opacity-60 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                        onClick={() => {
                          if (isAvailable) toggleTreeSelection(tree.treeId);
                        }}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-medium text-gray-800">{tree.treeId}</span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                              {tree.block}
                            </span>
                            {tree.nfcTagId && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                                {tree.nfcTagId}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <TreeStatusBadge status={tree.healthStatus} />
                            <LifecycleBadge status={tree.lifecycleStatus} />
                            <span>Age: {calculateAge(tree.plantedDate)}</span>
                            <span>Inoc: {tree.inoculationCount || 0}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {isAssignedToOthers && (
                            <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                              Assigned to another investor
                            </span>
                          )}
                          {isSelected && (
                            <span className="text-green-600">
                              <CheckIcon />
                            </span>
                          )}
                          {!isAvailable && !isAssignedToOthers && (
                            <span className="text-xs text-gray-500">Unavailable</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              onClick={closeModal}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {editingInvestor ? 'Update Investor' : 'Create Investor'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Certificate Modal */}
      <Modal
        isOpen={isCertModalOpen}
        onClose={closeCertModal}
        title="Generate Certificate"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Investor:</span> {selectedInvestor?.name}
            </p>
            {selectedInvestor?.treeIds?.length > 0 && (
              <p className="text-sm text-gray-700 mt-1">
                <span className="font-medium">Trees owned:</span> {selectedInvestor.treeIds.length}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tree IDs (comma-separated)</label>
            <input
              type="text"
              value={certFormData.treeIds}
              onChange={(e) => setCertFormData({ ...certFormData, treeIds: e.target.value })}
              placeholder="e.g., TR-001, TR-002, TR-003"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Note: Only trees assigned to this investor can be included in certificates.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Type</label>
            <select
              value={certFormData.certificateType}
              onChange={(e) => setCertFormData({ ...certFormData, certificateType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="INVESTOR_AUTH">Investor Authentication</option>
              <option value="TREE_OWNERSHIP">Tree Ownership</option>
              <option value="RESIN_QUALITY">Resin Quality</option>
              <option value="CARBON_CREDIT">Carbon Credit</option>
              <option value="HARVEST">Harvest Certificate</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={closeCertModal}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={generateCertificate}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Generate
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}