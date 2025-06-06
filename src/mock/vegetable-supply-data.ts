// src/mock/vegetable-supply-data.ts

export type Vegetable = {
  name: string;
  grade: string;
  quantity: number;
  center: string;
  date: string;
  provider: string;
};

export const vegetableSupplyData: Vegetable[] = [
  {
    name: '상추',
    grade: '특',
    quantity: 30,
    center: '서울A집하장',
    date: '2025-06-05',
    provider: '김철수',
  },
  {
    name: '배추',
    grade: '상',
    quantity: 50,
    center: '대구B집하장',
    date: '2025-06-04',
    provider: '이영희',
  },
  {
    name: '당근',
    grade: '보통',
    quantity: 40,
    center: '부산C집하장',
    date: '2025-06-03',
    provider: '박민수',
  },
];