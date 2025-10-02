import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ForgotPasswordForm from '../component/ForgotPassword/ForgotPasswordForm';
import PasswordResetSuccess from '../component/ForgotPassword/PasswordResetSuccess';

const ForgotPasswordPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Routes>
      <Route path="/" element={<ForgotPasswordForm />} />
      <Route path="/success" element={<PasswordResetSuccess />} />
      </Routes>
    </div>
  );
};

export default ForgotPasswordPage;