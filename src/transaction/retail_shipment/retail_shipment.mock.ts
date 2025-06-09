import { ContractStatus, PaymentStatus } from '../common/common';
import type { RetailShipment } from './retail_shipment';

export const mockRetailShipments: RetailShipment[] = [
  {
    id: '1',
    contract_id: 'contract1',
    retailer_id: 'retailer1',
    center_id: 'center1',
    wholesaler_id: 'wholesaler1',
    company_id: 'company1',
    shipment_name: '3월 1차 소매배송',
    shipment_date: '2024-03-20',
    total_price: 1500000,
    is_finalized: false,
    created_at: '2024-03-20T00:00:00Z',
    updated_at: '2024-03-20T00:00:00Z',
    items: [
      {
        id: '1',
        shipment_id: '1',
        product_id: '사과',
        quantity: 100,
        unit_price: 5000,
        total_price: 500000,
        created_at: '2024-03-20T00:00:00Z',
        updated_at: '2024-03-20T00:00:00Z'
      },
      {
        id: '2',
        shipment_id: '1',
        product_id: '배',
        quantity: 200,
        unit_price: 5000,
        total_price: 1000000,
        created_at: '2024-03-20T00:00:00Z',
        updated_at: '2024-03-20T00:00:00Z'
      }
    ]
  },
  {
    id: '2',
    contract_id: 'contract2',
    retailer_id: 'retailer2',
    center_id: 'center2',
    wholesaler_id: 'wholesaler2',
    company_id: 'company2',
    shipment_name: '3월 2차 소매배송',
    shipment_date: '2024-03-21',
    total_price: 2000000,
    is_finalized: true,
    created_at: '2024-03-21T00:00:00Z',
    updated_at: '2024-03-21T00:00:00Z',
    items: [
      {
        id: '3',
        shipment_id: '2',
        product_id: '포도',
        quantity: 150,
        unit_price: 8000,
        total_price: 1200000,
        created_at: '2024-03-21T00:00:00Z',
        updated_at: '2024-03-21T00:00:00Z'
      },
      {
        id: '4',
        shipment_id: '2',
        product_id: '복숭아',
        quantity: 100,
        unit_price: 8000,
        total_price: 800000,
        created_at: '2024-03-21T00:00:00Z',
        updated_at: '2024-03-21T00:00:00Z'
      }
    ]
  }
]; 