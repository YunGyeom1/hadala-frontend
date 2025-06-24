import { CompanyType } from '../types';

export const COMPANY_TYPE_OPTIONS = [
  { value: CompanyType.FARMER, label: '농가' },
  { value: CompanyType.RETAILER, label: '소매상' },
  { value: CompanyType.WHOLESALER, label: '도매상' },
];

export const COMPANY_FORM_FIELDS = [
  { name: 'name', label: '회사명', type: 'text', required: true },
  { name: 'owner_name', label: '대표자명', type: 'text', required: true },
  { name: 'address', label: '주소', type: 'text', required: false },
  { name: 'phone', label: '전화번호', type: 'tel', required: false },
  { name: 'email', label: '이메일', type: 'email', required: false },
  { name: 'business_number', label: '사업자등록번호', type: 'text', required: false },
];

export const COMPANY_TABLE_COLUMNS = [
  { key: 'name', label: '회사명', sortable: true },
  { key: 'owner_name', label: '대표자명', sortable: true },
  { key: 'type', label: '회사 타입', sortable: true },
  { key: 'phone', label: '전화번호', sortable: false },
  { key: 'email', label: '이메일', sortable: false },
  { key: 'actions', label: '작업', sortable: false },
];

export const COMPANY_SEARCH_FIELDS = [
  { key: 'name', label: '회사명' },
  { key: 'owner_name', label: '대표자명' },
  { key: 'type', label: '회사 타입' },
];

export const COMPANY_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
} as const;

export const COMPANY_STATUS_LABELS = {
  [COMPANY_STATUS.ACTIVE]: '활성',
  [COMPANY_STATUS.INACTIVE]: '비활성',
  [COMPANY_STATUS.PENDING]: '대기중',
} as const; 