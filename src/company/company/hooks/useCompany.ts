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
      setError(err instanceof Error ? err.message : 'Failed to load company information');
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  const updateCompany = useCallback(async (companyData: Partial<Company>) => {
    if (!companyId) throw new Error('Company ID is required');
    
    setLoading(true);
    setError(null);
    
    try {
      const updatedCompany = await companyService.updateCompany(companyId, companyData);
      setCompany(updatedCompany);
      return updatedCompany;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update company';
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