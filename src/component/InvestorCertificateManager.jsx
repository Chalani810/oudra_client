// // path: components/InvestorCertificateManager.jsx
// import React, { useState, useEffect, useCallback } from 'react';

// // API Configuration
// const API_URL = 'http://localhost:5000/api';

// const api = {
//   investors: {
//     getAll: () => fetch(`${API_URL}/investors`).then(r => r.json()),
//     getAvailableTrees: () => fetch(`${API_URL}/investors/available-trees`).then(r => r.json()),
//     create: (data) => fetch(`${API_URL}/investors`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data)
//     }).then(r => r.json()),
//     update: (id, data) => fetch(`${API_URL}/investors/${id}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data)
//     }).then(r => r.json()),
//     delete: (id) => fetch(`${API_URL}/investors/${id}`, {
//       method: 'DELETE'
//     }).then(r => r.json()),
//     getTreeInvestor: (treeId) => fetch(`${API_URL}/investors/tree/${treeId}`).then(r => r.json())
//   },
//   certificates: {
//   generate: (data) => fetch(`${API_URL}/certificates/generate`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(data)
//   }).then(r => r.json()),
//   generateHarvest: (treeId) => fetch(`${API_URL}/certificates/generate-harvest`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ treeId })
//   }).then(r => r.json()),
//   getByInvestor: (investorId) => fetch(`${API_URL}/certificates/investor/${investorId}`).then(r => r.json())
// }
// };

// // Icons (same as before)
// const PlusIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14m-7-7h14"/></svg>);
// const EditIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>);
// const DeleteIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>);
// const XCircleIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6m0-6 6 6"/></svg>);
// const AwardIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>);
// const UsersIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
// const ChevronDownIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>);
// const TreeIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22v-7"/><path d="M8 15h8"/><path d="M12 2v5"/><path d="M18 12a6 6 0 1 0-12 0"/></svg>);
// const SearchIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>);
// const CheckIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>);

// // Modal and Alert components (same as before)
// const Modal = ({ isOpen, onClose, title, children }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
//         <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
//           <h2 className="text-xl font-bold text-gray-800">{title}</h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//             <XCircleIcon />
//           </button>
//         </div>
//         <div className="p-6">{children}</div>
//       </div>
//     </div>
//   );
// };

// const Alert = ({ type, message, onClose }) => {
//   const styles = {
//     success: 'bg-green-50 border-green-500 text-green-800',
//     error: 'bg-red-50 border-red-500 text-red-800'
//   };

//   return (
//     <div className={`border-l-4 p-4 rounded-lg ${styles[type]} flex items-center justify-between mb-4 shadow`}>
//       <span className="font-medium">{message}</span>
//       <button onClick={onClose} className="ml-4 text-2xl font-bold hover:opacity-70">×</button>
//     </div>
//   );
// };

// // Create Investor Modal with Tree Selection
// const CreateInvestorModal = ({ isOpen, onClose, onSuccess }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     investment: '',
//     status: 'active'
//   });

//   const [availableTrees, setAvailableTrees] = useState([]);
//   const [selectedTrees, setSelectedTrees] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [treesLoading, setTreesLoading] = useState(false);

//   useEffect(() => {
//     if (isOpen) {
//       fetchAvailableTrees();
//       // Reset form
//       setFormData({
//         name: '',
//         email: '',
//         phone: '',
//         investment: '',
//         status: 'active'
//       });
//       setSelectedTrees([]);
//       setSearchTerm('');
//       setErrors({});
//     }
//   }, [isOpen]);

