//path: oudra-client(web app front end)/src/services/treeService.js

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

  // UPDATE a tree
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

  // UPDATE tree profile (specific fields)
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

  // UPDATE NFC Tag
  updateNFCTag: async (treeId, nfcTagId) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const payload = {
        nfcTagId,
        assignedBy: userData?.userId || 'web-admin'
      };

      const response = await fetch(`${API_BASE_URL}/trees/${treeId}/nfc`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) throw new Error('Failed to update NFC tag');
      return await response.json();
    } catch (error) {
      console.error('Error updating NFC tag:', error);
      throw error;
    }
  },

  // UPDATE GPS
  updateGPS: async (treeId, gpsData) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const payload = {
        gps: gpsData,
        updatedBy: userData?.userId || 'web-admin'
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

  // ADD observation
  addObservation: async (treeId, observationData) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const payload = {
        ...observationData,
        observedBy: userData?.userId || 'field-worker'
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
  }
};