import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import OrderModal from "../component/AdminOrder/OrderModal";
import FeedbackModal from "../component/Feedback/FeedbackModal";
import { useNavigate } from "react-router-dom";

const OrderHistory = () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [currentEmployees, setCurrentEmployees] = useState([]);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/orders/user/${userData.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error(
        error.response?.data?.message || "Failed to load order history"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Confirmed":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const showEmployeeDetails = (employees) => {
    setCurrentEmployees(employees);
    setEmployeeModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-700">No orders found</h3>
        <p className="mt-2 text-gray-500">You haven't placed any orders yet.</p>
      </div>
    );
  }

  const handleAddFeedback = (orderId) => {
    setSelectedOrder(orderId);
    setModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Your Order History
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-5 flex flex-col justify-between h-full">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Order #{order.orderId}
                  </h3>
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <span>{order.cart?.eventId?.title || "N/A"}</span>
                  </div>

                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>
                      {order.eventDate ? formatDate(order.eventDate) : "N/A"}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span>Guests: {order.guestCount || "N/A"}</span>
                  </div>
                </div>

                {(order.status === "Completed" ||
                  order.status === "Confirmed") && (
                  <div className="mt-3">
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center mb-1">
                        <svg
                          className="w-4 h-4 mr-2 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12V8a3 3 0 016 0v4m-3 4v4m5 0H7m12 0a2 2 0 01-2 2H7a2 2 0 01-2-2m14 0v-1a5 5 0 00-10 0v1"
                          />
                        </svg>

                        <span className="font-medium">Assigned Staff:</span>
                        {order.employees && order.employees.length > 0 && (
                          <button
                            onClick={() => showEmployeeDetails(order.employees)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                      {order.status == "Completed" && !order.hasFeedback ? (
                        <div className="flex items-center justify-end">
                          <button
                            type="button"
                            className="text-sm text-red-600 font-medium flex items-center space-x-1"
                            onClick={() => handleAddFeedback(order._id)}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.84L3 20l1.09-3.27A8.969 8.969 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                              />
                            </svg>
                            <span>Add Feedback</span>
                          </button>
                        </div>
                      ) : null}
                      {order.status == "Completed" && order.hasFeedback ? (
                        <div className="flex items-center justify-end">
                          <button
                            type="button"
                            className="text-sm text-blue-600 font-medium flex items-center space-x-1"
                            onClick={() => {
                              navigate("/feedback");
                            }}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.84L3 20l1.09-3.27A8.969 8.969 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                              />
                            </svg>
                            <span>View Feedbacks</span>
                          </button>
                        </div>
                      ) : null}{" "}
                    </div>
                    {order.employees && order.employees.length > 0 ? (
                      <div className="ml-6">
                        <div className="flex items-center">
                          <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                          <span className="text-sm">
                            {order.employees.length} staff members
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="ml-6 text-gray-500 text-sm">
                        No staff assigned
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3 text-center my-4">
                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-xs text-gray-500">Total</p>
                  <p className="font-medium">
                    Rs {order.cartTotal?.toFixed(2) || "0.00"}
                  </p>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <p className="text-xs text-blue-500">Paid</p>
                  <p className="font-medium text-blue-600">
                    Rs {order.advancePayment?.toFixed(2) || "0.00"}
                  </p>
                </div>
                <div className="bg-orange-50 p-2 rounded">
                  <p className="text-xs text-orange-500">Due</p>
                  <p className="font-medium text-orange-600">
                    Rs {order.duepayment?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Feedback Modal */}
      {modalOpen && (
        <FeedbackModal
          isEdit={false}
          feedback={null}
          onClose={() => setModalOpen(false)}
          onRefresh={fetchOrders}
          orderId={selectedOrder}
        />
      )}

      {/* Employee Details Modal */}
      {employeeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Assigned Staff Details</h3>
              <button
                onClick={() => setEmployeeModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {currentEmployees.map((employee) => (
                <div
                  key={employee._id}
                  className="border-b border-gray-200 pb-4 last:border-0"
                >
                  <div className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <svg
                        className="w-5 h-5 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">{employee.name}</h4>
                      <p className="text-sm text-gray-600">
                        {employee.occupation?.title || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        <span className="font-medium">ID:</span>{" "}
                        {employee.empId}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Phone:</span>{" "}
                        {employee.phone}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setEmployeeModalOpen(false)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
