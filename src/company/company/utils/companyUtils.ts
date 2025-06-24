import { CompanyType } from '../types';

export const getCompanyTypeLabel = (type: CompanyType): string => {
  switch (type) {
    case CompanyType.FARMER:
      return '농가';
    case CompanyType.RETAILER:
      return '소매상';
    case CompanyType.WHOLESALER:
      return '도매상';
    default:
      return '알 수 없음';
  }
};

export const getCompanyTypeColor = (type: CompanyType): string => {
  switch (type) {
    case CompanyType.FARMER:
      return 'bg-green-100 text-green-800';
    case CompanyType.RETAILER:
      return 'bg-blue-100 text-blue-800';
    case CompanyType.WHOLESALER:
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  // 숫자만 추출
  const numbers = phone.replace(/[^0-9]/g, '');
  
  if (numbers.length === 11) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
  } else if (numbers.length === 10) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
  }
  
  return phone;
};

export const formatBusinessNumber = (businessNumber: string): string => {
  if (!businessNumber) return '';
  
  const numbers = businessNumber.replace(/[^0-9]/g, '');
  
  if (numbers.length === 10) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5)}`;
  }
  
  return businessNumber;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}; 