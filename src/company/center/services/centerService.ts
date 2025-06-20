import { Center, CenterCreateRequest, CenterUpdateRequest } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const centerService = {
  // 센터 목록 조회
  async getCenters(companyId?: string): Promise<Center[]> {
    const params = companyId ? `?company_id=${companyId}` : '';
    const response = await fetch(`${API_BASE_URL}/centers/${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'X-Profile-ID': localStorage.getItem('profile_id') || '',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('센터 목록을 불러오는데 실패했습니다');
    }

    return response.json();
  },

  // 센터 생성
  async createCenter(centerData: CenterCreateRequest, companyId: string): Promise<Center> {
    const response = await fetch(`${API_BASE_URL}/companies/${companyId}/centers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'X-Profile-ID': localStorage.getItem('profile_id') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(centerData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || '센터 생성에 실패했습니다');
    }

    return response.json();
  },

  // 센터 수정
  async updateCenter(centerId: string, centerData: CenterUpdateRequest): Promise<Center> {
    const response = await fetch(`${API_BASE_URL}/centers/${centerId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'X-Profile-ID': localStorage.getItem('profile_id') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(centerData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || '센터 수정에 실패했습니다');
    }

    return response.json();
  },

  // 센터 조회
  async getCenter(centerId: string): Promise<Center> {
    const response = await fetch(`${API_BASE_URL}/centers/${centerId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'X-Profile-ID': localStorage.getItem('profile_id') || '',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('센터 정보를 불러오는데 실패했습니다');
    }

    return response.json();
  },
}; 