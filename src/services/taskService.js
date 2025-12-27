// oudra-client/src/services/taskService.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const taskService = {
  getAllTasks: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/api/tasks`, { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  },

  getTaskById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/api/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching task:", error);
      throw error;
    }
  },

  createTask: async (taskData) => {
    try {
      const response = await axios.post(`${API_URL}/api/tasks`, taskData);
      return response.data;
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  },

  updateTask: async (id, taskData) => {
    try {
      const response = await axios.put(`${API_URL}/api/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  },

  deleteTask: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/api/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  },

  getTaskStats: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/tasks/stats`);
      return response.data;
    } catch (error) {
      console.error("Error fetching task stats:", error);
      throw error;
    }
  },

  updateTaskStatus: async (id, statusData) => {
    try {
      const response = await axios.put(`${API_URL}/api/tasks/${id}/status`, statusData);
      return response.data;
    } catch (error) {
      console.error("Error updating task status:", error);
      throw error;
    }
  }
};