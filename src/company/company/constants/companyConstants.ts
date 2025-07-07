import { CompanyType } from '../types';

export const COMPANY_TYPE_OPTIONS = [
  { value: CompanyType.FARMER, label: 'Farmer' },
  { value: CompanyType.RETAILER, label: 'Retailer' },
  { value: CompanyType.WHOLESALER, label: 'Wholesaler' },
];

export const COMPANY_FORM_FIELDS = [
  { name: 'name', label: 'Company Name', type: 'text', required: true },
  { name: 'owner_name', label: 'Owner Name', type: 'text', required: true },
  { name: 'address', label: 'Address', type: 'text', required: false },
  { name: 'phone', label: 'Phone Number', type: 'tel', required: false },
  { name: 'email', label: 'Email', type: 'email', required: false },
  { name: 'business_number', label: 'Business Registration Number', type: 'text', required: false },
];

export const COMPANY_TABLE_COLUMNS = [
  { key: 'name', label: 'Company Name', sortable: true },
  { key: 'owner_name', label: 'Owner Name', sortable: true },
  { key: 'type', label: 'Company Type', sortable: true },
  { key: 'phone', label: 'Phone Number', sortable: false },
  { key: 'email', label: 'Email', sortable: false },
  { key: 'actions', label: 'Actions', sortable: false },
];

export const COMPANY_SEARCH_FIELDS = [
  { key: 'name', label: 'Company Name' },
  { key: 'owner_name', label: 'Owner Name' },
  { key: 'type', label: 'Company Type' },
];

export const COMPANY_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
} as const;

export const COMPANY_STATUS_LABELS = {
  [COMPANY_STATUS.ACTIVE]: 'Active',
  [COMPANY_STATUS.INACTIVE]: 'Inactive',
  [COMPANY_STATUS.PENDING]: 'Pending',
} as const; 