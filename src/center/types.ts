export interface Center {
  id: string;
  company_id: string;
  name: string;
  type: 'COLLECTION_CENTER';  // 농작물 집하장
  address?: string;
  phone?: string;
  status: 'ACTIVE' | 'INACTIVE';
} 