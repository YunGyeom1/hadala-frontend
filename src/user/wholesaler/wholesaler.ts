export interface Wholesaler {
  id: string | null;  // UUID
  name: string;
  address?: string | null;
  created_at: string;  // datetime
  updated_at: string;  // datetime
} 