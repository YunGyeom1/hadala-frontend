import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TesterDashboard from '../pages/tester/Dashboard';
import { WholesaleContractPage } from '../pages/tester/WholesaleContract';
import { RetailContractPage } from '../pages/tester/RetailContract';
import WholesaleCertification from '../pages/tester/WholesaleCertification';
import RetailCertification from '../pages/tester/RetailCertification';
import Inventory from '../pages/tester/Inventory';
import InventoryComparison from '../pages/tester/InventoryComparison';
import { WholesaleShipment } from '../pages/tester/WholesaleShipment';
import { RetailShipmentPage } from '../pages/tester/RetailShipment';
import CompanyPage from '../pages/company/CompanyPage';
import { InventoryPage } from '../pages/company/InventoryPage';
import { AggregatedInventoryPage } from '../pages/company/AggregatedInventoryPage';
import { CenterPage } from '../pages/company/CenterPage';
import { DailySettlementPage } from '../pages/company/DailySettlementPage';

const TesterRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<TesterDashboard />} />
      <Route path="wholesale-contract" element={<WholesaleContractPage />} />
      <Route path="retail-contract" element={<RetailContractPage />} />
      <Route path="wholesale-certification" element={<WholesaleCertification />} />
      <Route path="retail-certification" element={<RetailCertification />} />
      <Route path="inventory" element={<Inventory />} />
      <Route path="inventory-comparison" element={<InventoryComparison />} />
      <Route path="wholesale-shipment" element={<WholesaleShipment />} />
      <Route path="retail-shipment" element={<RetailShipmentPage />} />
      <Route path="company" element={<CompanyPage />} />
      <Route path="company-inventory" element={<InventoryPage />} />
      <Route path="aggregated-inventory" element={<AggregatedInventoryPage />} />
      <Route path="company-center" element={<CenterPage />} />
      <Route path="daily-settlement" element={<DailySettlementPage />} />
    </Routes>
  );
};
export default TesterRoutes;
