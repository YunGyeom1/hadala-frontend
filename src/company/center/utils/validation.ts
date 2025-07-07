import { CenterFormData } from '../types';

export const validateCenterForm = (data: CenterFormData): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  if (!data.name.trim()) {
    errors.name = 'Center name is required';
  } else if (data.name.length > 100) {
    errors.name = 'Center name must be 100 characters or less';
  }
  
  if (data.phone && !/^[0-9-+\s()]+$/.test(data.phone)) {
    errors.phone = 'Invalid phone number format';
  }
  
  if (data.latitude) {
    const lat = parseFloat(data.latitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      errors.latitude = 'Latitude must be a number between -90 and 90';
    }
  }
  
  if (data.longitude) {
    const lng = parseFloat(data.longitude);
    if (isNaN(lng) || lng < -180 || lng > 180) {
      errors.longitude = 'Longitude must be a number between -180 and 180';
    }
  }
  
  if (data.operating_start && data.operating_end) {
    const start = new Date(`2000-01-01T${data.operating_start}`);
    const end = new Date(`2000-01-01T${data.operating_end}`);
    
    if (start >= end) {
      errors.operating_end = 'End time must be later than start time';
    }
  }
  
  return errors;
}; 