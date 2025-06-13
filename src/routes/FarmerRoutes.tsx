import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FarmerDashboard from '../pages/farmer/FarmerDashboard';  

const FarmerRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<FarmerDashboard />} />
    </Routes>
  );
};

export default FarmerRoutes; 