import React, { useEffect, useState } from "react";
import OrderRow from "./OrderRow";
import OrderModal from "./OrderModal";
import ConfirmationModal from "../../component/ConfirmationModal";
import EditOrderModal from "./EditOrderModal";
import axios from "axios";
import { toast } from "react-hot-toast";

const OrderTable = () => {
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/checkout/getAll`);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setOrders([]);
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = (id, status) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === id ? { ...order, status } : order
      )
    );
  };

  const handleView = (order) => {
    setSelectedOrder(order);
  };

  const handleDeleteClick = (order) => {
    if (order.status !== "Cancelled") {
      toast.error("Only cancelled orders can be deleted");
      return;
    }
    setOrderToDelete(order);
    setDeleting(true);
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
  };

  const handleDelete = async (id) => {
    try {
      // Double check status before deleting (extra safety)
      const order = orders.find(o => o._id === id);
      if (order?.status !== "Cancelled") {
        toast.error("Only cancelled orders can be deleted");
        return;
      }

      await axios.delete(`${apiUrl}/checkout/delete/${id}`);
      fetchOrders();
      toast.success("Order deleted successfully");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
    } finally {
      setDeleting(false);
      setOrderToDelete(null);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      (order.orderId?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (order.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (order.status?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const handleDownloadOrderReport = async () => {
    try {
      const response = await axios.get(`${apiUrl}/order_report/orders`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "order_report.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download order report PDF");
    }
  };

  return (
    <div className="max-w-full mx-auto bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-50 mb-8 p-1">
        <h1 className="text-2xl font-semibold text-gray-800">
          Order Management
        </h1>

        <div className="flex gap-4">
          <button
            onClick={handleDownloadOrderReport}
            className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-400"
          >
            Export
          </button>

          <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-4 pr-4 py-2 border border-gray-300 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {isLoading && (
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
          Loading orders...
        </div>
      )}

      {filteredOrders.length === 0 && !isLoading ? (
        <div className="w-full text-center p-8">
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : isMobile ? (
        // Mobile view - cards
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-800">
                    Order #{order.orderId || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.eventName || "N/A"}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Date</p>
                  <p className="text-gray-700">{order.eventDate || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total</p>
                  <p className="text-gray-700">
                    Rs {Number(order.cartTotal || 0).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Advance</p>
                  <p className="text-gray-700">
                    Rs {Number(order.advancePayment || 0).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Due</p>
                  <p className="text-gray-700">
                    Rs{" "}
                    {Number(
                      (order.cartTotal || 0) - (order.advancePayment || 0)
                    ).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex justify-end space-x-2">
                <button
                  onClick={() => handleView(order)}
                  className="text-blue-500 hover:text-blue-700 p-1"
                  aria-label="View order"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleEdit(order)}
                  className="text-green-500 hover:text-green-700 p-1"
                  aria-label="Edit order"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                {order.status === "Cancelled" && (
                  <button
                    onClick={() => handleDeleteClick(order)}
                    className="text-red-500 hover:text-red-700 p-1"
                    aria-label="Delete order"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
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
                <th className="p-4 text-left font-medium">Order ID</th>
                <th className="p-4 text-left font-medium">Event Name</th>
                <th className="p-4 text-left font-medium">Event Date</th>
                <th className="p-4 text-right font-medium">Full Amount (Rs)</th>
                <th className="p-4 text-right font-medium">Advance (Rs)</th>
                <th className="p-4 text-right font-medium">Due (Rs)</th>
                <th className="p-4 text-center font-medium">Status</th>
                <th className="p-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <OrderRow
                  key={order._id}
                  order={order}
                  onView={() => handleView(order)}
                  onEdit={() => handleEdit(order)}
                  onDelete={() => handleDeleteClick(order)}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {deleting && (
        <ConfirmationModal
          isOpen={deleting}
          onCancel={() => {
            setDeleting(false);
            setOrderToDelete(null);
          }}
          onConfirm={() => {
            handleDelete(orderToDelete._id);
          }}
          message="Are you sure you want to delete this cancelled order?"
        />
      )}

      {editingOrder && (
        <EditOrderModal
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onStatusChange={handleStatusChange}
          refresh={fetchOrders}
        />
      )}
    </div>
  );
};

// Helper function for status colors
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

export default OrderTable;