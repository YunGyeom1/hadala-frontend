import React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import WholesalerDashboard from '@/pages/wholesaler/WholesalerDashboard';
import ContractList from '@/transactions/contract/ContractList';
import ContractForm from '@/transactions/contract/ContractForm';
import ContractDetail from '@/transactions/contract/ContractDetail';
import ShipmentList from '@/transactions/shipment/ShipmentList';
import ShipmentForm from '@/transactions/shipment/ShipmentForm';
import ShipmentDetail from '@/transactions/shipment/ShipmentDetail';
import { mockShipments } from '@/transactions/shipment/mock';
import InventorySummaryPage from '@/pages/wholesaler/reports/inventory-summary/inventorysummary';

const ShipmentDetailPage = () => {
  const { id } = useParams();
  const shipment = mockShipments.find(s => s.id === id);
  if (!shipment) return <div>Shipment not found</div>;
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto">
        <ShipmentDetail shipment={shipment} />
      </div>
    </div>
  );
};

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
      <Route path="transactions/shipments/:id" element={<ShipmentDetailPage />} />
      <Route path="transactions/shipments/:id/edit" element={<ShipmentForm />} />
      <Route path="reports/inventory-summary" element={<InventorySummaryPage />} />
    </Routes>
  );
};

export default WholesalerRoutes; 