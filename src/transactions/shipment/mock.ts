import { ShipmentResponse } from './types';
import { ProductQuality, ShipmentStatus } from '../common/types';

export const mockShipments: ShipmentResponse[] = [
  {
    id: '1',
    title: '6월 1차 출하',
    contract_id: 'contract-1',
    supplier_person_username: 'farmer_kim',
    supplier_company_name: '제주농협',
    receiver_person_username: 'wholesale_lee',
    receiver_company_name: '서울청과물유통',
    shipment_datetime: new Date('2025-06-01T08:00:00'),
    departure_center_name: '제주센터',
    arrival_center_name: '서울센터',
    shipment_status: ShipmentStatus.DELIVERED,
    notes: '신선 출하 완료',
    total_price: 200000,
    creator_username: 'admin',
    items: [
      { id: 's1-a', product_name: '청경채', quality: ProductQuality.A, quantity: 10, unit_price: 2000, total_price: 20000 },
      { id: 's1-b', product_name: '청경채', quality: ProductQuality.B, quantity: 5, unit_price: 1500, total_price: 7500 },
      { id: 's1-c', product_name: '청경채', quality: ProductQuality.C, quantity: 5, unit_price: 1000, total_price: 5000 },
      { id: 's1-d', product_name: '당근', quality: ProductQuality.A, quantity: 20, unit_price: 1000, total_price: 20000 },
      { id: 's1-e', product_name: '당근', quality: ProductQuality.B, quantity: 15, unit_price: 800, total_price: 12000 },
      { id: 's1-f', product_name: '당근', quality: ProductQuality.C, quantity: 6, unit_price: 700, total_price: 4200 },
      { id: 's1-g', product_name: '양배추', quality: ProductQuality.A, quantity: 9, unit_price: 1200, total_price: 10800 },
      { id: 's1-h', product_name: '양배추', quality: ProductQuality.B, quantity: 8, unit_price: 1000, total_price: 8000 },
      { id: 's1-i', product_name: '양배추', quality: ProductQuality.C, quantity: 6, unit_price: 800, total_price: 4800 }
    ]
  },
  {
    id: '2',
    title: '6월 2차 출하',
    contract_id: 'contract-1',
    supplier_person_username: 'farmer_kim',
    supplier_company_name: '제주농협',
    receiver_person_username: 'wholesale_lee',
    receiver_company_name: '서울청과물유통',
    shipment_datetime: new Date('2025-06-10T08:00:00'),
    departure_center_name: '제주센터',
    arrival_center_name: '서울센터',
    shipment_status: ShipmentStatus.IN_TRANSIT,
    notes: '2차 물량 배송 중',
    total_price: 100000,
    creator_username: 'admin',
    items: [
      { id: 's2-a', product_name: '청경채', quality: ProductQuality.A, quantity: 5, unit_price: 2000, total_price: 10000 },
      { id: 's2-b', product_name: '당근', quality: ProductQuality.B, quantity: 10, unit_price: 800, total_price: 8000 },
      { id: 's2-c', product_name: '양배추', quality: ProductQuality.C, quantity: 5, unit_price: 800, total_price: 4000 }
    ]
  }
];