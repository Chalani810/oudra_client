import React, { useState, useEffect } from 'react';

// API Configuration
const API_URL = 'http://localhost:5000/api';

const api = {
  investors: {
    getAll: () => fetch(`${API_URL}/investors`).then(r => r.json()),
    getById: (id) => fetch(`${API_URL}/investors/${id}`).then(r => r.json()),
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
  blockchain: {
    getChain: () => fetch(`${API_URL}/blockchain/chain`).then(r => r.json()),
    verify: () => fetch(`${API_URL}/blockchain/verify`).then(r => r.json()),
    getAuditTrail: (id) => fetch(`${API_URL}/blockchain/audit/${id}`).then(r => r.json()),
    getBlock: (index) => fetch(`${API_URL}/blockchain/block/${index}`).then(r => r.json()),
    detailedVerification: () => fetch(`${API_URL}/blockchain/detailed-verification`).then(r => r.json())
  }
};

// SVG Icons
const SearchIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>);
const PlusIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14m-7-7h14"/></svg>);
const EditIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>);
const DeleteIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>);
const ShieldIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>);
const DatabaseIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>);
const CheckCircleIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>);
const XCircleIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6m0-6 6 6"/></svg>);
const ActivityIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>);
const EyeIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>);

// Utility Components
const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderColor: color }}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 font-medium">{label}</p>
        <p className="text-3xl font-bold mt-2" style={{ color }}>{value}</p>
      </div>
      <div className="opacity-20">
        <Icon />
      </div>
    </div>
  </div>
);

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition">
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
    error: 'bg-red-50 border-red-500 text-red-800',
    info: 'bg-blue-50 border-blue-500 text-blue-800'
  };

  return (
    <div className={`border-l-4 p-4 rounded-lg ${styles[type]} flex items-center justify-between mb-4 shadow`}>
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-4 text-2xl font-bold hover:opacity-70">×</button>
    </div>
  );
};

