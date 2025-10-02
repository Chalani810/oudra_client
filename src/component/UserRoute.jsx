// src/components/AdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import UserUnauthorizedPage from './UserUnauthorizedPage';

const AdminRoute = ({ children }) => {
  const userData = JSON.parse(localStorage.getItem("user"));

  if (!userData) {
    return <Navigate to="/signin" replace />;
  }

  if (userData.role !== 'user') {
    return <UserUnauthorizedPage userRole={userData.role}/>;
  }

  return children;
};

export default AdminRoute;