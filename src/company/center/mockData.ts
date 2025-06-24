import { Center } from './types';

export const mockCenters: Center[] = [
  {
    id: "1",
    name: "서울 물류센터",
    address: "서울시 강남구 테헤란로 123",
    region: "서울",
    latitude: 37.5665,
    longitude: 126.9780,
    phone: "02-1234-5678",
    operating_start: "09:00",
    operating_end: "18:00",
    is_operational: true
  },
  {
    id: "2",
    name: "부산 물류센터",
    address: "부산시 해운대구 우동 456",
    region: "부산",
    latitude: 35.1796,
    longitude: 129.0756,
    phone: "051-987-6543",
    operating_start: "08:00",
    operating_end: "17:00",
    is_operational: true
  },
  {
    id: "3",
    name: "인천 물류센터",
    address: "인천시 연수구 송도동 789",
    region: "인천",
    latitude: 37.3833,
    longitude: 126.6433,
    phone: "032-123-4567",
    operating_start: "07:00",
    operating_end: "16:00",
    is_operational: true
  }
]; 