//   const fetchAvailableTrees = async () => {
//     try {
//       setTreesLoading(true);
//       const response = await api.investors.getAvailableTrees();
//       if (response.success) {
//         setAvailableTrees(response.data);
//       } else {
//         console.error('Failed to fetch available trees:', response.error);
//       }
//     } catch (error) {
//       console.error('Error fetching available trees:', error);
//     } finally {
//       setTreesLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     // Clear error for this field
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const toggleTreeSelection = (tree) => {
//     setSelectedTrees(prev => {
//       const isSelected = prev.some(t => t._id === tree._id);
//       if (isSelected) {
//         return prev.filter(t => t._id !== tree._id);
//       } else {
//         return [...prev, tree];
//       }
//     });
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!formData.name.trim()) {
//       newErrors.name = 'Name is required';
//     }
    
//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = 'Invalid email format';
//     }
    
//     if (!formData.phone.trim()) {
//       newErrors.phone = 'Phone is required';
//     }
    
//     if (!formData.investment || parseFloat(formData.investment) <= 0) {
//       newErrors.investment = 'Investment must be greater than 0';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await api.investors.create({
//         ...formData,
//         investment: parseFloat(formData.investment),
//         selectedTreeIds: selectedTrees.map(t => t._id)
//       });

//       if (response.success) {
//         alert(`Investor created successfully with ${selectedTrees.length} trees assigned!`);
//         onSuccess?.();
//         onClose();
//       } else {
//         alert(response.error || 'Failed to create investor');
//       }
//     } catch (error) {
//       console.error('Error creating investor:', error);
//       alert('Failed to create investor. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     setFormData({
//       name: '',
//       email: '',
//       phone: '',
//       investment: '',
//       status: 'active'
//     });
//     setSelectedTrees([]);
//     setSearchTerm('');
//     setErrors({});
//     onClose();
//   };

//   const filteredTrees = availableTrees.filter(tree => 
//     tree.treeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     (tree.block && tree.block.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
//         {/* Header */}
//         <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
//           <div>
//             <h2 className="text-2xl font-semibold text-gray-800">Create New Investor</h2>
//             <p className="text-sm text-gray-600 mt-1">
//               Add investor details and assign trees
//             </p>
//           </div>
//           <button 
//             onClick={handleClose}
//             className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             <XCircleIcon />
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
//           <div className="p-6 space-y-6">
            
//             {/* Investor Information */}
//             <div className="bg-blue-50 p-4 rounded-lg">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Investor Information</h3>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Full Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     className={`w-full p-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
//                     placeholder="John Doe"
//                   />
//                   {errors.name && (
//                     <p className="text-red-500 text-xs mt-1">{errors.name}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Email <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
//                     placeholder="john@example.com"
//                   />
//                   {errors.email && (
//                     <p className="text-red-500 text-xs mt-1">{errors.email}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Phone <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     className={`w-full p-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
//                     placeholder="+1234567890"
//                   />
//                   {errors.phone && (
//                     <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Investment Amount ($) <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="number"
//                     name="investment"
//                     value={formData.investment}
//                     onChange={handleChange}
//                     className={`w-full p-3 border ${errors.investment ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
//                     placeholder="10000"
//                     min="0"
//                     step="0.01"
//                   />
//                   {errors.investment && (
//                     <p className="text-red-500 text-xs mt-1">{errors.investment}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Status
//                   </label>
//                   <select
//                     name="status"
//                     value={formData.status}
//                     onChange={handleChange}
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     <option value="active">Active</option>
//                     <option value="inactive">Inactive</option>
//                     <option value="pending">Pending</option>
//                   </select>
//                 </div>
//               </div>
//             </div>

//             {/* Tree Selection */}
//             <div className="bg-green-50 p-4 rounded-lg">
//               <div className="flex justify-between items-center mb-4">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-800">Assign Trees</h3>
//                   <p className="text-sm text-gray-600">
//                     Selected: {selectedTrees.length} trees (Optional)
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <TreeIcon />
//                   <span className="text-sm text-gray-600">
//                     {availableTrees.length} trees available
//                   </span>
//                 </div>
//               </div>

//               {/* Search */}
//               <div className="relative mb-4">
//                 <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search trees by ID or block..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                 />
//               </div>

//               {/* Available Trees List */}
//               <div className="border border-gray-300 rounded-lg max-h-64 overflow-y-auto">
//                 {treesLoading ? (
//                   <div className="flex justify-center items-center p-8">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
//                   </div>
//                 ) : filteredTrees.length === 0 ? (
//                   <div className="text-center p-8 text-gray-500">
//                     <TreeIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
//                     <p className="text-lg mb-2">No available trees found</p>
//                     <p className="text-sm">All trees are currently assigned to investors</p>
//                   </div>
//                 ) : (
//                   <div className="divide-y divide-gray-200">
//                     {filteredTrees.map((tree) => {
//                       const isSelected = selectedTrees.some(t => t._id === tree._id);
//                       return (
//                         <div
//                           key={tree._id}
//                           onClick={() => toggleTreeSelection(tree)}
//                           className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
//                             isSelected ? 'bg-green-100 border-l-4 border-green-500' : ''
//                           }`}
//                         >
//                           <div className="flex justify-between items-center">
//                             <div className="flex items-center gap-3">
//                               {isSelected ? (
//                                 <div className="bg-green-600 text-white rounded-full p-1">
//                                   <CheckIcon />
//                                 </div>
//                               ) : (
//                                 <div className="w-6 h-6 border-2 border-gray-300 rounded"></div>
//                               )}
//                               <div>
//                                 <p className="font-semibold text-gray-800">{tree.treeId}</p>
//                                 <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
//                                   <span>Block: {tree.block || 'N/A'}</span>
//                                   <span className={`px-2 py-0.5 rounded-full text-xs ${
//                                     tree.healthStatus === 'Healthy' ? 'bg-green-100 text-green-800' :
//                                     tree.healthStatus === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
//                                     'bg-red-100 text-red-800'
//                                   }`}>
//                                     {tree.healthStatus}
//                                   </span>
//                                   <span className="text-gray-500">
//                                     Age: {tree.age || 'N/A'}
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="text-right">
//                               <p className="text-sm font-medium text-gray-700">{tree.lifecycleStatus}</p>
//                               <p className="text-xs text-gray-500">Planted: {tree.plantedDate ? new Date(tree.plantedDate).toLocaleDateString() : 'N/A'}</p>
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>

//               {selectedTrees.length > 0 && (
//                 <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
//                   <div className="flex justify-between items-center mb-2">
//                     <p className="text-sm font-medium text-gray-700">Selected Trees:</p>
//                     <button
//                       type="button"
//                       onClick={() => setSelectedTrees([])}
//                       className="text-xs text-red-600 hover:text-red-800"
//                     >
//                       Clear All
//                     </button>
//                   </div>
//                   <div className="flex flex-wrap gap-2">
//                     {selectedTrees.map(tree => (
//                       <span
//                         key={tree._id}
//                         className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
//                       >
//                         <TreeIcon size={14} />
//                         {tree.treeId}
//                         <button
//                           type="button"
//                           onClick={() => toggleTreeSelection(tree)}
//                           className="ml-1 hover:text-green-600"
//                         >
//                           <XCircleIcon size={14} />
//                         </button>
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Form Actions */}
//           <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
//             <button
//               type="button"
//               onClick={handleClose}
//               className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//               disabled={loading}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
//               disabled={loading}
//             >
//               {loading ? 'Creating...' : 'Create Investor'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// // Main Investor Certificate Manager Component
// export default function InvestorCertificateManager() {
//   const [investors, setInvestors] = useState([]);
//   const [expandedInvestor, setExpandedInvestor] = useState(null);
//   const [certificates, setCertificates] = useState({});
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//   const [isCertModalOpen, setIsCertModalOpen] = useState(false);
//   const [editingInvestor, setEditingInvestor] = useState(null);
//   const [selectedInvestor, setSelectedInvestor] = useState(null);
//   const [alert, setAlert] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     investment: '',
//     status: 'active'
//   });
//   const [certFormData, setCertFormData] = useState({
//     treeIds: '',
//     certificateType: 'INVESTOR_AUTH'
//   });

