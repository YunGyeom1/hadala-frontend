import { useState, useCallback } from 'react';
import { CompanyFormData, CompanyType } from '../types';
import { validateCompanyForm } from '../utils/validation';

export const useCompanyForm = (initialData?: Partial<CompanyFormData>) => {
  const [formData, setFormData] = useState<CompanyFormData>({
    name: initialData?.name || '',
    owner_name: initialData?.owner_name || '',
    address: initialData?.address || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    business_number: initialData?.business_number || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = useCallback((field: keyof CompanyFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 필드가 터치되었음을 표시
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // 실시간 검증 (터치된 필드만)
    if (touched[field]) {
      const fieldErrors = validateCompanyForm({ ...formData, [field]: value });
      setErrors(prev => ({ ...prev, [field]: fieldErrors[field] || '' }));
    }
  }, [formData, touched]);

  const handleBlur = useCallback((field: keyof CompanyFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    const fieldErrors = validateCompanyForm(formData);
    setErrors(prev => ({ ...prev, [field]: fieldErrors[field] || '' }));
  }, [formData]);

  const validateForm = useCallback(() => {
    const validationErrors = validateCompanyForm(formData);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [formData]);

  const resetForm = useCallback((newData?: Partial<CompanyFormData>) => {
    setFormData({
      name: newData?.name || '',
      owner_name: newData?.owner_name || '',
      address: newData?.address || '',
      phone: newData?.phone || '',
      email: newData?.email || '',
      business_number: newData?.business_number || '',
    });
    setErrors({});
    setTouched({});
  }, []);

  const setFormDataFromCompany = useCallback((company: any) => {
    setFormData({
      name: company.name || '',
      owner_name: company.owner_name || '',
      address: company.address || '',
      phone: company.phone || '',
      email: company.email || '',
      business_number: company.business_number || '',
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
    setFormDataFromCompany,
  };
}; 