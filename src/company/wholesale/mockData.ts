import { WholesaleCompanyDetail } from './types';

export const mockWholesaleCompanyDetails: WholesaleCompanyDetail[] = [
  {
    company_id: "1",
    address: "서울시 강남구 테헤란로 123",
    region: "서울",
    latitude: 37.5665,
    longitude: 126.9780,
    description: "신선농산물 전문 도매업체",
    phone: "02-1234-5678",
    email: "contact@freshmarket.com",
    representative: "홍길동",
    business_registration_number: "123-45-67890",
    established_year: 2010,
    monthly_transaction_volume: 5000,  // 톤
    daily_transport_capacity: 200,     // 톤
    main_products: "채소,과일,수산물",
    has_cold_storage: true,
    number_of_vehicles: 15,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    company_id: "2",
    address: "부산시 해운대구 우동 456",
    region: "부산",
    latitude: 35.1796,
    longitude: 129.0756,
    description: "부산 지역 최대 농산물 도매업체",
    phone: "051-987-6543",
    email: "info@busanmarket.com",
    representative: "김철수",
    business_registration_number: "234-56-78901",
    established_year: 2015,
    monthly_transaction_volume: 3000,  // 톤
    daily_transport_capacity: 150,     // 톤
    main_products: "채소,과일,곡물",
    has_cold_storage: true,
    number_of_vehicles: 10,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  }
]; 