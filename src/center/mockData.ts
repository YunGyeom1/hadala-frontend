import { Center } from './types';

export const mockCenters: Center[] = [
  {
    id: '1',
    company_id: '1',
    name: '강남 집하장',
    type: 'COLLECTION_CENTER',
    address: '서울시 강남구 테헤란로 123',
    phone: '02-1234-5678',
    status: 'ACTIVE'
  },
  {
    id: '2',
    company_id: '1',
    name: '홍대 집하장',
    type: 'COLLECTION_CENTER',
    address: '서울시 마포구 홍대입구로 456',
    phone: '02-2345-6789',
    status: 'ACTIVE'
  },
  {
    id: '3',
    company_id: '2',
    name: '부산 집하장',
    type: 'COLLECTION_CENTER',
    address: '부산시 해운대구 우동 789',
    phone: '051-3456-7890',
    status: 'ACTIVE'
  }
]; 