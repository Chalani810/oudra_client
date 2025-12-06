import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const investorAPI = {
  getAll: () => api.get('/investors'),
  getById: (id) => api.get(`/investors/${id}`),
  create: (data) => api.post('/investors', data),
  update: (id, data) => api.put(`/investors/${id}`, data),
  delete: (id) => api.delete(`/investors/${id}`),
};

export const blockchainAPI = {
  getChain: () => api.get('/blockchain/chain'),
  verify: () => api.get('/blockchain/verify'),
  getAuditTrail: (id) => api.get(`/blockchain/audit/${id}`),
  getBlock: (index) => api.get(`/blockchain/block/${index}`),
};

export default api;