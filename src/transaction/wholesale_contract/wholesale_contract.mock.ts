import { ContractStatus, PaymentStatus } from '../common/common';
import type { WholesaleContract } from './wholesale_contract';

export const mockWholesaleContracts: WholesaleContract[] = [
  {
    id: '1',
    farmer_id: 'farmer1',
    center_id: 'center1',
    wholesaler_id: 'wholesaler1',
    company_id: 'company1',
    contract_date: '2024-03-20',
    shipment_date: '2024-03-25',
    note: '테스트 도매계약서입니다.',
    total_price: 3000000,
    contract_status: ContractStatus.PENDING,
    payment_status: PaymentStatus.PENDING,
    created_at: '2024-03-20T00:00:00Z',
    updated_at: '2024-03-20T00:00:00Z',
    items: [
      {
        id: '1',
        contract_id: '1',
        product_id: '사과',
        quantity: 300,
        unit_price: 5000,
        total_price: 1500000,
        created_at: '2024-03-20T00:00:00Z',
        updated_at: '2024-03-20T00:00:00Z'
      },
      {
        id: '2',
        contract_id: '1',
        product_id: '배',
        quantity: 300,
        unit_price: 5000,
        total_price: 1500000,
        created_at: '2024-03-20T00:00:00Z',
        updated_at: '2024-03-20T00:00:00Z'
      }
    ]
  },
  {
    id: '2',
    farmer_id: 'farmer2',
    center_id: 'center2',
    wholesaler_id: 'wholesaler2',
    company_id: 'company2',
    contract_date: '2024-03-21',
    shipment_date: '2024-03-26',
    note: '두 번째 테스트 도매계약서입니다.',
    total_price: 4000000,
    contract_status: ContractStatus.APPROVED,
    payment_status: PaymentStatus.PAID,
    created_at: '2024-03-21T00:00:00Z',
    updated_at: '2024-03-21T00:00:00Z',
    items: [
      {
        id: '3',
        contract_id: '2',
        product_id: '포도',
        quantity: 250,
        unit_price: 8000,
        total_price: 2000000,
        created_at: '2024-03-21T00:00:00Z',
        updated_at: '2024-03-21T00:00:00Z'
      },
      {
        id: '4',
        contract_id: '2',
        product_id: '복숭아',
        quantity: 250,
        unit_price: 8000,
        total_price: 2000000,
        created_at: '2024-03-21T00:00:00Z',
        updated_at: '2024-03-21T00:00:00Z'
      }
    ]
  }
]; 