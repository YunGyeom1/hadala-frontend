import { useState, useCallback } from 'react';
import { CenterFormData } from '../types';
import { validateCenterForm } from '../utils/validation';

export const useCenterForm = (initialData?: Partial<CenterFormData>) => {
  const [formData, setFormData] = useState<CenterFormData>({
    name: initialData?.name || '',
    address: initialData?.address || '',
    region: initialData?.region || '',
    latitude: initialData?.latitude || '',
    longitude: initialData?.longitude || '',
    phone: initialData?.phone || '',
    operating_start: initialData?.operating_start || '',
    operating_end: initialData?.operating_end || '',
    is_operational: initialData?.is_operational ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = useCallback((field: keyof CenterFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 필드가 터치되었음을 표시
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // 실시간 검증 (터치된 필드만)
    if (touched[field]) {
      const fieldErrors = validateCenterForm({ ...formData, [field]: value });
      setErrors(prev => ({ ...prev, [field]: fieldErrors[field] || '' }));
    }
  }, [formData, touched]);

  const handleBlur = useCallback((field: keyof CenterFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    const fieldErrors = validateCenterForm(formData);
    setErrors(prev => ({ ...prev, [field]: fieldErrors[field] || '' }));
  }, [formData]);

  const validateForm = useCallback(() => {
    const validationErrors = validateCenterForm(formData);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [formData]);

  const resetForm = useCallback((newData?: Partial<CenterFormData>) => {
    setFormData({
      name: newData?.name || '',
      address: newData?.address || '',
      region: newData?.region || '',
      latitude: newData?.latitude || '',
      longitude: newData?.longitude || '',
      phone: newData?.phone || '',
      operating_start: newData?.operating_start || '',
      operating_end: newData?.operating_end || '',
      is_operational: newData?.is_operational ?? true,
    });
    setErrors({});
    setTouched({});
  }, []);

  const setFormDataFromCenter = useCallback((center: any) => {
    setFormData({
      name: center.name || '',
      address: center.address || '',
      region: center.region || '',
      latitude: center.latitude?.toString() || '',
      longitude: center.longitude?.toString() || '',
      phone: center.phone || '',
      operating_start: center.operating_start || '',
      operating_end: center.operating_end || '',
      is_operational: center.is_operational ?? true,
    });
  }, []);

  return {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setFormDataFromCenter,
  };
}; 