import { Routes, Route } from 'react-router-dom';
import RetailerDashboard from '@/pages/retailer/Dashboard';
import RetailContract from '@/pages/retailer/RetailContract';
import RetailerWholesaleCertification from '@/pages/retailer/WholesaleCertification';

const RetailerRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<RetailerDashboard />} />
      <Route path="retail-contract" element={<RetailContract />} />
      <Route path="wholesale-certification" element={<RetailerWholesaleCertification />} />
    </Routes>
  );
};

export default RetailerRoutes; 