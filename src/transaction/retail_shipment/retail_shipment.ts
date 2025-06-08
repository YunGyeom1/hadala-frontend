export interface RetailShipmentItem {
  id: string;
  shipment_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
  updated_at: string;
}

export interface RetailShipment {
  id: string;
  retailer_id: string;
  contract_id: string;
  center_id: string;
  wholesaler_id?: string;
  company_id: string;
  shipment_name: string;
  shipment_date: string;
  total_price?: number;
  is_finalized: boolean;
  created_at: string;
  updated_at: string;
  items: RetailShipmentItem[];
} 