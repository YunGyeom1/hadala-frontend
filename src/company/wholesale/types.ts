export interface WholesaleCompanyDetail {
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
  monthly_transaction_volume?: number;  // 월 거래량
  daily_transport_capacity?: number;    // 일 운송가능량
  main_products?: string;               // 주요 상품 (CSV 형식)
  has_cold_storage: boolean;            // 냉장 시설 여부
  number_of_vehicles?: number;          // 보유 차량 수
  created_at: string;
  updated_at: string;
}

export interface WholesaleCompanyDetailCreate {
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
  has_cold_storage: boolean;
  number_of_vehicles?: number;
}

export interface WholesaleCompanyDetailUpdate {
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
} 