export interface Center {
  id: string;
  name: string;
  company_id: string;
  address?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  manager_profile_id?: string;
  operating_start?: string;
  operating_end?: string;
  is_operational?: boolean;
  company_name?: string;
  created_at: string;
  updated_at: string;
}

export interface CenterFormData {
  name: string;
  address: string;
  region: string;
  latitude: string;
  longitude: string;
  phone: string;
  operating_start: string;
  operating_end: string;
  is_operational: boolean;
}

export interface CenterCreateRequest {
  name: string;
  address?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  operating_start?: string;
  operating_end?: string;
  is_operational?: boolean;
}

export interface CenterUpdateRequest {
  name?: string;
  address?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  manager_profile_id?: string;
  operating_start?: string;
  operating_end?: string;
  is_operational?: boolean;
} 