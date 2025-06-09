import { Center, CenterWithWholesalers } from './center';

export const mockCenter: CenterWithWholesalers = {
  id: '1',
  name: '강남 집하장',
  address: '서울특별시 강남구 테헤란로 123',
  company_id: '1',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  wholesalers: [
    {
      id: '1',
      name: '신선도매',
      role: '도매업자',
      phone: '02-1234-5678',
      joined_at: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: '농산물도매',
      role: '도매업자',
      phone: '02-2345-6789',
      joined_at: '2024-01-02T00:00:00Z',
    },
  ],
}; 