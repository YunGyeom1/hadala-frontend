import React from 'react';
import { Routes, Route } from 'react-router-dom';
import WholesalerDashboard from '@/pages/wholesaler/WholesalerDashboard';
import ContractList from '@/transactions/contract/ContractList';
import ContractForm from '@/transactions/contract/ContractForm';
import ContractDetail from '@/transactions/contract/ContractDetail';
import ShipmentList from '@/transactions/shipment/ShipmentList';
import ShipmentForm from '@/transactions/shipment/ShipmentForm';
import ShipmentDetail from '@/transactions/shipment/ShipmentDetail';
import InventorySummaryPage from '@/pages/wholesaler/reports/inventory-summary/inventorysummary';
import ShipmentSummaryPage from '@/transactions/shipment_summary/ShipmentSummaryPage';

const WholesalerRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<WholesalerDashboard />} />
      <Route path="transactions/contracts" element={<ContractList />} />
      <Route path="transactions/contracts/new" element={<ContractForm />} />
      <Route path="transactions/contracts/:id" element={<ContractDetail />} />
      <Route path="transactions/contracts/:id/edit" element={<ContractForm />} />
      <Route path="transactions/shipments" element={<ShipmentList />} />
      <Route path="transactions/shipments/new" element={<ShipmentForm />} />
      <Route path="transactions/shipments/:id" element={<ShipmentDetail />} />
      <Route path="transactions/shipments/:id/edit" element={<ShipmentForm />} />
      <Route path="reports/inventory-summary" element={<InventorySummaryPage />} />
      <Route path="reports/shipment-summary" element={<ShipmentSummaryPage />} />
    </Routes>
  );
};

export default WholesalerRoutes; 