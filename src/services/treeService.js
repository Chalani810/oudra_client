// path: oudra-client/src/services/treeService.js
const API_BASE_URL = 'http://localhost:5000';

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
  
  // GET all trees
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
      
      if (Array.isArray(data)) {
        console.log(`✅ Found ${data.length} trees`);
        return data;
      }
      if (data.data && Array.isArray(data.data)) {
        console.log(`✅ Found ${data.data.length} trees in data property`);
        return data.data;
      }
      if (data.trees && Array.isArray(data.trees)) {
        console.log(`✅ Found ${data.trees.length} trees in trees property`);
        return data.trees;
      }
      if (data.success && Array.isArray(data.data)) {
        console.log(`✅ Found ${data.data.length} trees in success.data`);
        return data.data;
      }
      
      console.error("⚠️ Unexpected response format:", data);
      return [];
      
    } catch (error) {
      console.error("❌ Error fetching trees:", error);
      return [];
    }
  },

  // GET single tree
  getTreeById: async (treeId) => {
    try {
      console.log(`🔍 Fetching tree ${treeId} from:`, `${API_BASE_URL}/api/trees/${treeId}`);
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

  // CREATE a new tree
  createTree: async (treeData) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const payload = {
        ...treeData,
        lastUpdatedBy: userData?.userId || 'web-admin'
      };

      console.log("📝 Creating tree with:", payload);
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

  // UPDATE a tree (Web App - Manager updates)
  updateTree: async (treeId, updates) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const payload = {
        ...updates,
        lastUpdatedBy: userData?.userId || 'web-admin'
      };

      console.log(`✏️ Updating tree ${treeId}:`, payload);
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

  // DELETE a tree permanently
  deleteTree: async (treeId) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const payload = {
        deletedBy: userData?.userId || 'web-admin'
      };

      console.log(`🗑️ Deleting tree ${treeId}`);
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

  // UPDATE tree profile (specific fields - Web App)
  updateTreeProfile: async (treeId, profileData) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const payload = {
        ...profileData,
        lastUpdatedBy: userData?.userId || 'web-admin'
      };

      console.log(`📋 Updating tree profile ${treeId}:`, payload);
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

  // MOBILE APP update (for field workers)
  mobileUpdateTree: async (treeId, updates) => {
    try {
      console.log(`📱 Mobile updating tree ${treeId}:`, updates);
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

  // Mobile update tree profile
  mobileUpdateTreeProfile: async (treeId, updates) => {
    try {
      console.log(`📱 Mobile updating tree profile ${treeId}:`, updates);
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

  // UPDATE NFC tag (Mobile App only)
  updateNFCTag: async (treeId, nfcTagId, assignedBy) => {
    try {
      const payload = {
        nfcTagId,
        assignedBy: assignedBy || 'field-worker',
        deviceType: 'mobile'
      };

      console.log(`🏷️ Updating NFC for tree ${treeId}:`, payload);
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

  // UPDATE GPS (for mobile app)
  updateGPS: async (treeId, gpsData, updatedBy) => {
    try {
      const payload = {
        gps: gpsData,
        updatedBy: updatedBy || 'field-worker'
      };

      console.log(`📍 Updating GPS for tree ${treeId}:`, payload);
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

  // UPDATE inspection
  updateInspection: async (treeId, inspectionData) => {
    try {
      console.log(`🔍 Updating inspection for tree ${treeId}:`, inspectionData);
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

  // UPDATE lifecycle
  updateLifecycle: async (treeId, lifecycleData) => {
    try {
      console.log(`🌱 Updating lifecycle for tree ${treeId}:`, lifecycleData);
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

  // ARCHIVE tree (soft delete)
  archiveTree: async (treeId) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const payload = {
        archivedBy: userData?.userId || 'web-admin'
      };

      console.log(`📁 Archiving tree ${treeId}`);
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

  // GET tree observations
  getTreeObservations: async (treeId) => {
    try {
      console.log(`📝 Fetching observations for tree ${treeId}`);
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

  // ADD observation
  addObservation: async (treeId, observationData) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const payload = {
        ...observationData,
        observedBy: observationData.observedBy || userData?.userId || 'field-worker'
      };

      console.log(`➕ Adding observation to tree ${treeId}:`, payload);
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

  // UPDATE observation
  updateObservation: async (observationId, updates) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const payload = {
        ...updates,
        lastUpdatedBy: userData?.userId || 'field-worker'
      };

      console.log(`✏️ Updating observation ${observationId}:`, payload);
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

  // DELETE observation
  deleteObservation: async (observationId) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const payload = {
        deletedBy: userData?.userId || 'field-worker'
      };

      console.log(`🗑️ Deleting observation ${observationId}`);
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

  // GET tree history
  getTreeHistory: async (treeId) => {
    try {
      console.log(`📜 Fetching history for tree ${treeId}`);
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

  // GET filtered tree history
  getAllTreeHistory: async (treeId, filters) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const url = `${API_BASE_URL}/api/trees/${treeId}/history/filtered${params ? `?${params}` : ''}`;
      
      console.log(`🔍 Fetching filtered history for tree ${treeId}:`, url);
      const response = await fetch(url, {
        headers: getAuthHeaders()
      });
      
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

  // Perform inoculation
  performInoculation: async (treeId, inoculationData) => {
    try {
      console.log(`💉 Performing inoculation for tree ${treeId}:`, inoculationData);
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

  // Get tree status summary
  getTreeStatusSummary: async (treeId) => {
    try {
      console.log(`📊 Fetching status summary for tree ${treeId}`);
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

  // Sync offline data from mobile app
  batchSync: async (syncData) => {
    try {
      console.log("🔄 Syncing offline data:", syncData);
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

  // Get trees by block
  getTreesByBlock: async (block) => {
    try {
      console.log(`🔍 Fetching trees in block: ${block}`);
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

  // Get trees by health status
  getTreesByHealthStatus: async (status) => {
    try {
      console.log(`🔍 Fetching trees with health status: ${status}`);
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

  // Get trees ready for action
  getTreesReadyForAction: async (action) => {
    try {
      console.log(`🔍 Fetching trees ready for: ${action}`);
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

  // Get tree statistics
  getTreeStatistics: async () => {
    try {
      console.log("📈 Fetching tree statistics");
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

  // ===== HELPER FUNCTIONS =====

  // Test API connection
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
