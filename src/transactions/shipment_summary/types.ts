import { ProductQuality } from "../common/types";

export interface ShipmentSummaryRow {
    shipment_date: string;
    center_name: string;
    product_name: string;
    shipment_type: string;
    quality: ProductQuality;
    quantity: number;
    destination: string;
  }
  
  export interface ShipmentSummary {
    rows: ShipmentSummaryRow[];
  }