import { ContractStatus, PaymentStatus } from '../common/common';

export interface WholesaleContractItem {
  id: string;
  contract_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
  updated_at: string;
}

export interface WholesaleContract {
  id: string;
  farmer_id: string;
  center_id: string;
  wholesaler_id: string;
  company_id: string;
  contract_date: string;
  note?: string;
  shipment_date: string;
  total_price?: number;
  contract_status: ContractStatus;
  payment_status: PaymentStatus;
  created_at?: string;
  updated_at?: string;
  items: WholesaleContractItem[];
} 