import { ContractStatus, ProductQuality } from '../common/types';



export interface ContractItemBase {
  product_id: string;
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
  contract_datetime: string;
  delivery_datetime: string;
  supplier_company_id: string;
  supplier_company_name: string;
  supplier_person_username: string;
  receiver_company_id: string;
  receiver_company_name: string;
  receiver_person_username: string;
  departure_center_id: string;
  departure_center_name: string;
  arrival_center_id: string;
  arrival_center_name: string;
  contract_status: ContractStatus;
  notes: string;
  items: ContractItemBase[];
}

export interface ContractCreate extends ContractBase {
  items: ContractItemCreate[];
}

export interface ContractUpdate extends Omit<ContractBase, 'title' | 'items'> {
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