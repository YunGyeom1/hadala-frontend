import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TesterDashboard from '../pages/tester/TesterDashboard';
import ShipmentPage from '../pages/tester/ShipmentPage';
import ContractPage from '../pages/tester/ContractPage';

const TesterRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<TesterDashboard />} />
      <Route path="shipments" element={<ShipmentPage />} />
      <Route path="contracts" element={<ContractPage />} />
    </Routes>
  );
};

export default TesterRoutes;
