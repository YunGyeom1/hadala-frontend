export interface Company {
  id: string;
  name: string;
  description?: string;
  business_number: string;
  address: string;
  phone: string;
  email: string;
  owner?: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyCreate {
  name: string;
  description?: string;
  business_number: string;
  address: string;
  phone: string;
  email: string;
}

export interface CompanyUpdate {
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface CompanyList {
  items: Company[];
  total: number;
  skip: number;
  limit: number;
}