import { CompanyFormData } from '../types';

export const validateCompanyForm = (data: CompanyFormData): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  if (!data.name.trim()) {
    errors.name = 'Company name is required';
  } else if (data.name.length > 100) {
    errors.name = 'Company name must be 100 characters or less';
  }
  
  if (!data.owner_name.trim()) {
    errors.owner_name = 'Owner name is required';
  } else if (data.owner_name.length > 50) {
    errors.owner_name = 'Owner name must be 50 characters or less';
  }
  
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email format';
  }
  
  if (data.phone && !/^[0-9-+\s()]+$/.test(data.phone)) {
    errors.phone = 'Invalid phone number format';
  }
  
  if (data.business_number && !/^[0-9-]+$/.test(data.business_number)) {
    errors.business_number = 'Invalid business registration number format';
  }
  
  return errors;
}; 