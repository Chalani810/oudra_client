import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // For URL params

const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

const InvoiceSummary = () => {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  
  // Get the invoice ID from the URL
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      axios
        .get(`${apiUrl}/api/invoice-summary/${id}`) // Use dynamic invoice ID from URL
        .then((res) => setSummary(res.data))
        .catch((err) => {
          console.error("Error fetching summary:", err);
          setError("Sorry, there was an issue loading the summary. Please try again later.");
        });
    }
  }, [id]); // Fetch new summary whenever the ID changes

  if (error) return <p className="text-red-500">{error}</p>;
  if (!summary) return <p>Loading summary...</p>;

  // Format date (assuming it's in a format like "2025-05-01")
  const formattedDate = new Date(summary.date).toLocaleDateString();

  return (
    <div className="grid grid-cols-2 gap-4 text-sm mb-6">
      <div>
        <p className="text-gray-500">Your Order</p>
        <p className="font-medium">{summary.orderNumber || "N/A"}</p>
      </div>
      <div>
        <p className="text-gray-500">Date</p>
        <p className="font-medium">{formattedDate || "N/A"}</p>
      </div>
      <div>
        <p className="text-gray-500">Subject</p>
        <p className="font-medium">{summary.subject || "No subject provided"}</p>
      </div>
      <div>
        <p className="text-gray-500">Billed to</p>
        <p className="font-medium">{summary.customerName || "N/A"}</p>
        <p className="text-gray-500 text-xs">{summary.customerEmail || "No email provided"}</p>
      </div>
      <div>
        <p className="text-gray-500">Currency</p>
        <p className="font-medium">{summary.currency || "N/A"}</p>
      </div>
    </div>
  );
};

export default InvoiceSummary;
