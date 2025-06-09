export interface CompanyOut {
    id: string;  // UUID
    name: string;
    description?: string | null;
    business_number: string;
    address: string;
    phone: string;
    email: string;  // EmailStr
    owner?: string | null;  // UUID
    created_at: string;  // datetime
    updated_at: string;  // datetime
  }
  
  export interface CompanyList {
    items: CompanyOut[];
    total: number;
    skip: number;
    limit: number;
  }