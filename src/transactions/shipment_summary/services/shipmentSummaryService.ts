import { SummaryResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface ShipmentSummaryRequest {
  start_date: string;
  end_date: string;
}

export const shipmentSummaryService = {
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
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch outbound summary: ${response.statusText}`);
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
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch inbound summary: ${response.statusText}`);
    }

    return response.json();
  },
}; 