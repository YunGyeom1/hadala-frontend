import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, User } from '../core/auth/auth';
import { useProfile } from '../profile/ProfileContext';
import { profileService } from '../profile/profile';

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

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { refreshProfiles, allProfiles } = useProfile();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    if (authService.isAuthenticated()) {
      const user = authService.getUser();
      if (user) {
        // If profile exists, navigate to first profile's dashboard, otherwise to profile page
        if (allProfiles.length > 0) {
          const firstProfile = allProfiles[0];
          navigate(`/${firstProfile.type}/dashboard`);
        } else {
          navigate('/profile');
        }
      }
    }
  }, [navigate, allProfiles]);

  // Load Google script
  useEffect(() => {
    const loadGoogleScript = () => {
      return new Promise<void>((resolve) => {
        console.log('=== Loading Google Script ===');
        if (window.google && window.google.accounts) {
          console.log('Google script already loaded');
          resolve();
          return;
        }

        console.log('Creating Google script element...');
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          console.log('Google script loaded successfully');
          resolve();
        };
        script.onerror = (error) => {
          console.error('Failed to load Google script:', error);
        };
        document.head.appendChild(script);
        console.log('Google script element appended to head');
      });
    };

    const initializeGoogleAuth = async () => {
      console.log('=== Google Auth Initialization ===');
      console.log('Loading Google script...');
      await loadGoogleScript();
      
      if (window.google && window.google.accounts) {
        console.log('Google script loaded successfully');
        console.log('Client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);
        console.log('Hostname:', window.location.hostname);
        
        const config = {
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          context: 'signin',
          ux_mode: 'redirect',
          itp_support: true,
          prompt_parent_id: 'google-login-button',
          state_cookie_domain: window.location.hostname,
        };
        
        console.log('Google OAuth config:', config);
        window.google.accounts.id.initialize(config);
        console.log('Google OAuth initialized');
      } else {
        console.error('Google script not loaded properly');
      }
    };

    initializeGoogleAuth();
  }, []);

  // Handle Google login response
  const handleCredentialResponse = useCallback(async (response: any) => {
    try {
      setIsLoading(true);
      setError('');
      console.log('=== Google Login Debug ===');
      console.log('Response received:', response);
      console.log('Credential length:', response.credential?.length);
      console.log('Google ID Token received');
      
      // Send ID token to backend
      console.log('Sending token to backend...');
      const loginResponse = await authService.googleLogin(response.credential);
      console.log('Backend response:', loginResponse);
      
      // Save tokens
      console.log('Saving tokens...');
      authService.saveTokens(loginResponse.access_token, loginResponse.refresh_token);
      
      // Decode and save user information
      console.log('Decoding user info...');
      const userInfo = decodeJwtResponse(response.credential);
      console.log('Decoded user info:', userInfo);
      
      const user: User = {
        id: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
      };
      
      console.log('Created user object:', user);
      authService.saveUser(user);
      
      // Get profile information
      console.log('Refreshing profiles...');
      await refreshProfiles();
      
      console.log('Login successful:', user);
      
      // If profile exists, navigate to first profile's dashboard, otherwise to profile page
      console.log('Getting profiles for navigation...');
      const profiles = await profileService.getMyProfiles();
      console.log('Available profiles:', profiles);
      
      if (profiles.length > 0) {
        const firstProfile = profiles[0];
        console.log('Navigating to profile dashboard:', firstProfile);
        navigate(`/${firstProfile.type}/dashboard`);
      } else {
        console.log('No profiles found, navigating to profile page');
        navigate('/profile');
      }
      
    } catch (error: any) {
      console.error('=== Google Login Error ===');
      console.error('Error details:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      const errorMessage = error.response?.data?.detail || 'An error occurred during login.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      console.log('=== Google Login Process Complete ===');
    }
  }, [navigate, refreshProfiles]);

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
      console.log('=== Rendering Google Button ===');
      const buttonElement = document.getElementById('google-login-button');
      console.log('Button element:', buttonElement);
      console.log('Google object:', window.google);
      
      if (buttonElement && window.google && window.google.accounts) {
        console.log('Rendering Google button...');
        const buttonConfig = {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: 300,
          click_listener: () => {
            console.log('Google button clicked');
            return true;
          },
        };
        
        console.log('Button config:', buttonConfig);
        window.google.accounts.id.renderButton(buttonElement, buttonConfig);
        console.log('Google button rendered successfully');
      } else {
        console.error('Cannot render Google button:', {
          buttonElement: !!buttonElement,
          google: !!window.google,
          accounts: !!(window.google && window.google.accounts)
        });
      }
    };

    // Check Google script loading and render button
    const checkAndRender = () => {
      console.log('Checking Google script availability...');
      if (window.google && window.google.accounts) {
        console.log('Google script available, rendering button');
        renderGoogleButton();
      } else {
        console.log('Google script not ready, retrying...');
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
            Welcome to HADALA
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Agricultural Product Trading Platform
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
                Sign in securely with your Google account
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
              By signing in, you agree to our{' '}
              <a href="#" className="text-green-600 hover:text-green-500">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-green-600 hover:text-green-500">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
