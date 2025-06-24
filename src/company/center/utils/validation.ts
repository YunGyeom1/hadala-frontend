import { CenterFormData } from '../types';

export const validateCenterForm = (data: CenterFormData): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  if (!data.name.trim()) {
    errors.name = '센터명은 필수입니다';
  } else if (data.name.length > 100) {
    errors.name = '센터명은 100자 이하여야 합니다';
  }
  
  if (data.phone && !/^[0-9-+\s()]+$/.test(data.phone)) {
    errors.phone = '올바른 전화번호 형식이 아닙니다';
  }
  
  if (data.latitude) {
    const lat = parseFloat(data.latitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      errors.latitude = '위도는 -90에서 90 사이의 숫자여야 합니다';
    }
  }
  
  if (data.longitude) {
    const lng = parseFloat(data.longitude);
    if (isNaN(lng) || lng < -180 || lng > 180) {
      errors.longitude = '경도는 -180에서 180 사이의 숫자여야 합니다';
    }
  }
  
  if (data.operating_start && data.operating_end) {
    const start = new Date(`2000-01-01T${data.operating_start}`);
    const end = new Date(`2000-01-01T${data.operating_end}`);
    
    if (start >= end) {
      errors.operating_end = '종료 시간은 시작 시간보다 늦어야 합니다';
    }
  }
  
  return errors;
}; 