export interface Center {
  id: string;
  name: string;
  address?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  manager_profile_id?: string;
  operating_start?: string; // HH:mm 형식
  operating_end?: string; // HH:mm 형식
  is_operational?: boolean;
}

export interface CenterCreate {
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
}

export interface CenterUpdate {
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