//   const showAlert = useCallback((type, message) => {
//     setAlert({ type, message });
//     setTimeout(() => setAlert(null), 5000);
//   }, []);

//   const loadInvestors = useCallback(async () => {
//     try {
//       console.log('Loading investors from:', `${API_URL}/investors`);
//       const response = await api.investors.getAll();
//       console.log('API Response:', response);
      
//       if (response.success) {
//         setInvestors(response.data || []);
//         console.log('Loaded investors:', response.data);
//       } else {
//         showAlert('error', response.message || 'Failed to load investors');
//       }
//     } catch (error) {
//       console.error('Load investors error:', error);
//       showAlert('error', `Failed to connect to server: ${error.message}`);
//     }
//   }, [showAlert]);

//   const loadCertificates = async (investorId) => {
//     try {
//       const response = await api.certificates.getByInvestor(investorId);
//       if (response.success) {
//         setCertificates(prev => ({ ...prev, [investorId]: response.data || [] }));
//       }
//     } catch (error) {
//       console.error('Failed to load certificates:', error);
//       console.log('Certificate API Error Details:', error.message);
//       setCertificates(prev => ({ ...prev, [investorId]: [] }));
//     }
//   };

//   useEffect(() => {
//     const initializeData = async () => {
//       setLoading(true);
//       await loadInvestors();
//       setLoading(false);
//     };
//     initializeData();
//   }, [loadInvestors]);

