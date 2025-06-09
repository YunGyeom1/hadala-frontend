import { Routes, Route } from 'react-router-dom';
import FarmerDashboard from '@/pages/farmer/Dashboard';
import WholesaleContract from '@/pages/farmer/WholesaleContract';
import FarmerWholesaleCertification from '@/pages/farmer/WholesaleCertification';

const FarmerRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<FarmerDashboard />} />
      <Route path="wholesale-contract" element={<WholesaleContract />} />
      <Route path="wholesale-certification" element={<FarmerWholesaleCertification />} />
    </Routes>
  );
};

export default FarmerRoutes; 