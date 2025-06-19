export enum CompanyType {
  WHOLESALER = "wholesaler",
  RETAILER = "retailer",
  FARMER = "farmer"
}

type UUID = string;

export interface CompanyBase {
  name: string;
  type: CompanyType;
}

export interface Company extends CompanyBase {
  id: UUID;
  owner_name: string;
  wholesale_company_detail_id?: UUID;
  address?: string;
  phone?: string;
  email?: string;
  business_number?: string;
}

export type CompanyCreateRequest = Omit<Company, 'id'>;
