export interface Retailer {
  id: string;  // UUID
  user_id?: string | null;  // UUID
  name: string;
  address?: string | null;
  description?: string | null;
  created_at: string;  // datetime
  updated_at: string;  // datetime
} 