//   const handleSubmit = async () => {
//     try {
//       if (!formData.name || !formData.email || !formData.investment) {
//         showAlert('error', 'Please fill in all required fields');
//         return;
//       }

//       const investorData = { ...formData, investment: parseFloat(formData.investment) };
//       let response;

//       if (editingInvestor) {
//         response = await api.investors.update(editingInvestor._id, investorData);
//       } else {
//         response = await api.investors.create(investorData);
//       }

//       if (response.success) {
//         showAlert('success', `Investor ${editingInvestor ? 'updated' : 'created'} successfully`);
//         await loadInvestors();
//         closeModal();
//       } else {
//         showAlert('error', response.message || 'Operation failed');
//       }
//     } catch (error) {
//       console.error(error);
//       showAlert('error', error.message || 'Operation failed');
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this investor?')) return;

//     try {
//       const response = await api.investors.delete(id);
//       if (response.success) {
//         showAlert('success', 'Investor deleted successfully');
//         await loadInvestors();
//       } else {
//         showAlert('error', response.message || 'Failed to delete investor');
//       }
//     } catch (error) {
//       console.error(error);
//       showAlert('error', 'Failed to delete investor');
//     }
//   };

//   const openModal = (investor = null) => {
//     if (investor) {
//       setEditingInvestor(investor);
//       setFormData({
//         name: investor.name,
//         email: investor.email,
//         phone: investor.phone,
//         investment: investor.investment.toString(),
//         status: investor.status
//       });
//     } else {
//       setEditingInvestor(null);
//       setFormData({ name: '', email: '', phone: '', investment: '', status: 'active' });
//     }
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setEditingInvestor(null);
//     setFormData({ name: '', email: '', phone: '', investment: '', status: 'active' });
//   };

//   const openCreateModal = () => {
//     setIsCreateModalOpen(true);
//   };

//   const closeCreateModal = () => {
//     setIsCreateModalOpen(false);
//   };

//   const openCertModal = (investor) => {
//     setSelectedInvestor(investor);
//     setCertFormData({ treeIds: '', certificateType: 'INVESTOR_AUTH' });
//     setIsCertModalOpen(true);
//   };

//   const closeCertModal = () => {
//     setIsCertModalOpen(false);
//     setSelectedInvestor(null);
//     setCertFormData({ treeIds: '', certificateType: 'INVESTOR_AUTH' });
//   };

//   const generateCertificate = async () => {
//     try {
//       if (!selectedInvestor) {
//         showAlert('error', 'Please select an investor');
//         return;
//       }

//       const treeIds = certFormData.treeIds.split(',').map(id => id.trim()).filter(Boolean);

//       const response = await api.certificates.generate({
//         investorId: selectedInvestor._id,
//         treeIds,
//         certificateType: certFormData.certificateType
//       });

//       if (response.success) {
//         showAlert('success', 'Certificate generated successfully');
//         await loadCertificates(selectedInvestor._id);
//         closeCertModal();
//       } else {
//         showAlert('error', response.message || 'Failed to generate certificate');
//       }
//     } catch (error) {
//       console.error(error);
//       showAlert('error', 'Failed to generate certificate');
//     }
//   };

//   const toggleInvestor = async (investor) => {
//     if (expandedInvestor === investor._id) {
//       setExpandedInvestor(null);
//     } else {
//       setExpandedInvestor(investor._id);
//       if (!certificates[investor._id]) {
//         await loadCertificates(investor._id);
//       }
//     }
//   };

