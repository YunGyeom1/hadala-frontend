// app/types/profile/type.ts

export type UUID = string; // Consider UUID format as string

export enum ProfileType {
  FARMER = 'farmer',
  RETAILER = 'retailer',
  WHOLESALER = 'wholesaler'
}

export enum ProfileRole {
  MEMBER = 'member',
  MANAGER = 'manager',
  OWNER = 'owner'
}

export interface ProfileBase {
  name?: string;
  phone?: string;
  email?: string;
}

export interface Profile extends ProfileBase {
  id: UUID;
  username: string;
  company_id?: string;
  company_name?: string;
  role: ProfileRole;
  type: ProfileType;
  created_at: string;
  updated_at: string;
}

// ✅ For creation requests
export interface ProfileCreateRequest extends ProfileBase {
  user_id?: UUID;
  username: string;
  type: ProfileType;
}

// ✅ For update requests
export interface ProfileUpdateRequest extends ProfileBase {
  id: UUID;
  user_id?: UUID;
  username?: string;
}

// ✅ Response type
export interface ProfileResponse extends Profile {
  // Inherits from Profile interface, so no additional fields needed
}
