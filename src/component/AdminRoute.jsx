// src/components/AdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import UnauthorizedPage from './UnauthorizedPage';

const AdminRoute = ({ children }) => {
  const userData = JSON.parse(localStorage.getItem("user"));

  if (!userData) {
    return <Navigate to="/signin" replace />;
  }

  if (userData.role !== 'admin') {
    return <UnauthorizedPage />;
  }

  return children;
};

export default AdminRoute;