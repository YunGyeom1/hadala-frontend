import apiClient from '../core/auth/auth';
import axios from 'axios';
import { Profile, ProfileType, ProfileRole } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// 인증이 필요 없는 API 클라이언트
const publicApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ProfileCreateRequest {
  username: string;
  type: ProfileType;
  name?: string;
  phone?: string;
  email?: string;
}

export interface ProfileUpdateRequest {
  username?: string;
  name?: string;
  phone?: string;
  email?: string;
}

export const profileService = {
  // 내 프로필 목록 조회
  async getMyProfiles(): Promise<Profile[]> {
    const response = await apiClient.get('/profile/me');
    return response.data;
  },

  // 프로필 생성
  async createProfile(profileData: ProfileCreateRequest): Promise<Profile> {
    const response = await apiClient.post('/profile/me', profileData);
    return response.data;
  },

  // 프로필 수정
  async updateProfile(profileId: string, profileData: ProfileUpdateRequest): Promise<Profile> {
    const response = await apiClient.put(`/profile/${profileId}`, profileData);
    return response.data;
  },

  // 프로필 검색 (인증 불필요)
  async searchProfiles(params: {
    username?: string;
    profile_type?: ProfileType;
    skip?: number;
    limit?: number;
  }): Promise<Profile[]> {
    const response = await publicApiClient.get('/profile/search', { params });
    return response.data;
  },

  // 특정 프로필 조회
  async getProfile(profileId: string): Promise<Profile> {
    const response = await apiClient.get(`/profile/${profileId}`);
    return response.data;
  },

  // 프로필 역할 변경
  async updateProfileRole(profileId: string, role: ProfileRole): Promise<Profile> {
    const response = await fetch(`${API_BASE_URL}/profile/${profileId}/role`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'X-Profile-ID': localStorage.getItem('profile_id') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || '역할 변경에 실패했습니다');
    }

    return response.json();
  },
}; 