import { Profile } from '@/profile/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const companyUserService = {
  // Get company user list
  async getCompanyUsers(companyId: string): Promise<Profile[]> {
    const response = await fetch(`${API_BASE_URL}/companies/${companyId}/users`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'X-Profile-ID': localStorage.getItem('profile_id') || '',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to load company user list');
    }

    return response.json();
  },

  // Add user to company
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
      throw new Error(errorData.detail || 'Failed to add user');
    }

    return response.json();
  },

  // Remove user from company
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
      throw new Error(errorData.detail || 'Failed to remove user');
    }

    return response.json();
  },

  // Update user role
  async updateUserRole(userId: string, role: string): Promise<Profile> {
    const response = await fetch(`${API_BASE_URL}/profile/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'X-Profile-ID': localStorage.getItem('profile_id') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role: role,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to update role');
    }

    return response.json();
  },
}; 