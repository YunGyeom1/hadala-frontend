import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TesterDashboard from '../pages/tester/Dashboard';
import { WholesaleContract } from '../pages/tester/WholesaleContract';
import { RetailContract } from '../pages/tester/RetailContract';
import WholesaleCertification from '../pages/tester/WholesaleCertification';
import RetailCertification from '../pages/tester/RetailCertification';
import Inventory from '../pages/tester/Inventory';
import InventoryComparison from '../pages/tester/InventoryComparison';
import { WholesaleShipment } from '../pages/tester/WholesaleShipment';
import { RetailShipment } from '../pages/tester/RetailShipment';

const TesterRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<TesterDashboard />} />
      <Route path="wholesale-contract" element={<WholesaleContract />} />
      <Route path="retail-contract" element={<RetailContract />} />
      <Route path="wholesale-certification" element={<WholesaleCertification />} />
      <Route path="retail-certification" element={<RetailCertification />} />
      <Route path="inventory" element={<Inventory />} />
      <Route path="inventory-comparison" element={<InventoryComparison />} />
      <Route path="wholesale-shipment" element={<WholesaleShipment />} />
      <Route path="retail-shipment" element={<RetailShipment />} />
    </Routes>
  );
};

export default TesterRoutes;