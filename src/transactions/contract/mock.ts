import { ContractResponse } from './types';
import { ProductQuality, ContractStatus } from '../common/types';

export const mockContracts: ContractResponse[] = [
  {
    id: '1',
    title: '2024년 1분기 계약',
    supplier_company_name: '농산물공급(주)',
    receiver_company_name: '신선식품(주)',
    contract_datetime: new Date('2024-01-01T00:00:00'),
    contract_status: ContractStatus.APPROVED,
    items: [
      {
        id: '1-1',
        product_name: '사과',
        quality: ProductQuality.A,
        quantity: 1000,
        unit_price: 5000,
        total_price: 5000000
      },
      {
        id: '1-2',
        product_name: '사과',
        quality: ProductQuality.B,
        quantity: 2000,
        unit_price: 3000,
        total_price: 6000000
      },
      {
        id: '1-3',
        product_name: '배',
        quality: ProductQuality.A,
        quantity: 800,
        unit_price: 6000,
        total_price: 4800000
      }
    ],
    notes: '월 1회 배송 예정',
    total_price: 15800000,
    creator_username: 'admin'
  },
  {
    id: '2',
    title: '2024년 2분기 계약',
    supplier_company_name: '농산물공급(주)',
    receiver_company_name: '신선식품(주)',
    contract_datetime: new Date('2024-04-01T00:00:00'),
    contract_status: ContractStatus.COMPLETED,
    items: [
      {
        id: '2-1',
        product_name: '복숭아',
        quality: ProductQuality.A,
        quantity: 1500,
        unit_price: 7000,
        total_price: 10500000
      },
      {
        id: '2-2',
        product_name: '복숭아',
        quality: ProductQuality.B,
        quantity: 2500,
        unit_price: 5000,
        total_price: 12500000
      }
    ],
    total_price: 23000000,
    creator_username: 'admin'
  },
  {
    id: '3',
    title: '2024년 3분기 계약',
    supplier_company_name: '농산물공급(주)',
    receiver_company_name: '신선식품(주)',
    contract_datetime: new Date('2024-07-01T00:00:00'),
    contract_status: ContractStatus.PENDING,
    items: [
      {
        id: '3-1',
        product_name: '사과',
        quality: ProductQuality.A,
        quantity: 2000,
        unit_price: 5500,
        total_price: 11000000
      },
      {
        id: '3-2',
        product_name: '사과',
        quality: ProductQuality.B,
        quantity: 3000,
        unit_price: 3500,
        total_price: 10500000
      },
      {
        id: '3-3',
        product_name: '배',
        quality: ProductQuality.A,
        quantity: 1000,
        unit_price: 6500,
        total_price: 6500000
      }
    ],
    total_price: 28000000,
    creator_username: 'admin'
  }
];