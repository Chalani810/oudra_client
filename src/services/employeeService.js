// oudra-client/src/services/employeeService.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const employeeService = {
  getAllEmployees: async () => {
    try {
      const response = await axios.get(`${API_URL}/employee`);
      return response.data;
    } catch (error) {
      console.error("Error fetching employees:", error);
      throw error;
    }
  },

  createEmployee: async (employeeData) => {
    try {
      const formData = new FormData();
      formData.append("name", employeeData.name);
      formData.append("email", employeeData.email);
      formData.append("phone", employeeData.phone);
      formData.append("occupation", employeeData.occupation);
      
      if (employeeData.file) {
        formData.append("profileImg", employeeData.file);
      }

      const response = await axios.post(`${API_URL}/employee`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating employee:", error);
      throw error;
    }
  },

  updateEmployee: async (id, employeeData) => {
    try {
      const formData = new FormData();
      formData.append("name", employeeData.name);
      formData.append("email", employeeData.email);
      formData.append("phone", employeeData.phone);
      formData.append("occupation", employeeData.occupation);
      
      if (employeeData.file) {
        formData.append("profileImg", employeeData.file);
      }

      const response = await axios.put(`${API_URL}/employee/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating employee:", error);
      throw error;
    }
  },

  deleteEmployee: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/employee/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting employee:", error);
      throw error;
    }
  },
};