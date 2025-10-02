import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const EditOrderModal = ({ order, onClose, onStatusChange, refresh }) => {
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const [newStatus, setNewStatus] = useState(order.status || "");
  const [employees, setEmployees] = useState([]);
  const [selectedSupervisors, setSelectedSupervisors] = useState([]);
  const [selectedAssistants, setSelectedAssistants] = useState([]);
  const [statusError, setStatusError] = useState("");
  const [staffError, setStaffError] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);
  const [staffLoading, setStaffLoading] = useState(false);

  const isConfirmed = newStatus === "Confirmed" || order.status === "Confirmed";

  useEffect(() => {
    const getEmps = async () => {
      try {
        const response = await axios.get(`${apiUrl}/employee`);

        // Get assigned employee IDs
        const assignedIds =
          order.employees?.map((emp) => emp._id.toString()) || [];

        // Filter employees: show available OR assigned (even if unavailable)
        const filteredEmployees = response.data.data.filter(
          (emp) =>
            emp.availability === true ||
            assignedIds.includes(emp._id.toString())
        );

        setEmployees(filteredEmployees);

        if (order.employees && order.employees.length > 0) {

          setSelectedSupervisors(
            order.employees
              .filter((emp) =>
                emp.occupation?.title.includes("Setup Supervisor")
              )
              .map((emp) => emp._id.toString())
          );

          setSelectedAssistants(
            order.employees
              .filter((emp) =>
                emp.occupation?.title.includes("Setup Assistant")
              )
              .map((emp) => emp._id.toString())
          );
        }
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };

    getEmps();
  }, [apiUrl, order.employees]);

  // Filter employees by role
  const supervisors = employees.filter((emp) =>
    emp.occupation?.title.includes("Supervisor")
  );
  const assistants = employees.filter((emp) =>
    emp.occupation?.title.includes("Assistant")
  );

  // Get required staff counts for display
  const getRequiredStaffCounts = () => {
    switch (order.guestCount) {
      case "less than 100":
        return { supervisors: 1, assistants: 2 };
      case "100-200":
        return { supervisors: 2, assistants: 4 };
      case "more than 200":
        return { supervisors: 3, assistants: 6 };
      default:
        return { supervisors: 1, assistants: 2 };
    }
  };

  const requiredCounts = getRequiredStaffCounts();

  const validateStaffCount = () => {
  let isValid = true;
  let errorMessage = "";

  // Validate supervisors - exact count required
  if (selectedSupervisors.length !== requiredCounts.supervisors) {
    errorMessage += `Exactly ${requiredCounts.supervisors} supervisor(s) required. `;
    isValid = false;
  }

  // Validate assistants - exact count required
  if (selectedAssistants.length !== requiredCounts.assistants) {
    errorMessage += `Exactly ${requiredCounts.assistants} assistant(s) required. `;
    isValid = false;
  }

  // Validate no duplicates between supervisors and assistants
  const allSelected = [...selectedSupervisors, ...selectedAssistants];
  const uniqueSelected = [...new Set(allSelected)];
  if (allSelected.length !== uniqueSelected.length) {
    errorMessage += "The same employee cannot be assigned as both supervisor and assistant. ";
    isValid = false;
  }

  // Validate all selected employees are actually available (except those already assigned)
  const assignedIds = order.employees?.map((emp) => emp._id.toString()) || [];
  const unavailableSelected = allSelected.filter(id => {
    const emp = employees.find(e => e._id.toString() === id);
    return emp && !emp.availability && !assignedIds.includes(id);
  });

  if (unavailableSelected.length > 0) {
    errorMessage += "Some selected employees are currently unavailable. ";
    isValid = false;
  }

  setStaffError(errorMessage);
  return isValid;
};

  const handleStatusSave = async () => {
    if (!newStatus) {
      setStatusError("Please select a status.");
      return;
    }

    setStatusLoading(true);

    try {
      await axios.put(`${apiUrl}/checkout/${order._id}/status`, {
        status: newStatus,
      });
      refresh();
      toast.success("Order status has been changed successfully");

      onStatusChange(order._id, newStatus, order.assignedEmployees || []);
      onClose();
    } catch (error) {
      toast.error("Failed to update order status");
    } finally {
      setStatusLoading(false);
    }
  };

  const handleStaffSave = async () => {
    if (!validateStaffCount()) {
      return;
    }

    setStaffLoading(true);

    try {
      const allSelectedEmployees = [
        ...selectedSupervisors,
        ...selectedAssistants,
      ];
      await axios.put(`${apiUrl}/orders/bills/${order._id}/assign`, {
        empIds: allSelectedEmployees,
      });
      refresh();
      onClose();
      toast.success("Staff assignments have been saved successfully");

      onStatusChange(order._id, order.status, allSelectedEmployees);
      setStaffError(""); // Clear any previous errors
    } catch (error) {
      toast.error("Failed to assign employees");
      console.error("Failed to assign employees:", error);
      setStaffError("Failed to assign employees. Try again.");
    } finally {
      setStaffLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-start justify-end z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-[600px] bg-white rounded-lg shadow-xl m-4 p-6 transition-all">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Edit Order</h2>
          <p className="text-xs text-gray-500 mt-1">
            Order ID: {order.orderNumber}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Guest Count: {order.guestCount}
          </p>
        </div>

        {/* Status Section */}
        <div className="mb-5 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Order Status
          </h3>

          <div className="mb-3">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Current Status:{" "}
              <span className="font-semibold">{order.status}</span>
            </label>
            <select
              id="status"
              value={newStatus}
              onChange={(e) => {
                setNewStatus(e.target.value);
                setStatusError("");
              }}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">Select new status</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            {statusError && (
              <p className="text-sm text-red-500 mt-1">{statusError}</p>
            )}
          </div>

          <button
            onClick={handleStatusSave}
            disabled={statusLoading || !newStatus || newStatus === order.status}
            className={`w-full px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
              statusLoading || !newStatus || newStatus === order.status
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-black"
            }`}
          >
            {statusLoading ? "Updating..." : "Update Status"}
          </button>
        </div>

        {/* Staff Assignment Section */}
        <div
          className={`p-4 rounded-lg ${
            isConfirmed ? "bg-gray-50" : "bg-gray-100 opacity-75"
          }`}
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-gray-700">
              Staff Assignment
            </h3>
            {!isConfirmed && (
              <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                Available for Confirmed orders only
              </span>
            )}
          </div>

          {/* Staff Selection Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Supervisor Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supervisors (Required: {requiredCounts.supervisors})
              </label>
              <div
                className={`max-h-40 overflow-y-auto border rounded px-2 py-1 ${
                  !isConfirmed ? "bg-gray-50" : ""
                }`}
              >
                {supervisors.length > 0 ? (
                  supervisors.map((emp) => (
                    <label
                      key={emp._id}
                      className={`flex items-center space-x-2 p-1 rounded ${
                        isConfirmed ? "hover:bg-gray-50" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSupervisors.includes(emp._id)}
                        onChange={() => {
                          setSelectedSupervisors((prev) =>
                            prev.includes(emp._id)
                              ? prev.filter((id) => id !== emp._id)
                              : [...prev, emp._id]
                          );
                        }}
                        disabled={!isConfirmed}
                        className={`rounded text-blue-600 focus:ring-blue-500 ${
                          !isConfirmed ? "opacity-50" : ""
                        }`}
                      />
                      <span className={!isConfirmed ? "text-gray-400" : ""}>
                        {emp.name}
                      </span>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 p-1">
                    No supervisors available
                  </p>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Selected: {selectedSupervisors.length}/
                {requiredCounts.supervisors}
              </p>
            </div>

            {/* Assistant Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assistants (Required: {requiredCounts.assistants})
              </label>
              <div
                className={`max-h-40 overflow-y-auto border rounded px-2 py-1 ${
                  !isConfirmed ? "bg-gray-50" : ""
                }`}
              >
                {assistants.length > 0 ? (
                  assistants.map((emp) => (
                    <label
                      key={emp._id}
                      className={`flex items-center space-x-2 p-1 rounded ${
                        isConfirmed ? "hover:bg-gray-50" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedAssistants.includes(emp._id)}
                        onChange={() => {
                          setSelectedAssistants((prev) =>
                            prev.includes(emp._id)
                              ? prev.filter((id) => id !== emp._id)
                              : [...prev, emp._id]
                          );
                        }}
                        disabled={!isConfirmed}
                        className={`rounded text-blue-600 focus:ring-blue-500 ${
                          !isConfirmed ? "opacity-50" : ""
                        }`}
                      />
                      <span className={!isConfirmed ? "text-gray-400" : ""}>
                        {emp.name}
                      </span>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 p-1">
                    No assistants available
                  </p>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Selected: {selectedAssistants.length}/
                {requiredCounts.assistants}
              </p>
            </div>
          </div>

          {staffError && (
            <p className="text-sm text-red-500 mb-3">{staffError}</p>
          )}

          <button
            onClick={handleStaffSave}
            disabled={staffLoading || !isConfirmed}
            className={`w-full px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
              staffLoading || !isConfirmed
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-black"
            }`}
          >
            {staffLoading ? "Saving..." : "Save Staff Assignments"}
          </button>
        </div>

        {/* Close Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditOrderModal;
