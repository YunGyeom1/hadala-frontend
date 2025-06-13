import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RetailerDashboard from '../pages/retailer/RetailerDashboard';

const RetailerRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<RetailerDashboard />} />
    </Routes>
  );
};

export default RetailerRoutes; 