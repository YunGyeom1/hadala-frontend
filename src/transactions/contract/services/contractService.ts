import { ContractResponse, ContractCreate, ContractUpdate } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const contractService = {
  // 계약 목록 조회
  async getContracts(params?: {
    skip?: number;
    limit?: number;
    start_date?: string;
    end_date?: string;
    contract_status?: string;
    is_supplier?: boolean;
  }): Promise<ContractResponse[]> {
    const searchParams = new URLSearchParams();
    
    if (params?.skip !== undefined) searchParams.append('skip', params.skip.toString());
    if (params?.limit !== undefined) searchParams.append('limit', params.limit.toString());
    if (params?.start_date) searchParams.append('start_date', params.start_date);
    if (params?.end_date) searchParams.append('end_date', params.end_date);
    if (params?.contract_status) searchParams.append('contract_status', params.contract_status);
    if (params?.is_supplier !== undefined) searchParams.append('is_supplier', params.is_supplier.toString());

    const url = `${API_BASE_URL}/contracts/?${searchParams.toString()}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'X-Profile-ID': localStorage.getItem('profile_id') || '',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || '계약 목록을 불러오는데 실패했습니다');
    }

    return response.json();
  },

  // 특정 계약 조회
  async getContract(contractId: string): Promise<ContractResponse> {
    const response = await fetch(`${API_BASE_URL}/contracts/${contractId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'X-Profile-ID': localStorage.getItem('profile_id') || '',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || '계약 정보를 불러오는데 실패했습니다');
    }

    return response.json();
  },

  // 계약 생성
  async createContract(contractData: ContractCreate): Promise<ContractResponse> {
    const response = await fetch(`${API_BASE_URL}/contracts/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'X-Profile-ID': localStorage.getItem('profile_id') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contractData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: '알 수 없는 에러' }));
      // 상세 에러 내용을 JSON 문자열로 변환하여 에러 메시지로 사용
      const detail = typeof errorData.detail === 'string' 
        ? errorData.detail 
        : JSON.stringify(errorData.detail, null, 2);
      throw new Error(detail || '계약 생성에 실패했습니다');
    }

    return response.json();
  },

  // 계약 수정
  async updateContract(contractId: string, contractData: ContractUpdate): Promise<ContractResponse> {
    const response = await fetch(`${API_BASE_URL}/contracts/${contractId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'X-Profile-ID': localStorage.getItem('profile_id') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contractData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || '계약 수정에 실패했습니다');
    }

    return response.json();
  },

  // 계약 삭제
  async deleteContract(contractId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/contracts/${contractId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'X-Profile-ID': localStorage.getItem('profile_id') || '',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || '계약 삭제에 실패했습니다');
    }
  },

  // 계약 상태 변경
  async updateContractStatus(contractId: string, contractStatus: string): Promise<ContractResponse> {
    const response = await fetch(`${API_BASE_URL}/contracts/${contractId}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'X-Profile-ID': localStorage.getItem('profile_id') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contract_status: contractStatus }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: '알 수 없는 에러' }));
      const detail = typeof errorData.detail === 'string' 
        ? errorData.detail 
        : JSON.stringify(errorData.detail, null, 2);
      throw new Error(detail || '계약 상태 변경에 실패했습니다');
    }

    return response.json();
  },

  // 결제 상태 변경
  async updatePaymentStatus(contractId: string, paymentStatus: string): Promise<ContractResponse> {
    const response = await fetch(`${API_BASE_URL}/contracts/${contractId}/payment-status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'X-Profile-ID': localStorage.getItem('profile_id') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ payment_status: paymentStatus }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: '알 수 없는 에러' }));
      const detail = typeof errorData.detail === 'string' 
        ? errorData.detail 
        : JSON.stringify(errorData.detail, null, 2);
      throw new Error(detail || '결제 상태 변경에 실패했습니다');
    }

    return response.json();
  },
}; 