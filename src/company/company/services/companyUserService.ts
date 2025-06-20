import { Profile } from '@/profile/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface CompanyUser {
  id: string;
  company_id: string;
  name: string;
  email: string;
  phone: string;
  role: 'OWNER' | 'MANAGER' | 'STAFF';
  status: 'ACTIVE' | 'INACTIVE';
}

export const companyUserService = {
  // 회사 유저 목록 조회
  async getCompanyUsers(companyId: string): Promise<Profile[]> {
    const response = await fetch(`${API_BASE_URL}/companies/${companyId}/users`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'X-Profile-ID': localStorage.getItem('profile_id') || '',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('회사 유저 목록을 불러오는데 실패했습니다');
    }

    return response.json();
  },

  // 회사에 유저 추가
  async addCompanyUser(companyId: string, profileId: string, role: string): Promise<Profile> {
    const response = await fetch(`${API_BASE_URL}/companies/${companyId}/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'X-Profile-ID': localStorage.getItem('profile_id') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        profile_id: profileId,
        role: role,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || '유저 추가에 실패했습니다');
    }

    return response.json();
  },

  // 회사에서 유저 제거
  async removeCompanyUser(companyId: string, userId: string): Promise<Profile> {
    const response = await fetch(`${API_BASE_URL}/companies/${companyId}/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'X-Profile-ID': localStorage.getItem('profile_id') || '',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || '유저 제거에 실패했습니다');
    }

    return response.json();
  },
}; 