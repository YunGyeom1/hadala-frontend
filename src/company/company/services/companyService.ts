import { Company, CompanyType } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// 도매상 회사 상세 정보 타입 정의
export interface WholesaleCompanyDetail {
  id?: string;
  company_id: string;
  address?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  phone?: string;
  email?: string;
  representative?: string;
  business_registration_number?: string;
  established_year?: number;
  monthly_transaction_volume?: number;
  daily_transport_capacity?: number;
  main_products?: string;
  has_cold_storage?: boolean;
  number_of_vehicles?: number;
  created_at?: string;
  updated_at?: string;
}

export const companyService = {
  // 회사 목록 조회
  async getCompanies(): Promise<Company[]> {
    const response = await fetch(`${API_BASE_URL}/companies/search`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'X-Profile-ID': localStorage.getItem('profile_id') || '',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('회사 목록을 불러오는데 실패했습니다.');
    }
    
    return response.json();
  },

  // 내가 소속된 회사 조회
  async getMyCompany(): Promise<Company | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/companies/me`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'X-Profile-ID': localStorage.getItem('profile_id') || '',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('내 회사 정보를 불러오는데 실패했습니다.');
      }
      
      return response.json();
    } catch (error) {
      console.error('내 회사 조회 실패:', error);
      return null;
    }
  },

  // 특정 타입의 회사 조회
  async getCompanyByType(type: CompanyType): Promise<Company | null> {
    const companies = await this.getCompanies();
    return companies.find(c => c.type === type) || null;
  },

  // 회사 생성
  async createCompany(companyData: Omit<Company, 'id'>): Promise<Company> {
    const response = await fetch(`${API_BASE_URL}/companies/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'X-Profile-ID': localStorage.getItem('profile_id') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(companyData),
    });
    
    if (!response.ok) {
      throw new Error('회사 생성에 실패했습니다.');
    }
    
    return response.json();
  },

  // 회사 수정
  async updateCompany(companyId: string, companyData: Partial<Company>): Promise<Company> {
    const response = await fetch(`${API_BASE_URL}/companies/${companyId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'X-Profile-ID': localStorage.getItem('profile_id') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(companyData),
    });
    
    if (!response.ok) {
      throw new Error('회사 수정에 실패했습니다.');
    }
    
    return response.json();
  },

  // 도매상 회사 상세 정보 조회
  async getWholesaleCompanyDetail(companyId: string): Promise<WholesaleCompanyDetail | null> {
    const response = await fetch(`${API_BASE_URL}/companies/wholesale/${companyId}/detail`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'X-Profile-ID': localStorage.getItem('profile_id') || '',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log(`Wholesale detail not found for company ${companyId}`);
        return null;
      }
      const errorText = await response.text();
      throw new Error(`도매상 회사 상세 정보를 불러오는데 실패했습니다: ${errorText}`);
    }
    
    return response.json();
  },

  // 도매상 회사 상세 정보 생성/수정
  async upsertWholesaleCompanyDetail(detailData: WholesaleCompanyDetail): Promise<WholesaleCompanyDetail> {
    const companyId = detailData.company_id;
    if (!companyId) {
      throw new Error('회사 ID가 필요합니다.');
    }

    // 기존 데이터가 있으면 PUT, 없으면 POST
    const method = detailData.id ? 'PUT' : 'POST';
    const url = `${API_BASE_URL}/companies/wholesale/${companyId}/detail`;
    
    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'X-Profile-ID': localStorage.getItem('profile_id') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(detailData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || '도매상 회사 상세 정보 저장에 실패했습니다.');
    }
    
    return response.json();
  },
}; 