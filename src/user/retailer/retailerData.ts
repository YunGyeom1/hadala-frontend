import type { Retailer } from './retailer';

export const TEST_USER_ID = '123e4567-e89b-12d3-a456-426614174000';

export const mockRetailer: Retailer = {
  id: '123e4567-e89b-12d3-a456-426614174001',
  user_id: TEST_USER_ID,
  name: 'Fresh Market',
  address: '123 Market Street, Seoul',
  description: 'A premium grocery store specializing in fresh local produce',
  created_at: '2024-03-20T00:00:00Z',
  updated_at: '2024-03-20T00:00:00Z'
}; 