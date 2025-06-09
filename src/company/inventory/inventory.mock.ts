import { CompanyCropInventory } from './inventory';

export const mockInventory: CompanyCropInventory = {
  id: '1',
  date: '2024-06-01',
  company_id: 'C001',
  center_id: 'CTR01',
  created_at: '2024-06-01T00:00:00Z',
  updated_at: '2024-06-01T00:00:00Z',
  items: [
    {
      id: '1',
      inventory_id: '1',
      crop_name: '사과',
      quality_grade: 'A',
      quantity: 1000,
      created_at: '2024-06-01T00:00:00Z',
    },
    {
      id: '2',
      inventory_id: '1',
      crop_name: '사과',
      quality_grade: 'B',
      quantity: 800,
      created_at: '2024-06-01T00:00:00Z',
    },
    {
      id: '3',
      inventory_id: '1',
      crop_name: '배',
      quality_grade: 'A',
      quantity: 500,
      created_at: '2024-06-01T00:00:00Z',
    },
    {
      id: '4',
      inventory_id: '1',
      crop_name: '배',
      quality_grade: 'C',
      quantity: 300,
      created_at: '2024-06-01T00:00:00Z',
    },
  ],
}; 