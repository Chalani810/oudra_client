import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash, FaUsers } from "react-icons/fa";

const OrderRow = ({
  order,
  onStatusChange,
  onDelete,
  onView,
  onEdit,
  onAssignEmployees,
}) => {
  const [status, setStatus] = useState(order?.status || "Pending");
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  
  // Sync status with order prop
  useEffect(() => {
    if (order?.status && order.status !== status) {
      setStatus(order.status);
    }
  }, [order?.status]);

  if (!order) {
    return null;
  }

  // Get event name from cart
  const eventName = order.cart?.eventId?.title || 
                   (order.cart?.eventId ? `Event #${order.cart.eventId.toString().slice(-4)}` : 
                   "No event specified");

  return (
    <tr className="border-b hover:bg-gray-50 transition flex flex-col md:table-row bg-white">
      {/* Order ID - Always visible */}
      <td className="px-4 py-3 font-medium md:font-normal">
        <span className="md:hidden">Order #</span>
        {order.orderId || "N/A"}
      </td>

      {/* Event Name - Now properly showing from cart */}
      <td className="px-4 py-3">
        <span className="md:hidden font-medium">Event: </span>
        {eventName}
      </td>

      <td className="px-4 py-3 hidden md:table-cell">
        {order?.eventDate
          ? new Date(order.eventDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "N/A"}
      </td>

      {/* Amounts - Stacked on mobile */}
      <td className="px-4 py-3">
        <div className="flex flex-col md:block">
          <span className="md:hidden font-medium">Total: </span>
          <span className="text-right">
            {Number(order.cartTotal || 0).toFixed(2)}
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-col md:block">
          <span className="md:hidden font-medium">Advance: </span>
          <span className="text-right">
            {Number(order.advancePayment || 0).toFixed(2)}
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-col md:block">
          <span className="md:hidden font-medium">Balance: </span>
          <span className="text-right">
            {Number(
              (order.cartTotal || 0) - (order.advancePayment || 0)
            ).toFixed(2)}
          </span>
        </div>
      </td>

      {/* Status - Always visible */}
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium w-24 ${
            order.status === "Completed"
              ? "bg-green-100 text-green-800"
              : order.status === "Confirmed"
              ? "bg-blue-100 text-blue-800"
              : order.status === "Pending"
              ? "bg-yellow-100 text-yellow-800"
              : order.status === "Cancelled"
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {order.status}
        </span>
      </td>

      {/* Action Buttons - Always visible */}
      <td className="px-4 py-3 flex justify-end md:justify-start gap-3">
        <button
          onClick={() => onView?.(order)}
          className="text-blue-600 hover:text-blue-800"
          title="View Order"
        >
          <FaEye className="w-4 h-4" />
        </button>
        <button
          onClick={() => onEdit?.(order)}
          className="text-black-600 hover:text-black-800"
          title="Edit Order"
        >
          <FaEdit className="w-4 h-4" />
        </button>
        {order.status === "Cancelled" && (
          <button
            onClick={() => onDelete?.(order._id)}
            className="text-red-600 hover:text-red-800"
            title="Delete Order"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        )}
      </td>
    </tr>
  );
};

export default OrderRow;