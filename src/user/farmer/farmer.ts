export interface Farmer {
  id: string;  // UUID4
  user_id?: string | null;  // UUID4
  name: string;
  address?: string | null;
  farm_size_m2?: number | null;
  annual_output_kg?: number | null;
  farm_members?: number | null;
  created_at: string;  // datetime
  updated_at: string;  // datetime
} 