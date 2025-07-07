import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - automatically add token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - auto refresh token when expired
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await apiClient.post('/auth/refresh', {
            refresh_token: refreshToken,
          });
          
          const { access_token } = response.data;
          localStorage.setItem('access_token', access_token);
          
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Logout if refresh token is also expired
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export interface GoogleLoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  role?: string;
}

export const authService = {
  // Google login
  async googleLogin(idToken: string): Promise<GoogleLoginResponse> {
    const response = await apiClient.post('/auth/google-login', {
      id_token: idToken,
    });
    return response.data;
  },

  // Save tokens
  saveTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  },

  // Save user information
  saveUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Get user information
  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Logout
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  // Check login status
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },

  // Get tokens
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  },

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  },
};

export default apiClient; 