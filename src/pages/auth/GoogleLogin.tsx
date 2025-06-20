import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, User } from '../../core/auth/auth';
import { useProfile } from '../../profile/ProfileContext';

// Google OAuth 클라이언트 타입 정의
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, options: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

interface GoogleLoginProps {
  onSuccess?: (user: User) => void;
  onError?: (error: string) => void;
}

const GoogleLogin: React.FC<GoogleLoginProps> = ({ onSuccess, onError }) => {
  const navigate = useNavigate();
  const { refreshProfiles } = useProfile();

  // Google 스크립트 로드
  useEffect(() => {
    const loadGoogleScript = () => {
      return new Promise<void>((resolve) => {
        if (window.google && window.google.accounts) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        document.head.appendChild(script);
      });
    };

    const initializeGoogleAuth = async () => {
      await loadGoogleScript();
      
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
      }
    };

    initializeGoogleAuth();
  }, []);

  // Google 로그인 응답 처리
  const handleCredentialResponse = useCallback(async (response: any) => {
    try {
      console.log('Google ID Token received');
      
      // 백엔드로 ID 토큰 전송
      const loginResponse = await authService.googleLogin(response.credential);
      
      // 토큰 저장
      authService.saveTokens(loginResponse.access_token, loginResponse.refresh_token);
      
      // 사용자 정보 디코딩 및 저장
      const userInfo = decodeJwtResponse(response.credential);
      const user: User = {
        id: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
      };
      
      authService.saveUser(user);
      
      // 프로필 정보 가져오기
      await refreshProfiles();
      
      // 성공 콜백 호출
      if (onSuccess) {
        onSuccess(user);
      }
      
      // 임시로 대시보드로 이동
      navigate('/wholesaler/dashboard');
      
    } catch (error: any) {
      console.error('Google login error:', error);
      const errorMessage = error.response?.data?.detail || '로그인 중 오류가 발생했습니다.';
      
      if (onError) {
        onError(errorMessage);
      }
    }
  }, [navigate, onSuccess, onError, refreshProfiles]);

  // JWT 토큰 디코딩 (클라이언트 사이드)
  const decodeJwtResponse = (token: string) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  };

  // Google 로그인 버튼 렌더링
  useEffect(() => {
    const renderGoogleButton = () => {
      const buttonElement = document.getElementById('google-login-button');
      if (buttonElement && window.google && window.google.accounts) {
        window.google.accounts.id.renderButton(buttonElement, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: 300,
        });
      }
    };

    // Google 스크립트 로드 확인 후 버튼 렌더링
    const checkAndRender = () => {
      if (window.google && window.google.accounts) {
        renderGoogleButton();
      } else {
        setTimeout(checkAndRender, 100);
      }
    };

    checkAndRender();
  }, []);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div id="google-login-button"></div>
      <p className="text-sm text-gray-600">
        구글 계정으로 안전하게 로그인하세요
      </p>
    </div>
  );
};

export default GoogleLogin; 