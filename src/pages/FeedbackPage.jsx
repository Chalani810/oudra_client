import React from 'react';
import FeedbackForm from '../component/Feedback/FeedbackForm';

const FeedbackPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
        
        <div className="space-x-4">
          <button><i className="fas fa-search" /></button>
          <button><i className="fas fa-user" /></button>
        </div>
      
      <main className="py-12 flex justify-center items-center">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-2xl">
          <FeedbackForm />
        </div>
      </main>

    </div>
  );
};

export default FeedbackPage;
