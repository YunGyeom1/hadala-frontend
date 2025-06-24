import { Center, CenterCreateRequest, CenterUpdateRequest } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// 프로필 ID를 가져오는 함수
const getProfileId = (): string => {
  const profileId = localStorage.getItem('profile_id');
  if (!profileId) {
    throw new Error('프로필 ID가 없습니다. 로그인 후 프로필을 선택해주세요.');
  }
  return profileId;
};

export const centerService = {
  // 센터 목록 조회
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
      throw new Error(errorData.detail || '센터 목록을 불러오는데 실패했습니다');
    }

    return response.json();
  },

  // 센터 생성
  async createCenter(centerData: CenterCreateRequest, companyId: string): Promise<Center> {
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
        'X-Profile-ID': getProfileId(),
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
        'X-Profile-ID': getProfileId(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || '센터 정보를 불러오는데 실패했습니다');
    }

    return response.json();
  },

  // 센터 삭제
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
      throw new Error(errorData.detail || '센터 삭제에 실패했습니다');
    }
  },
}; 