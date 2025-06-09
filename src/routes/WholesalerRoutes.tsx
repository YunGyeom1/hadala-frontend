import React from 'react';
import { Routes, Route } from 'react-router-dom';
import WholesalerDashboard from '../pages/wholesaler/WholesalerDashboard';
import PriceGuide from '../pages/wholesaler/PriceGuide';
import WholesaleContract from '../pages/wholesaler/WholesaleContract';
import WholesaleCertification from '../pages/wholesaler/WholesaleCertification';
import RetailContract from '../pages/wholesaler/RetailContract';
import RetailCertification from '../pages/wholesaler/RetailCertification';
import Inventory from '../pages/wholesaler/Inventory';
import InventoryComparison from '../pages/wholesaler/InventoryComparison';

const WholesalerRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<WholesalerDashboard />} />
      <Route path="price-guide" element={<PriceGuide />} />
      <Route path="wholesale-contract" element={<WholesaleContract />} />
      <Route path="wholesale-certification" element={<WholesaleCertification />} />
      <Route path="retail-contract" element={<RetailContract />} />
      <Route path="retail-certification" element={<RetailCertification />} />
      <Route path="inventory" element={<Inventory />} />
      <Route path="inventory-comparison" element={<InventoryComparison />} />
    </Routes>
  );
};

export default WholesalerRoutes; 