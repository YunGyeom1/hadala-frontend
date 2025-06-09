import { CompanyCropInventory } from './inventory';

export const mockAggregatedInventory: CompanyCropInventory[] = [
  {
    id: '1',
    date: '2024-06-01',
    company_id: '1',
    center_id: '1',
    created_at: '2024-06-01T00:00:00Z',
    updated_at: '2024-06-01T00:00:00Z',
    items: [
      {
        id: '1',
        inventory_id: '1',
        crop_name: '사과',
        quality_grade: 'A',
        quantity: 1000,
        created_at: '2024-06-01T00:00:00Z'
      },
      {
        id: '2',
        inventory_id: '1',
        crop_name: '사과',
        quality_grade: 'B',
        quantity: 800,
        created_at: '2024-06-01T00:00:00Z'
      },
      {
        id: '3',
        inventory_id: '1',
        crop_name: '배',
        quality_grade: 'A',
        quantity: 500,
        created_at: '2024-06-01T00:00:00Z'
      }
    ]
  },
  {
    id: '2',
    date: '2024-06-01',
    company_id: '1',
    center_id: '2',
    created_at: '2024-06-01T00:00:00Z',
    updated_at: '2024-06-01T00:00:00Z',
    items: [
      {
        id: '4',
        inventory_id: '2',
        crop_name: '사과',
        quality_grade: 'A',
        quantity: 1200,
        created_at: '2024-06-01T00:00:00Z'
      },
      {
        id: '5',
        inventory_id: '2',
        crop_name: '사과',
        quality_grade: 'C',
        quantity: 300,
        created_at: '2024-06-01T00:00:00Z'
      },
      {
        id: '6',
        inventory_id: '2',
        crop_name: '배',
        quality_grade: 'B',
        quantity: 600,
        created_at: '2024-06-01T00:00:00Z'
      }
    ]
  },
  {
    id: '3',
    date: '2024-06-01',
    company_id: '1',
    center_id: '3',
    created_at: '2024-06-01T00:00:00Z',
    updated_at: '2024-06-01T00:00:00Z',
    items: [
      {
        id: '7',
        inventory_id: '3',
        crop_name: '사과',
        quality_grade: 'B',
        quantity: 900,
        created_at: '2024-06-01T00:00:00Z'
      },
      {
        id: '8',
        inventory_id: '3',
        crop_name: '배',
        quality_grade: 'A',
        quantity: 700,
        created_at: '2024-06-01T00:00:00Z'
      },
      {
        id: '9',
        inventory_id: '3',
        crop_name: '배',
        quality_grade: 'C',
        quantity: 400,
        created_at: '2024-06-01T00:00:00Z'
      }
    ]
  }
]; 