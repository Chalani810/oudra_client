import React, { useEffect, useState } from "react";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

const InvoiceButtons = ({ invoiceId }) => {
  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState(null); // New state for error handling

  useEffect(() => {
    if (!invoiceId) return;

    axios.get(`${apiUrl}/api/invoice-total/${invoiceId}`)
      .then((res) => setInvoice(res.data))
      .catch((err) => {
        console.error("Error loading invoice total:", err);
        setError("Failed to load invoice. Please try again later.");
      });
  }, [invoiceId]);

  if (error) return <p>{error}</p>; // Display error message
  if (!invoice) return <p>Loading totals...</p>;

  const { subtotal, discountPercentage, total, amountDue } = invoice;
  const discountValue = subtotal * (discountPercentage / 100);

  return (
    <div className="text-sm mb-6">
      <div className="flex justify-between py-1">
        <p className="text-gray-500">Sub total</p>
        <p className="font-medium">LKR {subtotal.toLocaleString()}</p>
      </div>

      <div className="flex justify-between py-1">
        <p className="text-gray-500">Discount - {discountPercentage}%</p>
        <p className="font-medium text-green-500">- LKR {discountValue.toLocaleString()}</p>
      </div>

      <div className="flex justify-between border-t pt-2 mt-2">
        <p className="text-gray-500">Total</p>
        <p className="font-medium">LKR {total.toLocaleString()}</p>
      </div>

      <div className="flex justify-between border-t pt-2 mt-2 text-lg font-semibold">
        <p className="text-gray-700">Amount due</p>
        <p className="text-gray-900">LKR {amountDue.toLocaleString()}</p>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button className="border border-gray-300 px-6 py-2 rounded-md hover:bg-gray-100">
          Cancel
        </button>
        <button className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700">
          Continue
        </button>
      </div>
    </div>
  );
};

export default InvoiceButtons;
