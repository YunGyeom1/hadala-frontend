import { ShipmentResponse, ShipmentCreate, ShipmentUpdate } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const SHIPMENT_API_URL = `${API_BASE_URL}/shipments`;

const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
  'X-Profile-ID': localStorage.getItem('profile_id') || '',
  'Content-Type': 'application/json',
});

export const shipmentService = {
  // 출하 목록 조회
  async getShipments(params?: {
    skip?: number;
    limit?: number;
    start_date?: string;
    end_date?: string;
    shipment_status?: string;
    is_supplier?: boolean;
  }): Promise<ShipmentResponse[]> {
    const searchParams = new URLSearchParams();
    
    if (params?.skip !== undefined) searchParams.append('skip', params.skip.toString());
    if (params?.limit !== undefined) searchParams.append('limit', params.limit.toString());
    if (params?.start_date) searchParams.append('start_date', params.start_date);
    if (params?.end_date) searchParams.append('end_date', params.end_date);
    if (params?.shipment_status) searchParams.append('shipment_status', params.shipment_status);
    if (params?.is_supplier !== undefined) searchParams.append('is_supplier', params.is_supplier.toString());

    const url = `${API_BASE_URL}/shipments/?${searchParams.toString()}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'X-Profile-ID': localStorage.getItem('profile_id') || '',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || '출하 목록을 불러오는데 실패했습니다');
    }

    const data = await response.json();
    return data.shipments || data; // 백엔드 응답 구조에 따라 조정
  },

  // 특정 출하 조회
  async getShipment(shipmentId: string): Promise<ShipmentResponse> {
    const response = await fetch(`${API_BASE_URL}/shipments/${shipmentId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'X-Profile-ID': localStorage.getItem('profile_id') || '',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || '출하 정보를 불러오는데 실패했습니다');
    }

    return response.json();
  },

  // 출하 생성
  async createShipment(shipmentData: ShipmentCreate): Promise<ShipmentResponse> {
    const response = await fetch(`${API_BASE_URL}/shipments/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'X-Profile-ID': localStorage.getItem('profile_id') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shipmentData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: '알 수 없는 에러' }));
      const detail = typeof errorData.detail === 'string' 
        ? errorData.detail 
        : JSON.stringify(errorData.detail, null, 2);
      throw new Error(detail || '출하 생성에 실패했습니다');
    }

    return response.json();
  },

  // 출하 수정
  async updateShipment(shipmentId: string, shipmentData: ShipmentUpdate): Promise<ShipmentResponse> {
    const response = await fetch(`${API_BASE_URL}/shipments/${shipmentId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'X-Profile-ID': localStorage.getItem('profile_id') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shipmentData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || '출하 수정에 실패했습니다');
    }

    return response.json();
  },

  // 출하 삭제
  async deleteShipment(shipmentId: string): Promise<void> {
    const response = await fetch(`${SHIPMENT_API_URL}/${shipmentId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || '출하 삭제에 실패했습니다');
    }
  },

  // 출하 상태 변경
  async updateShipmentStatus(shipmentId: string, shipmentStatus: string): Promise<ShipmentResponse> {
    const response = await fetch(`${API_BASE_URL}/shipments/${shipmentId}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'X-Profile-ID': localStorage.getItem('profile_id') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ shipment_status: shipmentStatus }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: '알 수 없는 에러' }));
      const detail = typeof errorData.detail === 'string' 
        ? errorData.detail 
        : JSON.stringify(errorData.detail, null, 2);
      throw new Error(detail || '출하 상태 변경에 실패했습니다');
    }

    return response.json();
  },
}; 