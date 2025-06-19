import { Company, CompanyType } from '../company/types';

export const mockCompanies: Company[] = [
  {
    id: "1",
    name: "신선농산물 도매",
    type: CompanyType.WHOLESALER,
    owner_name: "홍길동",
    wholesale_company_detail_id: "1"
  },
  {
    id: "2",
    name: "신선마트",
    type: CompanyType.RETAILER,
    owner_name: "김철수"
  },
  {
    id: "3",
    name: "행복농장",
    type: CompanyType.FARMER,
    owner_name: "이영희"
  },
  {
    id: '1',
    name: '농부 농장',
    type: CompanyType.FARMER,
    owner_name: '홍길동',
    address: '서울시 강남구',
    phone: '02-1234-5678',
    email: 'farmer@example.com',
    business_number: '123-45-67890',
  },
  {
    id: '2',
    name: '도매상사',
    type: CompanyType.WHOLESALER,
    owner_name: '김철수',
    address: '서울시 서초구',
    phone: '02-2345-6789',
    email: 'wholesaler@example.com',
    business_number: '234-56-78901',
  },
  {
    id: '3',
    name: '소매상점',
    type: CompanyType.RETAILER,
    owner_name: '이영희',
    address: '서울시 송파구',
    phone: '02-3456-7890',
    email: 'retailer@example.com',
    business_number: '345-67-89012',
  },
];

export const mockCompanyUsers = [
  {
    id: '1',
    company_id: '2',
    name: '김철수',
    email: 'owner@example.com',
    phone: '010-1234-5678',
    role: 'OWNER',
    status: 'ACTIVE',
  },
  {
    id: '2',
    company_id: '2',
    name: '박지성',
    email: 'manager1@example.com',
    phone: '010-2345-6789',
    role: 'MANAGER',
    status: 'ACTIVE',
  },
  {
    id: '3',
    company_id: '2',
    name: '이수진',
    email: 'manager2@example.com',
    phone: '010-3456-7890',
    role: 'MANAGER',
    status: 'ACTIVE',
  },
  {
    id: '4',
    company_id: '2',
    name: '최민수',
    email: 'staff1@example.com',
    phone: '010-4567-8901',
    role: 'STAFF',
    status: 'ACTIVE',
  },
  {
    id: '5',
    company_id: '2',
    name: '정다은',
    email: 'staff2@example.com',
    phone: '010-5678-9012',
    role: 'STAFF',
    status: 'ACTIVE',
  },
]; 