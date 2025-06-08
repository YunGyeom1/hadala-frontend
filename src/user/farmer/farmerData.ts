import type { Farmer } from './farmer';
import { TEST_USER_ID } from '../retailer/retailerData';

export const mockFarmer: Farmer = {
  id: '123e4567-e89b-12d3-a456-426614174003',
  user_id: TEST_USER_ID,
  name: 'Green Valley Farm',
  address: '789 Farm Road, Jeju',
  farm_size_m2: 50000,
  annual_output_kg: 25000,
  farm_members: 5,
  created_at: '2024-03-20T00:00:00Z',
  updated_at: '2024-03-20T00:00:00Z'
}; 