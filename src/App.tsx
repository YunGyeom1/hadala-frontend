// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from '@/pages/Login';
import Profile from '@/pages/Profile';

import MainLayout from '@/layout/MainLayout';
import FarmerRoutes from '@/routes/FarmerRoutes';
import RetailerRoutes from '@/routes/RetailerRoutes';
import WholesalerRoutes from '@/routes/WholesalerRoutes';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/" element={<MainLayout />}>
            <Route path="profile" element={<Profile />} />
            <Route path="farmer/*" element={<FarmerRoutes />} />
            <Route path="retailer/*" element={<RetailerRoutes />} />
            <Route path="wholesaler/*" element={<WholesalerRoutes />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;