//   const handleCreateInvestorSuccess = () => {
//     loadInvestors();
//     closeCreateModal();
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-700 text-lg">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
//       <div className="max-w-5xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <UsersIcon />
//               <div>
//                 <h1 className="text-3xl font-bold text-gray-800">Investor Management</h1>
//                 <p className="text-gray-600 mt-1">Manage investors and their certificates</p>
//               </div>
//             </div>
//             <div className="flex gap-3">
//               <button
//                 onClick={openCreateModal}
//                 className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md"
//               >
//                 <PlusIcon />
//                 Create Investor
//               </button>
//               <button
//                 onClick={() => openModal()}
//                 className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
//               >
//                 <PlusIcon />
//                 Add Investor (Simple)
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Alerts */}
//         {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//           <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
//             <p className="text-sm text-gray-600 font-medium">Total Investors</p>
//             <p className="text-3xl font-bold text-blue-600 mt-2">{investors.length}</p>
//           </div>
//           <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
//             <p className="text-sm text-gray-600 font-medium">Active Investors</p>
//             <p className="text-3xl font-bold text-green-600 mt-2">
//               {investors.filter(inv => inv.status === 'active').length}
//             </p>
//           </div>
//           <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
//             <p className="text-sm text-gray-600 font-medium">Total Investment</p>
//             <p className="text-3xl font-bold text-purple-600 mt-2">
//               ${investors.reduce((sum, inv) => sum + (inv.investment || 0), 0).toLocaleString()}
//             </p>
//           </div>
//         </div>

//         {/* Investors List */}
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//           <div className="p-6 border-b">
//             <div className="flex justify-between items-center">
//               <h2 className="text-xl font-bold text-gray-800">Investors & Certificates</h2>
//               <div className="flex items-center gap-2">
//                 <TreeIcon />
//                 <span className="text-sm text-gray-600">
//                   Total Trees: {investors.reduce((sum, inv) => sum + (inv.investedTrees?.length || 0), 0)}
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="divide-y">
//             {investors.map((investor) => (
//               <div key={investor._id}>
//                 {/* Investor Row */}
//                 <div className="p-6 hover:bg-gray-50 transition">
//                   <div className="flex items-center justify-between">
//                     <div className="flex-1">
//                       <div className="flex items-center gap-3 mb-2">
//                         <h3 className="text-lg font-semibold text-gray-800">{investor.name}</h3>
//                         <span className={`px-2 py-1 text-xs rounded-full ${
//                           investor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
//                         }`}>
//                           {investor.status}
//                         </span>
//                         {investor.investedTrees && investor.investedTrees.length > 0 && (
//                           <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
//                             {investor.investedTrees.length} tree(s)
//                           </span>
//                         )}
//                       </div>
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
//                         <p><span className="font-medium">Email:</span> {investor.email}</p>
//                         <p><span className="font-medium">Phone:</span> {investor.phone}</p>
//                         <p><span className="font-medium">Investment:</span> ${investor.investment?.toLocaleString()}</p>
//                       </div>
                      
//                       {/* Investor's Trees Preview */}
//                       {investor.investedTrees && investor.investedTrees.length > 0 && (
//                         <div className="mt-3">
//                           <div className="flex flex-wrap gap-2">
//                             {investor.investedTrees.slice(0, 3).map((treeItem, index) => (
//                               <span key={index} className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-50 text-green-700 rounded">
//                                 <TreeIcon size={12} />
//                                 {treeItem.tree?.treeId || `Tree ${index + 1}`}
//                               </span>
//                             ))}
//                             {investor.investedTrees.length > 3 && (
//                               <span className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
//                                 +{investor.investedTrees.length - 3} more
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       )}
//                     </div>