// Main Component
export default function BlockchainInvestorPage() {
  const [activeTab, setActiveTab] = useState('investors');
  const [investors, setInvestors] = useState([]);
  const [blockchain, setBlockchain] = useState({ chain: [], length: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvestor, setEditingInvestor] = useState(null);
  const [alert, setAlert] = useState(null);
  const [auditTrail, setAuditTrail] = useState([]);
  const [selectedInvestor, setSelectedInvestor] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    investment: '',
    status: 'active'
  });

  useEffect(() => {
    loadInvestors();
    loadBlockchain();
  }, []);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const loadInvestors = async () => {
    try {
      const response = await api.investors.getAll();
      if (response.success) setInvestors(response.data);
      else showAlert('error', response.message || 'Failed to load investors');
    } catch (error) {
      console.error(error);
      showAlert('error', 'Failed to load investors. Is the backend running?');
    }
  };

  const loadBlockchain = async () => {
    try {
      const response = await api.blockchain.getChain();
      if (response.success) setBlockchain(response.data);
      else showAlert('error', response.message || 'Failed to load blockchain');
    } catch (error) {
      console.error(error);
      showAlert('error', 'Failed to load blockchain');
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name || !formData.email || !formData.investment) {
        showAlert('error', 'Please fill in all required fields');
        return;
      }

      const investorData = { ...formData, investment: parseFloat(formData.investment) };
      let response;

      if (editingInvestor) {
        response = await api.investors.update(editingInvestor._id, investorData);
      } else {
        response = await api.investors.create(investorData);
      }

      if (response.success) {
        showAlert('success', `Investor ${editingInvestor ? 'updated' : 'created'} successfully`);
        await loadInvestors();
        await loadBlockchain();
        closeModal();
      } else {
        showAlert('error', response.message || 'Operation failed');
      }
    } catch (error) {
      console.error(error);
      showAlert('error', 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this investor?')) return;

    try {
      const response = await api.investors.delete(id);
      if (response.success) {
        showAlert('success', 'Investor deleted successfully');
        await loadInvestors();
        await loadBlockchain();
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
        status: investor.status
      });
    } else {
      setEditingInvestor(null);
      setFormData({ name: '', email: '', phone: '', investment: '', status: 'active' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingInvestor(null);
    setFormData({ name: '', email: '', phone: '', investment: '', status: 'active' });
  };

  const verifyBlockchain = async () => {
    try {
      const response = await api.blockchain.verify();
      if (response.success) {
        setVerificationStatus(response.data);
        showAlert('success', response.data.message);
      } else {
        showAlert('error', response.message || 'Verification failed');
      }
    } catch (error) {
      console.error(error);
      showAlert('error', 'Verification failed');
    }
  };

  // Add the detailed verification function
  const testDetailedVerification = async () => {
    try {
      const response = await api.blockchain.detailedVerification();
      if (response.success) {
        showAlert('success', response.data.message || 'Detailed verification completed');
        console.log('Detailed Verification Results:', response.data);
        
        // You could also set the verification status with detailed info
        setVerificationStatus({
          ...response.data,
          detailed: true
        });
      } else {
        showAlert('error', response.message || 'Detailed verification failed');
      }
    } catch (error) {
      console.error('Error:', error);
      showAlert('error', 'Failed to run detailed verification');
    }
  };

  const viewAuditTrail = async (investor) => {
    try {
      setSelectedInvestor(investor);
      const response = await api.blockchain.getAuditTrail(investor._id);
      if (response.success) setAuditTrail(response.data);
      else showAlert('error', response.message || 'Failed to load audit trail');
      setActiveTab('audit');
    } catch (error) {
      console.error(error);
      showAlert('error', 'Failed to load audit trail');
    }
  };

  const filteredInvestors = investors.filter(inv =>
    inv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalInvestment = investors.reduce((sum, inv) => sum + parseFloat(inv.investment || 0), 0);
  const activeInvestors = investors.filter(inv => inv.status === 'active').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldIcon />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Blockchain Investor Management</h1>
                <p className="text-gray-600 mt-1">Secure & Transparent Investment Tracking</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatCard icon={DatabaseIcon} label="Total Investors" value={investors.length} color="#3B82F6" />
          <StatCard icon={CheckCircleIcon} label="Active Investors" value={activeInvestors} color="#10B981" />
          <StatCard icon={ActivityIcon} label="Total Investment" value={`$${totalInvestment.toLocaleString()}`} color="#F59E0B" />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('investors')}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === 'investors'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Investors
            </button>
            <button
              onClick={() => setActiveTab('blockchain')}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === 'blockchain'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Blockchain
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === 'audit'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Audit Trail
            </button>
          </div>

          <div className="p-6">
            {/* Investors Tab */}
            {activeTab === 'investors' && (
              <div>
                <div className="mb-4">
                  <div className="relative">
                    <SearchIcon />
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Investment</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInvestors.map((inv) => (
                        <tr key={inv._id} className="border-t border-gray-200 hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-800">{inv.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{inv.email}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{inv.phone}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-800">${inv.investment?.toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              inv.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {inv.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => viewAuditTrail(inv)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                                title="View Audit Trail"
                              >
                                <EyeIcon />
                              </button>
                              <button
                                onClick={() => openModal(inv)}
                                className="p-2 text-yellow-600 hover:bg-yellow-50 rounded transition"
                                title="Edit"
                              >
                                <EditIcon />
                              </button>
                              <button
                                onClick={() => handleDelete(inv._id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                                title="Delete"
                              >
                                <DeleteIcon />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredInvestors.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      No investors found
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Blockchain Tab */}
            {activeTab === 'blockchain' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Blockchain Status</h2>
                  <div className="flex gap-2">
                    {/* Add the Detailed Verification Button */}
                    <button
                      onClick={testDetailedVerification}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-md flex items-center gap-2"
                    >
                      <span>🔍</span>
                      Run Detailed Verification
                    </button>
                    <button
                      onClick={verifyBlockchain}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md"
                    >
                      Verify Chain
                    </button>
                  </div>
                </div>

                {verificationStatus && (
                  <div className={`p-4 rounded-lg mb-6 ${
                    verificationStatus.isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}>
                    <p className="font-semibold">{verificationStatus.message}</p>
                    <p className="text-sm text-gray-600 mt-1">Chain Length: {verificationStatus.chainLength}</p>
                    {/* Show detailed verification results if available */}
                    {verificationStatus.detailed && verificationStatus.issues && verificationStatus.issues.length > 0 && (
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="font-medium text-yellow-800">Verification Issues Found:</p>
                        <ul className="mt-1 text-sm text-yellow-700">
                          {verificationStatus.issues.map((issue, index) => (
                            <li key={index} className="mt-1">• {issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-4">
                  {blockchain.chain.map((block) => (
                    <div key={block.index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-800">Block #{block.index}</p>
                          <p className="text-xs text-gray-500">{new Date(block.timestamp).toLocaleString()}</p>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                          {block.data?.action || 'N/A'}
                        </span>
                      </div>
                      <div className="mt-3 space-y-1">
                        <p className="text-xs text-gray-600">Hash: <span className="font-mono">{block.hash}</span></p>
                        <p className="text-xs text-gray-600">Previous: <span className="font-mono">{block.previousHash}</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Audit Trail Tab */}
            {activeTab === 'audit' && (
              <div>
                {selectedInvestor ? (
                  <>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-800">Audit Trail</h2>
                      <p className="text-gray-600">Investor: {selectedInvestor.name}</p>
                    </div>

                    <div className="space-y-4">
                      {auditTrail.map((record) => (
                        <div key={record._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-gray-800">Block #{record.index}</p>
                              <p className="text-sm text-gray-600 mt-1">{new Date(record.timestamp).toLocaleString()}</p>
                            </div>
                            <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                              {record.data?.action}
                            </span>
                          </div>
                          <div className="mt-3">
                            <p className="text-xs text-gray-600">Hash: <span className="font-mono">{record.hash}</span></p>
                          </div>
                        </div>
                      ))}

                      {auditTrail.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                          No audit records found
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    Select an investor to view their audit trail
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingInvestor ? 'Edit Investor' : 'Add New Investor'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Investment Amount *</label>
            <input
              type="number"
              value={formData.investment}
              onChange={(e) => setFormData({ ...formData, investment: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

          <div className="flex justify-end gap-3 pt-4">
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
              {editingInvestor ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}