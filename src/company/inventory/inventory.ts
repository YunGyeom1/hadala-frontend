export interface CompanyCropInventory {
  id: string;
  date: string;
  company_id: string;
  center_id: string;
  created_at: string;
  updated_at: string;
  items: CompanyCropInventoryItem[];
}

export interface CompanyCropInventoryItem {
  id: string;
  inventory_id: string;
  crop_name: string;
  quality_grade: 'A' | 'B' | 'C';
  quantity: number;
  created_at: string;
}

export interface CompanyCropInventoryCreate {
  date: string;
  company_id: string;
  center_id: string;
  items: Omit<CompanyCropInventoryItem, 'id' | 'inventory_id' | 'created_at'>[];
}

export interface CompanyCropInventoryUpdate {
  date?: string;
  items?: Omit<CompanyCropInventoryItem, 'id' | 'inventory_id' | 'created_at'>[];
} 