//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={() => openCertModal(investor)}
//                         className="flex items-center gap-1 px-3 py-2 text-green-600 hover:bg-green-50 rounded transition"
//                         title="Generate Certificate"
//                       >
//                         <AwardIcon />
//                         <span className="text-sm">Generate Cert</span>
//                       </button>
//                       <button
//                         onClick={() => openModal(investor)}
//                         className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
//                         title="Edit"
//                       >
//                         <EditIcon />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(investor._id)}
//                         className="p-2 text-red-600 hover:bg-red-50 rounded transition"
//                         title="Delete"
//                       >
//                         <DeleteIcon />
//                       </button>
//                       <button
//                         onClick={() => toggleInvestor(investor)}
//                         className={`p-2 text-gray-600 hover:bg-gray-100 rounded transition ${
//                           expandedInvestor === investor._id ? 'transform rotate-180' : ''
//                         }`}
//                       >
//                         <ChevronDownIcon />
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Certificates Section */}
//                 {expandedInvestor === investor._id && (
//                   <div className="bg-gray-50 p-6 border-t">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       {/* Trees Section */}
//                       <div>
//                         <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
//                           <TreeIcon />
//                           Assigned Trees ({investor.investedTrees?.length || 0})
//                         </h4>
                        
//                         {investor.investedTrees && investor.investedTrees.length > 0 ? (
//                           <div className="space-y-3">
//                             {investor.investedTrees.map((treeItem, index) => (
//                               <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
//                                 <div className="flex justify-between items-start mb-2">
//                                   <div>
//                                     <p className="font-semibold text-gray-800">{treeItem.tree?.treeId || 'Tree'}</p>
//                                     <p className="text-xs text-gray-500">Block: {treeItem.tree?.block || 'N/A'}</p>
//                                   </div>
//                                   <span className={`px-2 py-1 text-xs rounded-full ${
//                                     treeItem.tree?.healthStatus === 'Healthy' ? 'bg-green-100 text-green-800' :
//                                     treeItem.tree?.healthStatus === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
//                                     'bg-red-100 text-red-800'
//                                   }`}>
//                                     {treeItem.tree?.healthStatus || 'Unknown'}
//                                   </span>
//                                 </div>
//                                 <div className="text-xs text-gray-600 space-y-1">
//                                   <p>Lifecycle: {treeItem.tree?.lifecycleStatus || 'N/A'}</p>
//                                   <p>Planted: {treeItem.tree?.plantedDate ? new Date(treeItem.tree.plantedDate).toLocaleDateString() : 'N/A'}</p>
//                                   <p>Age: {treeItem.tree?.age || 'N/A'}</p>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         ) : (
//                           <div className="text-center py-8 text-gray-500 text-sm bg-white rounded-lg">
//                             No trees assigned to this investor
//                           </div>
//                         )}
//                       </div>

//                       {/* Certificates Section */}
//                       <div>
//                         <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
//                           <AwardIcon />
//                           Certificates ({certificates[investor._id]?.length || 0})
//                         </h4>

//                         {certificates[investor._id]?.length > 0 ? (
//                           <div className="space-y-4">
//                             {certificates[investor._id].map((cert) => (
//                               <div key={cert.certificateId} className="bg-white border border-gray-200 rounded-lg p-4">
//                                 <div className="flex justify-between items-start mb-3">
//                                   <div>
//                                     <p className="font-semibold text-gray-800 text-sm">{cert.certificateId}</p>
//                                     <p className="text-xs text-gray-500 mt-1">{cert.type}</p>
//                                   </div>
//                                   <span className={`px-2 py-1 text-xs rounded-full ${
//                                     cert.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
//                                   }`}>
//                                     {cert.status}
//                                   </span>
//                                 </div>
                                
//                                 <div className="space-y-1 mb-3">
//                                   <p className="text-xs text-gray-600">
//                                     <span className="font-medium">Trees:</span> {cert.treeIds?.length || 0}
//                                   </p>
//                                   <p className="text-xs text-gray-600">
//                                     <span className="font-medium">Issued:</span> {new Date(cert.issuedAt).toLocaleDateString()}
//                                   </p>
//                                   {cert.verificationMetadata && (
//                                     <div className="flex items-center gap-2 mt-2">
//                                       <div className="flex-1 bg-gray-200 rounded-full h-2">
//                                         <div 
//                                           className="bg-green-600 h-2 rounded-full"
//                                           style={{ width: `${cert.verificationMetadata.chainIntegrityScore || 0}%` }}
//                                         />
//                                       </div>
//                                       <span className="text-xs font-medium">{cert.verificationMetadata.chainIntegrityScore || 0}%</span>
//                                     </div>
//                                   )}
//                                 </div>

