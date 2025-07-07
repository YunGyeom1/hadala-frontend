import { Company, CompanyType } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Wholesale company detail information type definition
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
  // Get company list
  async getCompanies(): Promise<Company[]> {
    const response = await fetch(`${API_BASE_URL}/companies/search`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'X-Profile-ID': localStorage.getItem('profile_id') || '',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to load company list.');
    }
    
    return response.json();
  },

  // Get my company
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
        throw new Error('Failed to load my company information.');
      }
      
      return response.json();
    } catch (error) {
      console.error('Failed to get my company:', error);
      return null;
    }
  },

  // Get company by type
  async getCompanyByType(type: CompanyType): Promise<Company | null> {
    const companies = await this.getCompanies();
    return companies.find(c => c.type === type) || null;
  },

  // Create company
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
      throw new Error('Failed to create company.');
    }
    
    return response.json();
  },

  // Update company
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
      throw new Error('Failed to update company.');
    }
    
    return response.json();
  },

  // Get wholesale company detail information
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
      throw new Error(`Failed to load wholesale company detail information: ${errorText}`);
    }
    
    return response.json();
  },

  // Create/update wholesale company detail information
  async upsertWholesaleCompanyDetail(detailData: WholesaleCompanyDetail): Promise<WholesaleCompanyDetail> {
    const companyId = detailData.company_id;
    if (!companyId) {
      throw new Error('Company ID is required.');
    }

    // Always use PUT (backend handles create/update automatically)
    const url = `${API_BASE_URL}/companies/wholesale/${companyId}/detail`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'X-Profile-ID': localStorage.getItem('profile_id') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(detailData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to save wholesale company detail information.');
    }
    
    return response.json();
  },
}; 