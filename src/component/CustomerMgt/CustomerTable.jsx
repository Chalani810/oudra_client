import React, { useState, useEffect } from "react";
import {
  Trash,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ToggleLeft,
  ToggleRight,
  Eye,
  Edit,
} from "lucide-react";
import profileImg from "../CustomerProfile/CustomerMgtProfile.jpg";
import axios from "axios";
import { toast } from "react-hot-toast";
import ConfirmationModal from "../../component/ConfirmationModal";
import CustomerModal from "./CustomerModal";

const CustomerTable = () => {
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchUsers = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/auth/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          limit: pagination.limit,
          search,
        },
      });

      setUsers(response.data.users);
      setPagination({
        ...pagination,
        page,
        total: response.data.pagination.total,
        pages: response.data.pagination.pages,
      });
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/signin";
        return;
      }
      setError(error.response?.data?.message || "Failed to fetch users");
      console.error("Error fetching data:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      fetchUsers(pagination.page, searchTerm);
    }, 5000);

    return () => clearInterval(refreshInterval);
  }, [pagination.page, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(1, searchTerm);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchUsers(newPage, searchTerm);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${apiUrl}/auth/users/${userId}/toggle-status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUsers(pagination.page, searchTerm);
      toast.success("User status updated successfully");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to toggle user status");
      console.error("Error toggling user status:", error);
      toast.error("Failed to update user status");
    }
  };

  const handleDeleteClick = (userId) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      setIsDeleting(true);
      const token = localStorage.getItem("token");
      await axios.delete(`${apiUrl}/auth/users/${userToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchUsers(pagination.page, searchTerm);
      toast.success("User deleted successfully");
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/signin";
        return;
      }
      setError(error.response?.data?.message || "Failed to delete user");
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const handleView = (user) => {
    setSelectedCustomer(user);
  };

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/customer_report`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      //Download link for the PDF
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Customer_Report.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate customer report");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (isActive) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  if (loading && users.length === 0) {
    return (
      <div className="mb-6 p-3 bg-blue-100 text-blue-700 rounded-lg border border-blue-200 flex items-center">
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-700"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Loading users...
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="max-w-full mx-auto bg-gray-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-gray-100 mb-8 p-1 gap-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Customer Management
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={handleGenerateReport}
            disabled={isGeneratingReport}
            className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 ${
              isGeneratingReport ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isGeneratingReport ? "Exporting..." : "Export"}
          </button>
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4 pr-4 py-2 border border-gray-300 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
          />
        </div>
      </div>

      {filteredUsers.length === 0 && !loading ? (
        <div className="w-full text-center p-8">
          <p className="text-gray-500">No customers found</p>
        </div>
      ) : isMobile ? (
        // Mobile view - cards
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="bg-white p-4 rounded-xl shadow-sm border border-white"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <img
                    src={
                      user.profilePicture
                        ? `${apiUrl}/uploads/${user.profilePicture}`
                        : profileImg
                    }
                    alt="avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{`${user.firstName} ${user.lastName}`}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                    user.isActive
                  )}`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">User ID</p>
                  <p className="text-gray-700">{user.userId || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="text-gray-700">
                    {user.phone || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Points</p>
                  <p className="text-gray-700">{user.loyaltyPoints || 0}</p>
                </div>
                <div>
                  <p className="text-gray-500">Joined</p>
                  <p className="text-gray-700">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex justify-end space-x-2">
                <button
                  onClick={() => handleView(user)}
                  className="text-blue-500 hover:text-blue-700 p-1"
                  aria-label="View user"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => handleToggleStatus(user._id)}
                  className="text-green-500 hover:text-green-700 p-1"
                  aria-label="Toggle status"
                >
                  {user.isActive ? (
                    <ToggleRight size={18} />
                  ) : (
                    <ToggleLeft size={18} />
                  )}
                </button>
                <button
                  onClick={() => handleDeleteClick(user._id)}
                  className="text-red-500 hover:text-red-700 p-1"
                  aria-label="Delete user"
                  disabled={isDeleting}
                >
                  <Trash size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Desktop view - table
        <div className="w-full overflow-x-auto rounded-xl shadow-sm">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-red-100 text-left border-b border-red-200">
                <th className="p-4 text-left font-medium">Customer</th>
                <th className="p-4 text-left font-medium">User ID</th>
                <th className="p-4 text-left font-medium">Phone</th>
                <th className="p-4 text-left font-medium">Address</th>
                <th className="p-4 text-left font-medium">Status</th>
                <th className="p-4 text-right font-medium">Points</th>
                <th className="p-4 text-left font-medium">Date Added</th>
                <th className="p-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-b hover:bg-gray-50 bg-white"
                >
                  <td className="p-4 flex items-center space-x-3">
                    <img
                      src={
                        user.profilePicture
                          ? `${apiUrl}/uploads/${user.profilePicture}`
                          : profileImg
                      }
                      alt="avatar"
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{`${user.firstName} ${user.lastName}`}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="p-4">{user.userId || "N/A"}</td>
                  <td className="p-4">{user.phone || "Not provided"}</td>
                  <td className="p-4">
                    {user.address
                      ? `${user.address.street || ""}, ${
                          user.address.city || ""
                        }`
                      : "Not provided"}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                        user.isActive
                      )}`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4 text-right">{user.loyaltyPoints || 0}</td>
                  <td className="p-4">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 flex justify-center space-x-2">
                    <button
                      onClick={() => handleView(user)}
                      className="text-blue-500 hover:text-blue-700 p-1"
                      aria-label="View user"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(user._id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      aria-label="Delete user"
                      disabled={isDeleting}
                    >
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {filteredUsers.length > 0 && (
        <div className="mt-4 flex justify-center items-center gap-4">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50"
          >
            <ChevronLeft />
          </button>
          <span className="text-sm">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50"
          >
            <ChevronRight />
          </button>
        </div>
      )}

      {showDeleteModal && (
        <ConfirmationModal
          isOpen={showDeleteModal}
          onCancel={() => {
            setShowDeleteModal(false);
            setUserToDelete(null);
          }}
          onConfirm={handleDelete}
          title="Confirm Deletion"
          message="Are you sure you want to delete this user? This action cannot be undone."
          confirmText={isDeleting ? "Deleting..." : "Delete"}
          confirmColor="red"
        />
      )}
      {selectedCustomer && (
        <CustomerModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}

      {/* User Detail Modal would go here */}
    </div>
  );
};

export default CustomerTable;
