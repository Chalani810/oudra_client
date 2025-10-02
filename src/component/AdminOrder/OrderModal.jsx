import React from "react";

const OrderModal = ({ order, onClose }) => {
  const getStatusClasses = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700 border border-green-300"; // Green for Completed
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border border-yellow-300"; // Yellow for Pending
      case "Rejected":
        return "bg-red-100 text-red-700 border border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-300";
    }
  };

  const getHeadingClasses = (status) => {
    switch (status) {
      case "Completed":
        return "text-green-700"; // Green for Completed
      case "Pending":
        return "text-yellow-700"; // Yellow for Pending
      case "Rejected":
        return "text-red-700"; // Red for Rejected
      default:
        return "text-gray-700";
    }
  };

  const statusClasses = getStatusClasses(order.status); // Get the status classes
  const headingClasses = getHeadingClasses(order.status); // Get the heading classes

  const duePayment =
    order.cartTotal && order.advancePayment
      ? order.totalAmount - order.advancePayment
      : 0;

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-start justify-center z-50 overflow-y-auto py-8 transition-all"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl my-8 mx-4 overflow-hidden border border-gray-100">
        {/* Header - Sticky with subtle gradient */}
        <div className="sticky top-0 bg-gradient-to-b from-white to-white/90 z-10 px-6 py-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-semibold text-gray-800">
              Order Details
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
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
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(100vh-12rem)] space-y-6">
          {/* Customer Information Section */}
          <div className="bg-gray-50 rounded-lg p-5">
            <h4
              className={`text-lg font-medium text-gray-700 mb-4 flex items-center`}
            >
              <svg
                className="w-5 h-5 mr-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Order Status
            </h4>
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-opacity-10 ${statusClasses}">
              <span
                className={`w-2 h-2 rounded-full mr-2 ${statusClasses.replace(
                  "bg-opacity-10",
                  ""
                )}`}
              ></span>
              {order.status}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-5">
            <h4
              className={`text-lg font-medium text-gray-700 mb-4 flex items-center`}
            >
              <svg
                className="w-5 h-5 mr-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Customer Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <p className="text-gray-600">
                  <span className="font-medium text-gray-700">Name:</span>{" "}
                  <span className="text-gray-800">
                    {order.firstName} {order.lastName}
                  </span>
                </p>
                <p className="text-gray-600">
                  <span className="font-medium text-gray-700">Email:</span>{" "}
                  <span className="text-gray-800 break-all">{order.email}</span>
                </p>
                <p className="text-gray-600">
                  <span className="font-medium text-gray-700">Phone:</span>{" "}
                  <span className="text-gray-800">
                    {order.telephone || order.mobile || "—"}
                  </span>
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-gray-600">
                  <span className="font-medium text-gray-700">
                    Contact Method:
                  </span>{" "}
                  <span className="text-gray-800 capitalize">
                    {order.contactMethod}
                  </span>
                </p>
                <div className="space-y-3">
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-700">
                      Participated Guests Count:
                    </span>{" "}
                    <span className="text-gray-800 capitalize">
                      {order.guestCount}
                    </span>
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-700">
                      Event Date:
                    </span>{" "}
                    <span className="text-gray-800 capitalize">
                      {order.eventDate}
                    </span>
                  </p>
                </div>

                <p className="text-gray-600 md:col-span-2">
                  <span className="font-medium text-gray-700">Address:</span>{" "}
                  <span className="text-gray-800">
                    {order.address || "Not provided"}
                  </span>
                </p>
              </div>
              <p className="md:col-span-2 text-gray-600">
                <span className="font-medium text-gray-700">Comments:</span>{" "}
                <span className="text-gray-800 italic">
                  {order.comment || "No additional comments"}
                </span>
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-5">
            <h4 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Cart Items
            </h4>
            {order.cart?.items && order.cart?.items.length > 0 ? (
              <div className="space-y-4">
                {order.cart?.items.map((item, index) => (
                  <div
                    key={item._id || index}
                    className="flex items-center justify-between bg-white p-3 rounded-md border border-gray-200"
                  >
                    <div className="flex items-center space-x-4">
                      {item.productId?.photoUrl && (
                        <img
                          src={item.productId.photoUrl}
                          alt={item.productId.name || item.productId.pname}
                          className="w-12 h-12 object-cover rounded"
                          onError={(e) => {
                            e.target.src = "/path-to-fallback-image.png";
                          }}
                        />
                      )}
                      <div>
                        <p className="text-gray-800 font-medium">
                          {item.productId?.name ||
                            item.productId?.pname ||
                            "Unknown Product"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Rs.{" "}
                          {Number(
                            item.price ||
                              item.productId?.price ||
                              item.productId?.pprice ||
                              0
                          ).toFixed(2)}{" "}
                          x {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-800 font-semibold">
                      Rs.{" "}
                      {Number(
                        (item.price ||
                          item.productId?.price ||
                          item.productId?.pprice ||
                          0) * item.quantity
                      ).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No items in the order</p>
            )}
          </div>

          {/* Payment Information Section */}
          <div className="bg-gray-50 rounded-lg p-5">
            <h4
              className={`text-lg font-medium text-gray-700 mb-4 flex items-center`}
            >
              <svg
                className="w-5 h-5 mr-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Payment Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-3 rounded-md border border-gray-200">
                <p className="text-sm text-gray-500">Advance Payment</p>
                <p className="text-lg font-semibold text-gray-800">
                  Rs. {Number(order.advancePayment).toFixed(2)}
                </p>
              </div>
              <div className="bg-white p-3 rounded-md border border-gray-200">
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-lg font-semibold text-gray-800">
                  Rs. {Number(order.cartTotal).toFixed(2)}
                </p>
              </div>
              <div className="bg-white p-3 rounded-md border border-gray-200">
                <p className="text-sm text-gray-500">Due Payment</p>
                <p className="text-lg font-semibold text-gray-800">
                  Rs.{" "}
                  {Number(order.cartTotal - order.advancePayment).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Assigned Employees Section */}
          <div className="bg-gray-50 rounded-lg p-5">
            <h4 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Assigned Employees
            </h4>
            {order.employees && order.employees.length > 0 ? (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700 mb-1">
                  Assigned Staff:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {order.employees.map((employee) => (
                    <div
                      key={employee._id}
                      className="border rounded-lg p-3 flex items-start space-x-3 bg-white shadow-sm"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between">
                          <h5 className="text-sm font-medium text-gray-900 truncate">
                            {employee.name}
                          </h5>
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {employee.occupation?.title || employee.empId}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-gray-500 space-y-1">
                          <div className="flex items-center">
                            <svg
                              className="h-3 w-3 text-gray-400 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                            <span className="truncate">{employee.email}</span>
                          </div>
                          <div className="flex items-center">
                            <svg
                              className="h-3 w-3 text-gray-400 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                            <span>{employee.phone}</span>
                          </div>
                          <div className="flex items-center">
                            <svg
                              className="h-3 w-3 text-gray-400 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>
                              {employee.availability
                                ? "Available"
                                : "Unavailable"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">No staff assigned yet</div>
            )}
          </div>

          {/* Payment Slip Section */}
          {order.slipUrl && (
            <div className="bg-gray-50 rounded-lg p-5">
              <h4
                className={`text-lg font-medium text-gray-700 mb-4 flex items-center`}
              >
                <svg
                  className="w-5 h-5 mr-2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                Payment Slip
              </h4>
              <div className="flex justify-center">
                <div className="bg-white p-2 rounded-md border border-gray-200 shadow-sm">
                  <img
                    src={order.slipUrl}
                    alt="Payment Slip"
                    className="max-w-full h-auto max-h-64 rounded"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/path-to-fallback-image.png";
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
