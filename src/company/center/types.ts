export interface Center {
  id: string;
  name: string;
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
}

export interface CenterCreateRequest {
  name: string;
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