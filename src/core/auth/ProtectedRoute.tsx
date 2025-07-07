import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useProfile } from '../../profile/ProfileContext';
import { ProfileType } from '../../profile/types';
import { authService } from './auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredProfileType?: ProfileType;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredProfileType 
}) => {
  const location = useLocation();
  const { currentProfile, allProfiles, isLoading } = useProfile();
  const isAuthenticated = authService.isAuthenticated();

  // Redirect to login page if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Loading profiles
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // If specific profile type is required
  if (requiredProfileType) {
    const hasRequiredProfile = allProfiles.some(p => p.type === requiredProfileType);
    
    if (!hasRequiredProfile) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {requiredProfileType === ProfileType.FARMER && 'Farmer'}
              {requiredProfileType === ProfileType.RETAILER && 'Retailer'}
              {requiredProfileType === ProfileType.WHOLESALER && 'Wholesaler'}
              profile is required
            </h2>
            <p className="text-gray-600 mb-6">
              You need to create a profile first to access this page.
            </p>
            <button
              onClick={() => window.location.href = '/profile'}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Go to Profile Management
            </button>
          </div>
        </div>
      );
    }

    // Redirect to profile page if current profile doesn't match required type
    if (currentProfile?.type !== requiredProfileType) {
      return <Navigate to="/profile" replace />;
    }
  }

  // Auto profile type check based on path (relaxed version)
  const pathProfileType = location.pathname.startsWith('/farmer/') ? ProfileType.FARMER :
                         location.pathname.startsWith('/wholesaler/') ? ProfileType.WHOLESALER :
                         location.pathname.startsWith('/retailer/') ? ProfileType.RETAILER : null;

  if (pathProfileType) {
    const hasRequiredProfile = allProfiles.some(p => p.type === pathProfileType);
    
    // Redirect to profile page if profile doesn't exist (don't block)
    if (!hasRequiredProfile) {
      return <Navigate to="/profile" replace />;
    }

    // Change to matching profile if current profile doesn't match path (don't block)
    if (currentProfile?.type !== pathProfileType) {
      const targetProfile = allProfiles.find(p => p.type === pathProfileType);
      if (targetProfile) {
        // ProfileContext handles this automatically, so do nothing here
        // Just allow rendering
      }
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute; 