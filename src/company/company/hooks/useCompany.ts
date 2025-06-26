import { useState, useCallback } from 'react';
import { companyService } from '../services/companyService';
import { Company } from '../types';

export const useCompany = (companyId?: string) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompany = useCallback(async () => {
    if (!companyId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await companyService.getMyCompany();
      setCompany(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '회사 정보를 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  const updateCompany = useCallback(async (companyData: Partial<Company>) => {
    if (!companyId) throw new Error('회사 ID가 필요합니다');
    
    setLoading(true);
    setError(null);
    
    try {
      const updatedCompany = await companyService.updateCompany(companyId, companyData);
      setCompany(updatedCompany);
      return updatedCompany;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '회사 수정에 실패했습니다';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    company,
    loading,
    error,
    fetchCompany,
    updateCompany,
    clearError,
  };
}; 