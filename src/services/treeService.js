// path: oudra-client/src/services/treeService.js
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Helper: get auth headers from localStorage token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const treeService = {
  // ===== BASIC CRUD OPERATIONS =====

  getAllTrees: async () => {
    try {
      console.log("🌳 Fetching trees from:", `${API_BASE_URL}/api/trees`);
      const response = await fetch(`${API_BASE_URL}/api/trees`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Trees API failed:", response.status, errorText);
        throw new Error(`Failed to fetch trees: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Trees API response received");

      if (Array.isArray(data)) return data;
      if (data.data && Array.isArray(data.data)) return data.data;
      if (data.trees && Array.isArray(data.trees)) return data.trees;
      if (data.success && Array.isArray(data.data)) return data.data;

      console.error("⚠️ Unexpected response format:", data);
      return [];
    } catch (error) {
      console.error("❌ Error fetching trees:", error);
      return [];
    }
  },

  getTreeById: async (treeId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/trees/${treeId}`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch tree: ${response.status} ${errorText}`);
      }
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error fetching tree:', error);
      throw error;
    }
  },

  createTree: async (treeData) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const payload = {
        ...treeData,
        lastUpdatedBy: userData?.userId || 'web-admin'
      };
      const response = await fetch(`${API_BASE_URL}/api/trees`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to create tree: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating tree:', error);
      throw error;
    }
  },

  updateTree: async (treeId, updates) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const payload = {
        ...updates,
        lastUpdatedBy: userData?.userId || 'web-admin'
      };
      const response = await fetch(`${API_BASE_URL}/api/trees/${treeId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update tree: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating tree:', error);
      throw error;
    }
  },

  deleteTree: async (treeId) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const payload = { deletedBy: userData?.userId || 'web-admin' };
      const response = await fetch(`${API_BASE_URL}/api/trees/${treeId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to delete tree: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error deleting tree:', error);
      throw error;
    }
  },

  updateTreeProfile: async (treeId, profileData) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const payload = {
        ...profileData,
        lastUpdatedBy: userData?.userId || 'web-admin'
      };
      const response = await fetch(`${API_BASE_URL}/api/trees/${treeId}/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update tree profile: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating tree profile:', error);
      throw error;
    }
  },

  // ===== SPECIALIZED UPDATES =====

  mobileUpdateTree: async (treeId, updates) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/trees/${treeId}/mobile-update`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update tree via mobile: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating tree via mobile:', error);
      throw error;
    }
  },

  mobileUpdateTreeProfile: async (treeId, updates) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/trees/${treeId}/mobile-profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update tree profile via mobile: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating tree profile via mobile:', error);
      throw error;
    }
  },

  updateNFCTag: async (treeId, nfcTagId, assignedBy) => {
    try {
      const payload = {
        nfcTagId,
        assignedBy: assignedBy || 'field-worker',
        deviceType: 'mobile'
      };
      const response = await fetch(`${API_BASE_URL}/api/trees/${treeId}/nfc`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update NFC tag: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating NFC tag:', error);
      throw error;
    }
  },

  updateGPS: async (treeId, gpsData, updatedBy) => {
    try {
      const payload = {
        gps: gpsData,
        updatedBy: updatedBy || 'field-worker'
      };
      const response = await fetch(`${API_BASE_URL}/api/trees/${treeId}/gps`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update GPS: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating GPS:', error);
      throw error;
    }
  },

  updateInspection: async (treeId, inspectionData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/trees/${treeId}/inspection`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(inspectionData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update inspection: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating inspection:', error);
      throw error;
    }
  },

  updateLifecycle: async (treeId, lifecycleData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/trees/${treeId}/lifecycle`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(lifecycleData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update lifecycle: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating lifecycle:', error);
      throw error;
    }
  },

  archiveTree: async (treeId) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const payload = { archivedBy: userData?.userId || 'web-admin' };
      const response = await fetch(`${API_BASE_URL}/api/trees/${treeId}/archive`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to archive tree: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error archiving tree:', error);
      throw error;
    }
  },

  // ===== FIELD NOTES / OBSERVATIONS =====

  getTreeObservations: async (treeId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/trees/${treeId}/observations`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch observations: ${response.status}`);
      }
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error fetching observations:', error);
      throw error;
    }
  },

  addObservation: async (treeId, observationData) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const payload = {
        ...observationData,
        observedBy: observationData.observedBy || userData?.userId || 'field-worker'
      };
      const response = await fetch(`${API_BASE_URL}/api/trees/${treeId}/observations`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to add observation: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error adding observation:', error);
      throw error;
    }
  },

  updateObservation: async (observationId, updates) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const payload = {
        ...updates,
        lastUpdatedBy: userData?.userId || 'field-worker'
      };
      const response = await fetch(`${API_BASE_URL}/api/observations/${observationId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update observation: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating observation:', error);
      throw error;
    }
  },

  deleteObservation: async (observationId) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const payload = { deletedBy: userData?.userId || 'field-worker' };
      const response = await fetch(`${API_BASE_URL}/api/observations/${observationId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to delete observation: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error deleting observation:', error);
      throw error;
    }
  },

  // ===== TREE HISTORY =====

  getTreeHistory: async (treeId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/trees/${treeId}/history`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch tree history: ${response.status}`);
      }
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error fetching tree history:', error);
      throw error;
    }
  },

  getAllTreeHistory: async (treeId, filters) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const url = `${API_BASE_URL}/api/trees/${treeId}/history/filtered${params ? `?${params}` : ''}`;
      const response = await fetch(url, { headers: getAuthHeaders() });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch filtered history: ${response.status}`);
      }
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error fetching filtered history:', error);
      throw error;
    }
  },

  // ===== ADDITIONAL OPERATIONS =====

  performInoculation: async (treeId, inoculationData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/trees/${treeId}/inoculate`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(inoculationData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to perform inoculation: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error performing inoculation:', error);
      throw error;
    }
  },

  getTreeStatusSummary: async (treeId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/trees/${treeId}/status`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch tree status: ${response.status}`);
      }
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error fetching tree status:', error);
      throw error;
    }
  },

  // ===== BATCH & SYNC OPERATIONS =====

  batchSync: async (syncData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sync/batch`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(syncData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to sync data: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error syncing data:', error);
      throw error;
    }
  },

  // ===== QUERY OPERATIONS =====

  getTreesByBlock: async (block) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/trees?block=${encodeURIComponent(block)}`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch trees by block: ${response.status}`);
      }
      const data = await response.json();
      return Array.isArray(data) ? data : (data.data || data.trees || []);
    } catch (error) {
      console.error('Error fetching trees by block:', error);
      throw error;
    }
  },

  getTreesByHealthStatus: async (status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/trees?healthStatus=${encodeURIComponent(status)}`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch trees by health status: ${response.status}`);
      }
      const data = await response.json();
      return Array.isArray(data) ? data : (data.data || data.trees || []);
    } catch (error) {
      console.error('Error fetching trees by health status:', error);
      throw error;
    }
  },

  getTreesReadyForAction: async (action) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/trees/ready/${action}`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch trees ready for ${action}: ${response.status}`);
      }
      const data = await response.json();
      return Array.isArray(data) ? data : (data.data || data.trees || []);
    } catch (error) {
      console.error(`Error fetching trees ready for ${action}:`, error);
      throw error;
    }
  },

  getTreeStatistics: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/trees/statistics`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch tree statistics: ${response.status}`);
      }
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error fetching tree statistics:', error);
      throw error;
    }
  },

  // ===== BLOCKCHAIN OPERATIONS =====

  // ✅ FIXED: Properly handles errors and response so button never hangs
  syncToPolygon: async () => {
    try {
      console.log("🔗 Initiating Blockchain Sync with Polygon...");
      const response = await fetch(`${API_BASE_URL}/api/blockchain/sync-polygon`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || `Blockchain sync failed: ${response.status}`);
      }

      console.log("✅ Blockchain sync completed:", data);
      return data;
    } catch (error) {
      console.error('❌ Error in syncToPolygon:', error);
      throw error;
    }
  },

  getBlockchainStatus: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/blockchain/status`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch blockchain status');
      return await response.json();
    } catch (error) {
      console.error('Error fetching blockchain status:', error);
      throw error;
    }
  },

  // ===== HELPER FUNCTIONS =====

  testConnection: async () => {
    try {
      console.log("🧪 Testing API connection...");
      const response = await fetch(`${API_BASE_URL}/api/trees`, {
        headers: getAuthHeaders()
      });
      const isConnected = response.ok;
      console.log(`✅ API ${isConnected ? 'connected' : 'not connected'}:`, response.status);
      return {
        connected: isConnected,
        status: response.status,
        statusText: response.statusText
      };
    } catch (error) {
      console.error("❌ API connection test failed:", error);
      return {
        connected: false,
        error: error.message
      };
    }
  }
};