//                                 <button
//                                   onClick={() => window.open(`/certificate/${investor._id}`, '_blank')}
//                                   className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs"
//                                 >
//                                   View Certificate
//                                 </button>
//                               </div>
//                             ))}
//                           </div>
//                         ) : (
//                           <div className="text-center py-8 text-gray-500 text-sm bg-white rounded-lg">
//                             No certificates generated yet
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}

//             {investors.length === 0 && (
//               <div className="text-center py-12 text-gray-500">
//                 <UsersIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
//                 <p className="text-lg mb-2">No investors found</p>
//                 <p className="text-sm text-gray-600 mb-4">Click "Create Investor" to add your first investor</p>
//                 <button
//                   onClick={openCreateModal}
//                   className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//                 >
//                   Create First Investor
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Simple Investor Modal (for quick edits) */}
//       <Modal
//         isOpen={isModalOpen}
//         onClose={closeModal}
//         title={editingInvestor ? 'Edit Investor' : 'Add New Investor'}
//       >
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
//             <input
//               type="text"
//               value={formData.name}
//               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
//             <input
//               type="email"
//               value={formData.email}
//               onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
//             <input
//               type="text"
//               value={formData.phone}
//               onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Investment Amount *</label>
//             <input
//               type="number"
//               value={formData.investment}
//               onChange={(e) => setFormData({ ...formData, investment: e.target.value })}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//             <select
//               value={formData.status}
//               onChange={(e) => setFormData({ ...formData, status: e.target.value })}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//               <option value="pending">Pending</option>
//             </select>
//           </div>

//           <div className="flex justify-end gap-3 pt-4">
//             <button
//               onClick={closeModal}
//               className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSubmit}
//               className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//             >
//               {editingInvestor ? 'Update' : 'Create'}
//             </button>
//           </div>
//         </div>
//       </Modal>

//       {/* Create Investor Modal with Tree Selection */}
//       <CreateInvestorModal
//         isOpen={isCreateModalOpen}
//         onClose={closeCreateModal}
//         onSuccess={handleCreateInvestorSuccess}
//       />

//       {/* Certificate Modal */}
//       <Modal
//         isOpen={isCertModalOpen}
//         onClose={closeCertModal}
//         title="Generate Certificate"
//       >
//         <div className="space-y-4">
//           <div className="bg-blue-50 p-3 rounded-lg">
//             <p className="text-sm text-gray-700">
//               <span className="font-medium">Investor:</span> {selectedInvestor?.name}
//             </p>
//             {selectedInvestor?.investedTrees && selectedInvestor.investedTrees.length > 0 && (
//               <p className="text-sm text-gray-700 mt-1">
//                 <span className="font-medium">Assigned Trees:</span> {selectedInvestor.investedTrees.length}
//               </p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Tree IDs (comma-separated)</label>
//             <input
//               type="text"
//               value={certFormData.treeIds}
//               onChange={(e) => setCertFormData({ ...certFormData, treeIds: e.target.value })}
//               placeholder="e.g., tree1, tree2, tree3"
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//             <p className="text-xs text-gray-500 mt-1">
//               Leave empty to generate certificate for all assigned trees
//             </p>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Type</label>
//             <select
//               value={certFormData.certificateType}
//               onChange={(e) => setCertFormData({ ...certFormData, certificateType: e.target.value })}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="INVESTOR_AUTH">Investor Authentication</option>
//               <option value="TREE_OWNERSHIP">Tree Ownership</option>
//               <option value="RESIN_QUALITY">Resin Quality</option>
//               <option value="CARBON_CREDIT">Carbon Credit</option>
//               <option value="HARVEST">Harvest Certificate</option>
//             </select>
//           </div>

//           <div className="flex justify-end gap-3 pt-4">
//             <button
//               onClick={closeCertModal}
//               className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={generateCertificate}
//               className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//             >
//               Generate
//             </button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// }