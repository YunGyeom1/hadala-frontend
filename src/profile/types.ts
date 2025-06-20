// app/types/profile/type.ts

export type UUID = string; // UUID 형식을 string으로 간주

export enum ProfileType {
  FARMER = 'FARMER',
  RETAILER = 'RETAILER',
  WHOLESALER = 'WHOLESALER'
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
  company_id?: UUID;
  company_name?: string;
  role: ProfileRole;
  type: ProfileType;
  created_at: string;
  updated_at: string;
}

// ✅ 생성 요청용
export interface ProfileCreateRequest extends ProfileBase {
  user_id?: UUID;
  username: string;
  type: ProfileType;
}

// ✅ 수정 요청용
export interface ProfileUpdateRequest extends ProfileBase {
  id: UUID;
  user_id?: UUID;
  username?: string;
}

// ✅ 응답 타입
export interface ProfileResponse extends Profile {
  // Profile 인터페이스를 상속받으므로 추가 필드가 필요 없음
}

// ✅ 역할 변경용
export interface ProfileRoleUpdateRequest {
  role: ProfileRole;
}

// ✅ 회사 변경용
export interface ProfileCompanyUpdateRequest {
  company_id: UUID;
}