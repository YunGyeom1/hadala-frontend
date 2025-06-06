import api from '@/utils/api';
import { LoginRequest, LoginResponse, RegisterRequest, User } from '@/types/auth';

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/users/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<User> => {
    try {
      const response = await api.post<User>('/users/register', data);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw error;
    }
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/users/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
  },
}; 