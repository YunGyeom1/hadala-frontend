import { Center, CenterCreateRequest, CenterUpdateRequest } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Function to get profile ID
const getProfileId = (): string => {
  const profileId = localStorage.getItem('profile_id');
  if (!profileId) {
    throw new Error('Profile ID not found. Please login and select a profile.');
  }
  return profileId;
};

export const centerService = {
  // Get center list
  async getCenters(companyId?: string): Promise<Center[]> {
    const params = companyId ? `?company_id=${companyId}` : '';
    const response = await fetch(`${API_BASE_URL}/centers/${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'X-Profile-ID': getProfileId(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to load center list');
    }

    return response.json();
  },

  // Create center
  async createCenter(centerData: CenterCreateRequest): Promise<Center> {
    const response = await fetch(`${API_BASE_URL}/centers/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'X-Profile-ID': getProfileId(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(centerData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to create center');
    }

    return response.json();
  },

  // Update center
  async updateCenter(centerId: string, centerData: CenterUpdateRequest): Promise<Center> {
    const response = await fetch(`${API_BASE_URL}/centers/${centerId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'X-Profile-ID': getProfileId(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(centerData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to update center');
    }

    return response.json();
  },

  // Get center
  async getCenter(centerId: string): Promise<Center> {
    const response = await fetch(`${API_BASE_URL}/centers/${centerId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'X-Profile-ID': getProfileId(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to load center information');
    }

    return response.json();
  },

  // Delete center
  async deleteCenter(centerId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/centers/${centerId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'X-Profile-ID': getProfileId(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to delete center');
    }
  },
}; 