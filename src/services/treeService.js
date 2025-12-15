// path: oudra-client/src/services/treeService.js
const API_BASE_URL = 'http://localhost:5000/api';

export const treeService = {
  // GET all trees
  getAllTrees: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/trees`);
      if (!response.ok) throw new Error('Failed to fetch trees');
      return await response.json();
    } catch (error) {
      console.error('Error fetching trees:', error);
      throw error;
    }
  },

  // GET single tree
  getTreeById: async (treeId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/trees/${treeId}`);
      if (!response.ok) throw new Error('Failed to fetch tree');
      return await response.json();
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

      const response = await fetch(`${API_BASE_URL}/trees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) throw new Error('Failed to create tree');
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

      const response = await fetch(`${API_BASE_URL}/trees/${treeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) throw new Error('Failed to update tree');
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
      
      const response = await fetch(`${API_BASE_URL}/trees/${treeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deletedBy: userData?.userId || 'web-admin'
        }),
      });
      
      if (!response.ok) throw new Error('Failed to delete tree');
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

      const response = await fetch(`${API_BASE_URL}/trees/${treeId}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) throw new Error('Failed to update tree profile');
      return await response.json();
    } catch (error) {
      console.error('Error updating tree profile:', error);
      throw error;
    }
  },

  // MOBILE APP update (for field workers) - Web app should NOT use this
  mobileUpdateTree: async (treeId, updates) => {
    try {
      const response = await fetch(`${API_BASE_URL}/trees/${treeId}/mobile-update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) throw new Error('Failed to update tree via mobile');
      return await response.json();
    } catch (error) {
      console.error('Error updating tree via mobile:', error);
      throw error;
    }
  },

  // UPDATE NFC tag (Mobile App only - for field workers)
  updateNFCTag: async (treeId, nfcTagId, assignedBy) => {
    try {
      const response = await fetch(`${API_BASE_URL}/trees/${treeId}/nfc`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nfcTagId,
          assignedBy: assignedBy || 'field-worker',
          deviceType: 'mobile'
        }),
      });
      
      if (!response.ok) throw new Error('Failed to update NFC tag');
      return await response.json();
    } catch (error) {
      console.error('Error updating NFC tag:', error);
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

      const response = await fetch(`${API_BASE_URL}/trees/${treeId}/archive`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) throw new Error('Failed to archive tree');
      return await response.json();
    } catch (error) {
      console.error('Error archiving tree:', error);
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

      const response = await fetch(`${API_BASE_URL}/trees/${treeId}/gps`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) throw new Error('Failed to update GPS');
      return await response.json();
    } catch (error) {
      console.error('Error updating GPS:', error);
      throw error;
    }
  },

  // GET tree observations
  getTreeObservations: async (treeId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/trees/${treeId}/observations`);
      if (!response.ok) throw new Error('Failed to fetch observations');
      return await response.json();
    } catch (error) {
      console.error('Error fetching observations:', error);
      throw error;
    }
  },

  // GET tree history
  getTreeHistory: async (treeId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/trees/${treeId}/history`);
      if (!response.ok) throw new Error('Failed to fetch tree history');
      return await response.json();
    } catch (error) {
      console.error('Error fetching tree history:', error);
      throw error;
    }
  },

  // ADD observation (for mobile app)
  addObservation: async (treeId, observationData) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const payload = {
        ...observationData,
        observedBy: observationData.observedBy || userData?.userId || 'field-worker'
      };

      const response = await fetch(`${API_BASE_URL}/trees/${treeId}/observations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) throw new Error('Failed to add observation');
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

      const response = await fetch(`${API_BASE_URL}/observations/${observationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) throw new Error('Failed to update observation');
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
      
      const response = await fetch(`${API_BASE_URL}/observations/${observationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deletedBy: userData?.userId || 'field-worker'
        }),
      });
      
      if (!response.ok) throw new Error('Failed to delete observation');
      return await response.json();
    } catch (error) {
      console.error('Error deleting observation:', error);
      throw error;
    }
  },

  // Perform inoculation (for mobile app)
  performInoculation: async (treeId, inoculationData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/trees/${treeId}/inoculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inoculationData),
      });
      
      if (!response.ok) throw new Error('Failed to perform inoculation');
      return await response.json();
    } catch (error) {
      console.error('Error performing inoculation:', error);
      throw error;
    }
  },

  // Update inspection (for mobile app)
  updateInspection: async (treeId, inspectionData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/trees/${treeId}/inspection`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inspectionData),
      });
      
      if (!response.ok) throw new Error('Failed to update inspection');
      return await response.json();
    } catch (error) {
      console.error('Error updating inspection:', error);
      throw error;
    }
  },

  // Get tree status summary
  getTreeStatusSummary: async (treeId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/trees/${treeId}/status`);
      if (!response.ok) throw new Error('Failed to fetch tree status');
      return await response.json();
    } catch (error) {
      console.error('Error fetching tree status:', error);
      throw error;
    }
  },

  // Sync offline data from mobile app
  batchSync: async (syncData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sync/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(syncData),
      });
      
      if (!response.ok) throw new Error('Failed to sync data');
      return await response.json();
    } catch (error) {
      console.error('Error syncing data:', error);
      throw error;
    }
  },

  // NEW: Get trees by block
  getTreesByBlock: async (block) => {
    try {
      const response = await fetch(`${API_BASE_URL}/trees?block=${encodeURIComponent(block)}`);
      if (!response.ok) throw new Error('Failed to fetch trees by block');
      return await response.json();
    } catch (error) {
      console.error('Error fetching trees by block:', error);
      throw error;
    }
  },

  // NEW: Get trees by health status
  getTreesByHealthStatus: async (status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/trees?status=${encodeURIComponent(status)}`);
      if (!response.ok) throw new Error('Failed to fetch trees by health status');
      return await response.json();
    } catch (error) {
      console.error('Error fetching trees by health status:', error);
      throw error;
    }
  },

  // NEW: Get trees ready for action
  getTreesReadyForAction: async (action) => {
    try {
      const response = await fetch(`${API_BASE_URL}/trees/ready/${action}`);
      if (!response.ok) throw new Error(`Failed to fetch trees ready for ${action}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching trees ready for ${action}:`, error);
      throw error;
    }
  },

  // NEW: Get tree statistics
  getTreeStatistics: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/trees/statistics`);
      if (!response.ok) throw new Error('Failed to fetch tree statistics');
      return await response.json();
    } catch (error) {
      console.error('Error fetching tree statistics:', error);
      throw error;
    }
  }
};