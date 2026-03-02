const API_URL = 'http://localhost:5000/api';

export const treeService = {
  // GET tree by ID
  getTreeById: async (treeId) => {
    try {
      const response = await fetch(`${API_URL}/trees/${treeId}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result && result.success) {
        return result.data;
      } else {
        throw new Error(result.error || 'Tree not found');
      }
    } catch (error) {
      console.error(`❌ Error fetching tree ${treeId}:`, error);
      throw error;
    }
  },

  // GET all trees
  getAllTrees: async () => {
    try {
      const response = await fetch(`${API_URL}/trees`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result && result.success) {
        return result.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching trees:', error);
      return [];
    }
  },

  // CREATE tree
  createTree: async (treeData) => {
    try {
      const response = await fetch(`${API_URL}/trees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(treeData)
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result && result.success) {
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to create tree');
      }
    } catch (error) {
      console.error('❌ Error creating tree:', error);
      throw error;
    }
  },

  // UPDATE tree
  updateTree: async (treeId, updates) => {
    try {
      const response = await fetch(`${API_URL}/trees/${treeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result && result.success) {
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to update tree');
      }
    } catch (error) {
      console.error(`❌ Error updating tree ${treeId}:`, error);
      throw error;
    }
  },

  // DELETE tree
  deleteTree: async (treeId) => {
    try {
      const response = await fetch(`${API_URL}/trees/${treeId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result && result.success) {
        return result;
      } else {
        throw new Error(result.error || 'Failed to delete tree');
      }
    } catch (error) {
      console.error(`❌ Error deleting tree ${treeId}:`, error);
      throw error;
    }
  },

  // GET tree history
  getTreeHistory: async (treeId) => {
    try {
      const response = await fetch(`${API_URL}/trees/${treeId}/history`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result && result.success) {
        return result.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error(`❌ Error fetching tree history ${treeId}:`, error);
      return [];
    }
  },

  // ADD observation
  addObservation: async (treeId, observationData) => {
    try {
      const response = await fetch(`${API_URL}/trees/${treeId}/observations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(observationData)
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result && result.success) {
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to add observation');
      }
    } catch (error) {
      console.error(`❌ Error adding observation to tree ${treeId}:`, error);
      throw error;
    }
  },

  // INVESTOR-RELATED METHODS
  assignInvestorToTree: async (treeId, investorData) => {
    try {
      const response = await fetch(`${API_URL}/trees/${treeId}/assign-investor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(investorData)
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`✅ Investor assigned to tree ${treeId}:`, data);
      
      return data;
    } catch (error) {
      console.error(`❌ Error assigning investor to tree ${treeId}:`, error);
      throw error;
    }
  },

  removeInvestorFromTree: async (treeId) => {
    try {
      const response = await fetch(`${API_URL}/trees/${treeId}/remove-investor`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`✅ Investor removed from tree ${treeId}:`, data);
      
      return data;
    } catch (error) {
      console.error(`❌ Error removing investor from tree ${treeId}:`, error);
      throw error;
    }
  },

  getTreeInvestor: async (treeId) => {
    try {
      const response = await fetch(`${API_URL}/trees/${treeId}/investor`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`📊 Investor for tree ${treeId}:`, data);
      
      if (data && data.success) {
        return data.data || data;
      } else {
        return null;
      }
    } catch (error) {
      console.error(`❌ Error fetching investor for tree ${treeId}:`, error);
      return null;
    }
  },

  // For updating tree with investor info (simple update)
  updateTreeInvestor: async (treeId, investorId, investorName) => {
    try {
      const updates = {
        investorId: investorId || null,
        investorName: investorName || null,
        lastUpdatedBy: 'web-admin'
      };
      
      return await treeService.updateTree(treeId, updates);
    } catch (error) {
      console.error(`❌ Error updating tree investor info:`, error);
      throw error;
    }
  },

  // Get available trees (not assigned to any investor)
  getAvailableTrees: async () => {
    try {
      const response = await fetch(`${API_URL}/trees/available`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('🌳 Available trees:', data);
      
      if (data && data.success && Array.isArray(data.data)) {
        return data.data;
      } else if (Array.isArray(data)) {
        return data;
      } else {
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching available trees:', error);
      return [];
    }
  }
};

// Also create a separate investor service for investor-specific operations
export const investorService = {
  getAllInvestors: async () => {
    try {
      const response = await fetch(`${API_URL}/investors`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('👥 Investors list:', data);
      
      if (data && data.success && Array.isArray(data.data)) {
        return data.data;
      } else if (Array.isArray(data)) {
        return data;
      } else {
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching investors:', error);
      return [];
    }
  },

  addTreeToInvestor: async (investorId, treeId, amountAllocated = 0) => {
    try {
      const response = await fetch(`${API_URL}/investors/${investorId}/add-tree`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ treeId, amountAllocated })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`✅ Tree ${treeId} added to investor ${investorId}:`, data);
      
      return data;
    } catch (error) {
      console.error(`❌ Error adding tree to investor:`, error);
      throw error;
    }
  },

  removeTreeFromInvestor: async (investorId, treeId) => {
    try {
      const response = await fetch(`${API_URL}/investors/${investorId}/remove-tree`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ treeId })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`✅ Tree ${treeId} removed from investor ${investorId}:`, data);
      
      return data;
    } catch (error) {
      console.error(`❌ Error removing tree from investor:`, error);
      throw error;
    }
  },

  getInvestorWithTrees: async (investorId) => {
    try {
      const response = await fetch(`${API_URL}/investors/${investorId}/trees`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`📊 Investor ${investorId} with trees:`, data);
      
      if (data && data.success) {
        return data.data || data;
      } else {
        return null;
      }
    } catch (error) {
      console.error(`❌ Error fetching investor with trees:`, error);
      return null;
    }
  }
};