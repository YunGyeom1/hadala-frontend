import { ShipmentStatus, ProductQuality } from '../common/types';
import { Profile } from '@/profile/types';
import { Company } from '@/company/company/types';
import { Center } from '@/company/center/types';

export interface ShipmentItemBase {
  product_name: string;
  quality: ProductQuality;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface ShipmentItemCreate extends ShipmentItemBase {
  shipment_id?: string;
}

export interface ShipmentItemResponse extends ShipmentItemBase {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface ShipmentBase {
  title: string;
  notes?: string;
  contract_id: string;
  supplier_person_id?: string;
  supplier_company_id?: string;
  receiver_person_id?: string;
  receiver_company_id?: string;
  departure_center_id?: string;
  arrival_center_id?: string;
  shipment_datetime: string;
  shipment_status: ShipmentStatus;
}

export interface ShipmentCreate extends ShipmentBase {
  items: ShipmentItemCreate[];
}

export interface ShipmentUpdate extends Partial<ShipmentBase> {
  items?: ShipmentItemCreate[];
}

export interface ShipmentResponse extends ShipmentBase {
  id: string;
  creator_id: string;
  created_at: string;
  updated_at: string;
  items: ShipmentItemResponse[];
  
  // 관계 데이터 (백엔드에서 제공하는 경우)
  contract?: any;
  creator?: Profile;
  supplier_person?: Profile;
  supplier_company?: Company;
  receiver_person?: Profile;
  receiver_company?: Company;
  departure_center?: Center;
  arrival_center?: Center;
}

// Additional types for form handling
export interface ShipmentItem {
  product_name: string;
  quality: ProductQuality;
  quantity: number;
  unit_price: number;
  total_price?: number;
}

export interface ShipmentFormData {
  title: string;
  contract_id: string;
  shipment_datetime: string;
  shipment_status: ShipmentStatus;
  supplier_person_id?: string;
  supplier_company_id?: string;
  receiver_person_id?: string;
  receiver_company_id?: string;
  departure_center_id?: string;
  arrival_center_id?: string;
  notes: string;
  items: ShipmentItem[];
}

// Re-export commonly used types for convenience
export type { Profile, Company, Center }; 