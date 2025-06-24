// src/App.tsx
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from '@/pages/Login';
import Profile from '@/pages/Profile';
import { authService } from '@/core/auth/auth';
import { ProfileProvider } from '@/profile/ProfileContext';
import ProtectedRoute from '@/core/auth/ProtectedRoute';

import MainLayout from '@/layout/MainLayout';
import FarmerRoutes from '@/routes/FarmerRoutes';
import RetailerRoutes from '@/routes/RetailerRoutes';
import WholesalerRoutes from '@/routes/WholesalerRoutes';

const queryClient = new QueryClient();

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 앱 초기화 시 인증 상태 확인
    const checkAuth = () => {
      // 토큰이 있지만 만료되었을 수 있으므로 검증
      if (authService.isAuthenticated()) {
        const refreshToken = authService.getRefreshToken();
        if (!refreshToken) {
          authService.logout();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ProfileProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* 보호된 라우트들 */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/profile" replace />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="farmer/*" element={<FarmerRoutes />} />
              <Route path="retailer/*" element={<RetailerRoutes />} />
              <Route path="wholesaler/*" element={<WholesalerRoutes />} />
            </Route>
          </Routes>
        </ProfileProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;