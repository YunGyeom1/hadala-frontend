import { CompanyFormData } from '../types';

export const validateCompanyForm = (data: CompanyFormData): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  if (!data.name.trim()) {
    errors.name = '회사명은 필수입니다';
  } else if (data.name.length > 100) {
    errors.name = '회사명은 100자 이하여야 합니다';
  }
  
  if (!data.owner_name.trim()) {
    errors.owner_name = '대표자명은 필수입니다';
  } else if (data.owner_name.length > 50) {
    errors.owner_name = '대표자명은 50자 이하여야 합니다';
  }
  
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = '올바른 이메일 형식이 아닙니다';
  }
  
  if (data.phone && !/^[0-9-+\s()]+$/.test(data.phone)) {
    errors.phone = '올바른 전화번호 형식이 아닙니다';
  }
  
  if (data.business_number && !/^[0-9-]+$/.test(data.business_number)) {
    errors.business_number = '올바른 사업자등록번호 형식이 아닙니다';
  }
  
  return errors;
}; 