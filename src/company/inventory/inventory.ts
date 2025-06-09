export interface InventoryItem {
  id: string;
  inventory_id: string;
  crop_name: string;
  quality_grade: string;
  quantity: number;
  created_at: string;
}

export interface InventoryItemCreate {
  crop_name: string;
  quality_grade: string;
  quantity: number;
}

export interface InventoryItemUpdate {
  crop_name?: string;
  quality_grade?: string;
  quantity?: number;
}

export interface Inventory {
  id: string;
  date: string;
  center_id: string;
  created_at: string;
  updated_at: string;
  items: InventoryItem[];
}

export interface InventoryCreate {
  date: string;
  center_id: string;
  items: InventoryItemCreate[];
}

export interface InventoryUpdate {
  date?: string;
  center_id?: string;
  items?: InventoryItemUpdate[];
}

export interface InventoryFilter {
  center_id?: string;
  date?: string;
  crop_name?: string;
  quality_grade?: string;
}

export interface DailySettlement {
  id?: string;
  date: string;
  center_id?: string;
  total_wholesale_in_kg: number;
  total_wholesale_in_price: number;
  total_retail_out_kg: number;
  total_retail_out_price: number;
  discrepancy_in_kg: number;
  discrepancy_out_kg: number;
  total_in_kg: number;
  total_out_kg: number;
  created_at?: string;
  updated_at?: string;
} 