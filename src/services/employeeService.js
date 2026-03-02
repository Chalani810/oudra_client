// oudra_client/src/services/employeeService.js
//  1. Added createLoginAccount() — calls POST /auth/create-account with manager's JWT token
//  2. Added checkLoginAccount() — calls GET /auth/users to check if a login account already exists for an employee email
//  3. Fixed createEmployee() — profileImg field name corrected (was "file", should match multer field "profileImg")
//  4. FIXED: getAuthHeaders() now used in ALL methods (getAllEmployees, createEmployee, updateEmployee, deleteEmployee)

import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Helper: get auth headers using the manager's token stored in localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const employeeService = {
  getAllEmployees: async () => {
    try {
      const response = await axios.get(`${API_URL}/employee`, getAuthHeaders());
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

      // FIXED: field name matches multer config in employeeRoutes.js ("profileImg")
      if (employeeData.profileImg) {
        formData.append("profileImg", employeeData.profileImg);
      }

      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_URL}/employee`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
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
      if (employeeData.isActive !== undefined) {
        formData.append("isActive", employeeData.isActive);
      }
      if (employeeData.profileImg) {
        formData.append("profileImg", employeeData.profileImg);
      }

      const token = localStorage.getItem("token");
      const response = await axios.put(`${API_URL}/employee/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
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
      const response = await axios.delete(`${API_URL}/employee/${id}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("Error deleting employee:", error);
      throw error;
    }
  },

  // Creates a login account in the users collection for an existing employee
  createLoginAccount: async (linkedRecordId) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/create-account`,
        {
          linkedRecordId,
          role: "fieldworker",
        },
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("Error creating login account:", error);
      throw error;
    }
  },

  // Check if a login account already exists for a given email
  checkLoginAccount: async (email) => {
    try {
      const response = await axios.get(
        `${API_URL}/auth/users?search=${encodeURIComponent(email)}&role=fieldworker`,
        getAuthHeaders()
      );
      const users = response.data?.users || [];
      const exists = users.some(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      return { exists };
    } catch (error) {
      console.error("Error checking login account:", error);
      return { exists: false };
    }
  },
};
