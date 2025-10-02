import React, { useState, useEffect } from "react";
import FeedbackTable from "../component/Feedback/FeedbackTable";
import FeedbackModal from "../component/Feedback/FeedbackModal";
import axios from "axios";

const FeedbackListPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(`${apiUrl}/feedback/${user.id}`);

      setFeedbacks(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
      return;
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleAddNew = () => {
    setIsEdit(false);
    setSelectedFeedback(null);
    setModalOpen(true);
  };

  const handleEdit = (feedback) => {
    setIsEdit(true);
    setSelectedFeedback(feedback);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/feedback/${id}`);
      fetchFeedbacks();
    } catch (error) {
      console.error("Error deleting feedback:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Your Feedback History
      </h1>

      <FeedbackTable
        feedbacks={feedbacks}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {modalOpen && (
        <FeedbackModal
          isEdit={isEdit}
          feedback={selectedFeedback}
          onClose={() => setModalOpen(false)}
          onRefresh={fetchFeedbacks}
          orderId={selectedFeedback ? selectedFeedback.orderId._id : null}
        />
      )}
    </div>
  );
};

export default FeedbackListPage;
