import apiClient from '../core/auth/auth';
import axios from 'axios';
import { Profile, ProfileType, ProfileRole } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// API client that doesn't require authentication
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

export interface ExternalProfileCreateRequest {
  username: string;
  type: ProfileType;
  name?: string;
  phone?: string;
  email?: string;
  company_id?: string;
  role?: ProfileRole;
}

export interface ProfileUpdateRequest {
  username?: string;
  name?: string;
  phone?: string;
  email?: string;
}

export const profileService = {
  // Get my profile list
  async getMyProfiles(): Promise<Profile[]> {
    const response = await apiClient.get('/profile/me');
    return response.data;
  },

  // Create profile
  async createProfile(profileData: ProfileCreateRequest): Promise<Profile> {
    const response = await apiClient.post('/profile/me', profileData);
    return response.data;
  },

  // Create public profile (no user_id)
  async createExternalProfile(profileData: ExternalProfileCreateRequest): Promise<Profile> {
    const response = await publicApiClient.post('/profile/public', profileData);
    return response.data;
  },

  // Update profile
  async updateProfile(profileId: string, profileData: ProfileUpdateRequest): Promise<Profile> {
    const response = await apiClient.put(`/profile/${profileId}`, profileData);
    return response.data;
  },

  // Search profiles (no authentication required)
  async searchProfiles(params: {
    username?: string;
    profile_type?: ProfileType;
    skip?: number;
    limit?: number;
  }): Promise<Profile[]> {
    const response = await publicApiClient.get('/profile/search', { params });
    return response.data;
  },

  // Get specific profile
  async getProfile(profileId: string): Promise<Profile> {
    const response = await apiClient.get(`/profile/${profileId}`);
    return response.data;
  },

  // Update profile role
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
      throw new Error(errorData.detail || 'Failed to update role');
    }

    return response.json();
  },
}; 