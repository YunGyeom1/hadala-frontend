import axios from 'axios';

// API URL 설정
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// 디버그용 로그
console.log('=== API Configuration ===');
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('API_BASE_URL:', API_BASE_URL);
console.log('Current origin:', window.location.origin);

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30초 타임아웃
});

// 요청 인터셉터 - 토큰 추가
api.interceptors.request.use(
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

// 응답 인터셉터 - 토큰 만료 처리
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          const { access_token } = response.data;
          localStorage.setItem('access_token', access_token);
          originalRequest.headers.Authorization = `Bearer ${access_token}`;

          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
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
  // Health check for backend
  async healthCheck(): Promise<boolean> {
    try {
      console.log('=== Backend Health Check ===');
      console.log('Checking backend at:', API_BASE_URL);
      
      const response = await axios.get(`${API_BASE_URL}/docs`, {
        timeout: 10000,
      });
      console.log('Backend is reachable:', response.status);
      return true;
    } catch (error: any) {
      console.error('Backend health check failed:', error);
      console.error('Backend URL:', API_BASE_URL);
      return false;
    }
  },

  // Google login
  async googleLogin(idToken: string): Promise<GoogleLoginResponse> {
    console.log('=== Google Login Request ===');
    console.log('Request URL:', `${API_BASE_URL}/auth/google-login`);
    console.log('Request payload:', { id_token: idToken.substring(0, 50) + '...' });
    
    try {
      const response = await api.post('/auth/google-login', {
        id_token: idToken,
      });
      console.log('Google login response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Google login request failed:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      throw error;
    }
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

export default api; 