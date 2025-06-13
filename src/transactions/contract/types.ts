import { ContractStatus, PaymentStatus, ProductQuality } from '../common/types';

export interface ContractItemBase {
  product_name: string;
  quality: ProductQuality;
  quantity: number;
  unit_price: number;
}

export interface ContractItemCreate extends ContractItemBase {}

export interface ContractItemResponse extends ContractItemBase {
  id: string;
  total_price: number;
}

export interface ContractBase {
  title: string;
  supplier_person_username?: string;
  supplier_company_name?: string;
  receiver_person_username?: string;
  receiver_company_name?: string;
  departure_center_name?: string;
  arrival_center_name?: string;
  delivery_datetime?: Date;
  contract_datetime?: Date;
  payment_due_date?: Date;
  contract_status?: ContractStatus;
  payment_status?: PaymentStatus;
  notes?: string;
}

export interface ContractCreate extends ContractBase {
  items: ContractItemCreate[];
}

export interface ContractUpdate extends Omit<ContractBase, 'title'> {
  title?: string;
  items?: ContractItemCreate[];
}

export interface ContractResponse extends ContractBase {
  id: string;
  total_price: number;
  creator_username: string;
  contract_status: ContractStatus;
  items: ContractItemResponse[];
} 