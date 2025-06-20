import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, User } from '../core/auth/auth';
import { useProfile } from '../profile/ProfileContext';
import { profileService } from '../profile/profile';

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

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { refreshProfiles, allProfiles } = useProfile();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // 이미 로그인된 사용자 체크
  useEffect(() => {
    if (authService.isAuthenticated()) {
      const user = authService.getUser();
      if (user) {
        // 프로필이 있으면 첫 번째 프로필의 대시보드로, 없으면 프로필 페이지로
        if (allProfiles.length > 0) {
          const firstProfile = allProfiles[0];
          navigate(`/${firstProfile.type}/dashboard`);
        } else {
          navigate('/profile');
        }
      }
    }
  }, [navigate, allProfiles]);

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
      setIsLoading(true);
      setError('');
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
      
      console.log('로그인 성공:', user);
      
      // 프로필이 있으면 첫 번째 프로필의 대시보드로, 없으면 프로필 페이지로
      const profiles = await profileService.getMyProfiles();
      if (profiles.length > 0) {
        const firstProfile = profiles[0];
        navigate(`/${firstProfile.type}/dashboard`);
      } else {
        navigate('/profile');
      }
      
    } catch (error: any) {
      console.error('Google login error:', error);
      const errorMessage = error.response?.data?.detail || '로그인 중 오류가 발생했습니다.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [navigate, refreshProfiles]);

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            하달라에 오신 것을 환영합니다
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            농산물 거래 플랫폼
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <div id="google-login-button"></div>
              <p className="text-sm text-gray-600">
                구글 계정으로 안전하게 로그인하세요
              </p>
            </div>
          </div>

          {isLoading && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          )}

          <div className="text-center">
            <p className="text-xs text-gray-500">
              로그인함으로써{' '}
              <a href="#" className="text-green-600 hover:text-green-500">
                이용약관
              </a>{' '}
              및{' '}
              <a href="#" className="text-green-600 hover:text-green-500">
                개인정보처리방침
              </a>
              에 동의합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
