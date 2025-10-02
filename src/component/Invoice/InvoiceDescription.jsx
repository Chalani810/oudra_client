import React, { useEffect, useState } from "react";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

const InvoiceDescription = () => {
  const [invoiceData, setInvoiceData] = useState(null);
  const [error, setError] = useState(null); // State to store error messages

  useEffect(() => {
    axios.get(`${apiUrl}/api/invoice`) // Adjust endpoint to match your backend
      .then(response => {
        setInvoiceData(response.data);
      })
      .catch(error => {
        console.error("Error fetching invoice data:", error);
        setError("Sorry, there was an issue loading the invoice details. Please try again later.");
      });
  }, []);

  if (error) {
    return <p className="text-red-500">{error}</p>; // Display error message if fetching fails
  }

  if (!invoiceData) {
    return <p>Loading invoice details...</p>; // More descriptive loading message
  }

  return (
    <div className="border rounded-md p-4 mb-6">
      <div className="flex items-center gap-4">
        <img
          src={invoiceData.image || "/assets/images/default.jpg"}
          alt={invoiceData.title || "Invoice Image"}
          className="h-16 w-16 object-cover rounded-md"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-700">{invoiceData.title || "Invoice Title"}</h3>
          <p className="text-xs text-gray-400">{invoiceData.description || "No description available."}</p>
        </div>
        <p className="font-semibold">LKR {invoiceData.amount?.toLocaleString() || "0.00"}</p>
      </div>
    </div>
  );
};

export default InvoiceDescription;
