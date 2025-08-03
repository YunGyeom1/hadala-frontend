import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, User } from '../../core/auth/auth';
import { useProfile } from '../../profile/ProfileContext';

// Google OAuth client type definition
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

  // Load Google script
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
          context: 'signin',
          auto_select: false,
          ux_mode: 'popup',
          itp_support: true,
        });
      }
    };

    initializeGoogleAuth();
  }, []);

  // Handle Google login response
  const handleCredentialResponse = useCallback(async (response: any) => {
    try {
      console.log('Google ID Token received');
      
      // Send ID token to backend
      const loginResponse = await authService.googleLogin(response.credential);
      
      // Save tokens
      authService.saveTokens(loginResponse.access_token, loginResponse.refresh_token);
      
      // Decode and save user information
      const userInfo = decodeJwtResponse(response.credential);
      const user: User = {
        id: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
      };
      
      authService.saveUser(user);
      
      // Get profile information
      await refreshProfiles();
      
      // Call success callback
      if (onSuccess) {
        onSuccess(user);
      }
      
      // Temporarily navigate to dashboard
      navigate('/wholesaler/dashboard');
      
    } catch (error: any) {
      console.error('Google login error:', error);
      const errorMessage = error.response?.data?.detail || 'An error occurred during login.';
      
      if (onError) {
        onError(errorMessage);
      }
    }
  }, [navigate, onSuccess, onError, refreshProfiles]);

  // Decode JWT token (client-side)
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

  // Render Google login button
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

    // Check Google script loading and render button
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
        Sign in securely with your Google account
      </p>
    </div>
  );
};

export default GoogleLogin; 