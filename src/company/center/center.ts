export interface Center {
  id: string;
  name: string;
  address?: string;
  company_id: string;
  created_at: string;
  updated_at?: string;
}

export interface CenterCreate {
  name: string;
  address?: string;
  company_id: string;
}

export interface CenterUpdate {
  name?: string;
  address?: string;
}

export interface CenterFilter {
  name?: string;
  address?: string;
  company_id?: string;
}

export interface WholesalerInCenter {
  id: string;
  name: string;
  role: string;
  phone?: string;
  joined_at: string;
}

export interface CenterWithWholesalers extends Center {
  wholesalers: WholesalerInCenter[];
}

export interface CenterOut {
  id: string;
  name: string;
  address?: string;
  created_at: string;
  updated_at: string;
} 