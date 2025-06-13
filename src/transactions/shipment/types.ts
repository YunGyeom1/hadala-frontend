import { ProductQuality, ShipmentStatus } from '../common/types';

export interface ShipmentItemBase {
  product_name: string;
  quality: ProductQuality;
  quantity: number;
  unit_price: number;
}

export interface ShipmentItemCreate extends ShipmentItemBase {}

export interface ShipmentItemResponse extends ShipmentItemBase {
  id: string;
  total_price: number;
}

export interface ShipmentBase {
  title: string;
  contract_id: string;
  supplier_person_username?: string;
  supplier_company_name?: string;
  receiver_person_username?: string;
  receiver_company_name?: string;
  shipment_datetime: Date;
  departure_center_name?: string;
  arrival_center_name?: string;
  shipment_status?: ShipmentStatus;
  notes?: string;
}

export interface ShipmentCreate extends ShipmentBase {
  items: ShipmentItemCreate[];
}

export interface ShipmentUpdate extends Omit<ShipmentBase, 'title'> {
  title?: string;
  items?: ShipmentItemCreate[];
}

export interface ShipmentResponse extends ShipmentBase {
  id: string;
  total_price: number;
  creator_username: string;
  shipment_status: ShipmentStatus;
  items: ShipmentItemResponse[];
} 