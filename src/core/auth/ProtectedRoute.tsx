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

  // 인증되지 않은 경우 로그인 페이지로
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 프로필 로딩 중
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // 특정 프로필 타입이 필요한 경우
  if (requiredProfileType) {
    const hasRequiredProfile = allProfiles.some(p => p.type === requiredProfileType);
    
    if (!hasRequiredProfile) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {requiredProfileType === ProfileType.FARMER && '농부'}
              {requiredProfileType === ProfileType.RETAILER && '소매상'}
              {requiredProfileType === ProfileType.WHOLESALER && '도매상'}
              프로필이 필요합니다
            </h2>
            <p className="text-gray-600 mb-6">
              이 페이지에 접근하려면 해당 프로필을 먼저 생성해야 합니다.
            </p>
            <button
              onClick={() => window.location.href = '/profile'}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              프로필 관리로 이동
            </button>
          </div>
        </div>
      );
    }

    // 현재 프로필이 필요한 타입과 다르면 프로필 페이지로
    if (currentProfile?.type !== requiredProfileType) {
      return <Navigate to="/profile" replace />;
    }
  }

  // 경로에 따른 자동 프로필 타입 확인 (완화된 버전)
  const pathProfileType = location.pathname.startsWith('/farmer/') ? ProfileType.FARMER :
                         location.pathname.startsWith('/wholesaler/') ? ProfileType.WHOLESALER :
                         location.pathname.startsWith('/retailer/') ? ProfileType.RETAILER : null;

  if (pathProfileType) {
    const hasRequiredProfile = allProfiles.some(p => p.type === pathProfileType);
    
    // 프로필이 없으면 프로필 페이지로 이동 (차단하지 않음)
    if (!hasRequiredProfile) {
      return <Navigate to="/profile" replace />;
    }

    // 현재 프로필이 경로와 맞지 않으면 해당 프로필로 변경 (차단하지 않음)
    if (currentProfile?.type !== pathProfileType) {
      const targetProfile = allProfiles.find(p => p.type === pathProfileType);
      if (targetProfile) {
        // ProfileContext에서 자동으로 처리되므로 여기서는 아무것도 하지 않음
        // 단순히 렌더링 허용
      }
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute; 