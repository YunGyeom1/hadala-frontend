// app/mocks/mockProfiles.ts

import { Profile, ProfileRole, ProfileType } from './types';

export const mockProfiles: Profile[] = [
  {
    id: '6f2a3d1c-e1c5-4f72-b8a6-8a6cf49a3340',
    username: 'farmer_jin',
    name: '진철수',
    phone: '010-1234-5678',
    email: 'jin@farm.com',
    company_id: 'farm-1',
    company_name: '진팜 협동조합',
    role: ProfileRole.MEMBER,
    type: ProfileType.FARMER,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '8c52be49-d13a-40a9-9dc6-d8df7b8961f3',
    username: 'wholesale_yoon',
    name: '윤상현',
    phone: '010-2222-3333',
    email: 'yoon@wholesale.com',
    company_id: 'wholesale-1',
    company_name: '상현유통',
    role: ProfileRole.MANAGER,
    type: ProfileType.WHOLESALER,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2af8f445-5f9e-4e2c-bf80-09b85e4f6201',
    username: 'retail_lee',
    name: '이소라',
    phone: '010-9876-5432',
    email: 'sora@retail.com',
    company_id: 'retail-1',
    company_name: '소라마트',
    role: ProfileRole.OWNER,
    type: ProfileType.RETAILER,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];