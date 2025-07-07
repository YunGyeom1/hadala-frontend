export enum CompanyType {
  WHOLESALER = "wholesaler",
  RETAILER = "retailer",
  FARMER = "farmer"
}

export interface CompanyBase {
  name: string;
  type: CompanyType;
}

export interface Company extends CompanyBase {
  id: string;
  owner_name: string;
  wholesale_company_detail_id?: string;
  address?: string;
  phone?: string;
  email?: string;
  business_number?: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyCreateRequest extends CompanyBase {
  owner_name: string;
  address?: string;
  phone?: string;
  email?: string;
  business_number?: string;
}

export interface CompanyUpdateRequest extends Partial<CompanyBase> {
  owner_name?: string;
  address?: string;
  phone?: string;
  email?: string;
  business_number?: string;
}

export interface CompanyFormData {
  name: string;
  owner_name: string;
  address: string;
  phone: string;
  email: string;
  business_number: string;
}

// Wholesale company detail information
export interface WholesaleCompanyDetail {
  id: string;
  company_id: string;
  business_registration_number?: string;
  address?: string;
  phone?: string;
  email?: string;
  representative?: string;
  established_year?: string;
  created_at: string;
  updated_at: string;
}

export interface WholesaleCompanyDetailCreate {
  company_id: string;
  business_registration_number?: string;
  address?: string;
  phone?: string;
  email?: string;
  representative?: string;
  established_year?: string;
}

export interface WholesaleCompanyDetailUpdate {
  business_registration_number?: string;
  address?: string;
  phone?: string;
  email?: string;
  representative?: string;
  established_year?: string;
} 