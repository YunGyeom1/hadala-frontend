export interface User {
  id: string;
  email: string;
  name: string;
  picture_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile extends User {
  phone?: string;
  address?: string;
  company_id?: string;
  
} 