export enum ProfileType {
  FARMER = 'FARMER',
  RETAILER = 'RETAILER',
  WHOLESALER = 'WHOLESALER',
  TESTER = 'TESTER'
}

export enum ProfileRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface Profile {
  id: string;
  username: string;
  type: ProfileType;
  role: ProfileRole;
  user_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ProfileCreate {
  username: string;
  type: ProfileType;
  role?: ProfileRole;
  user_id?: string;
}

export interface ProfileUpdate {
  username?: string;
  type?: ProfileType;
  role?: ProfileRole;
} 