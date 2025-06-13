import React from 'react';
import { Routes, Route } from 'react-router-dom';
import WholesalerDashboard from '../pages/wholesaler/WholesalerDashboard';

const WholesalerRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<WholesalerDashboard />} />
    </Routes>
  );
};

export default WholesalerRoutes; 