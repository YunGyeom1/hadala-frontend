import { SummaryResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface ShipmentSummaryRequest {
  start_date: string;
  end_date: string;
}

// 프로필 ID를 가져오는 함수
const getProfileId = (): string => {
  const profileId = localStorage.getItem('profile_id');
  if (!profileId) {
    throw new Error('프로필 ID가 없습니다. 로그인 후 프로필을 선택해주세요.');
  }
  return profileId;
};

// 인증 헤더를 생성하는 함수
const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
  'X-Profile-ID': getProfileId(),
  'Content-Type': 'application/json',
});

export const shipmentSummaryService = {
  // 새로운 통합 엔드포인트 사용
  async getSummary(
    transactionType: 'contract' | 'shipment',
    direction: 'inbound' | 'outbound',
    request: ShipmentSummaryRequest
  ): Promise<SummaryResponse> {
    const params = new URLSearchParams({
      start_date: request.start_date,
      end_date: request.end_date,
    });

    const response = await fetch(
      `${API_BASE_URL}/summary/${transactionType}/${direction}?${params}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        body: errorText
      });
      throw new Error(`Failed to fetch summary: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  },

  // 출하 현황 조회 (outbound shipments)
  async getOutboundSummary(request: ShipmentSummaryRequest): Promise<SummaryResponse> {
    const params = new URLSearchParams({
      start_date: request.start_date,
      end_date: request.end_date,
    });

    const response = await fetch(
      `${API_BASE_URL}/summary/shipments/outbound?${params}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        body: errorText
      });
      throw new Error(`Failed to fetch outbound summary: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  },

  // 입하 현황 조회 (inbound shipments)
  async getInboundSummary(request: ShipmentSummaryRequest): Promise<SummaryResponse> {
    const params = new URLSearchParams({
      start_date: request.start_date,
      end_date: request.end_date,
    });

    const response = await fetch(
      `${API_BASE_URL}/summary/shipments/inbound?${params}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        body: errorText
      });
      throw new Error(`Failed to fetch inbound summary: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  },
}; 