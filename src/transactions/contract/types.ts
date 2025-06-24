import { ContractStatus, PaymentStatus, ProductQuality } from '../common/types';
import { Profile } from '@/profile/types';
import { Company } from '@/company/company/types';
import { Center } from '@/company/center/types';

export interface ContractItemBase {
  product_name: string;
  quality: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface ContractItemCreate extends ContractItemBase {
  // contract_id will be set by backend when creating items
}

export interface ContractItemResponse extends ContractItemBase {
  id: string;
  total_price: number;
  created_at: string;
  updated_at: string;
}

export interface ContractBase {
  title: string;
  notes?: string;
  supplier_contractor_id?: string;
  supplier_company_id?: string;
  receiver_contractor_id?: string;
  receiver_company_id?: string;
  departure_center_id?: string;
  arrival_center_id?: string;
  contract_datetime?: string;
  delivery_datetime?: string;
  payment_due_date?: string;
  contract_status: ContractStatus;
  payment_status?: PaymentStatus;
}

export interface ContractCreate extends ContractBase {
  items: ContractItemCreate[];
}

export interface ContractUpdate extends Partial<ContractBase> {
  items?: ContractItemCreate[];
}

export interface ContractResponse extends ContractBase {
  id: string;
  total_price: number;
  creator_id: string;
  next_contract_id?: string;
  created_at: string;
  updated_at: string;
  items: ContractItemResponse[];
  
  // 관계 데이터 (백엔드에서 제공하는 경우)
  supplier_contractor?: Profile;
  supplier_company?: Company;
  receiver_contractor?: Profile;
  receiver_company?: Company;
  departure_center?: Center;
  arrival_center?: Center;
  creator?: Profile;
}

// Additional types for form handling
export interface ContractItem {
  product_id: string;
  quality: string;
  quantity: number;
  unit_price: number;
  total_price?: number;
}

export interface ContractFormData {
  title: string;
  contract_datetime: string;
  delivery_datetime: string;
  payment_due_date?: string;
  contract_status?: string;
  payment_status?: string;
  supplier_person_id?: string;
  receiver_person_id?: string;
  supplier_company_id?: string;
  receiver_company_id?: string;
  departure_center_id?: string;
  arrival_center_id?: string;
  notes: string;
  items: ContractItem[];
}

// Re-export commonly used types for convenience
export type { Profile, Company, Center }; 