import { useState, useCallback } from 'react';
import { companyService } from '../services/companyService';
import { Company, CompanyCreateRequest, CompanyUpdateRequest } from '../types';

export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await companyService.getCompanies();
      setCompanies(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load company list');
    } finally {
      setLoading(false);
    }
  }, []);

  const createCompany = useCallback(async (companyData: CompanyCreateRequest) => {
    setLoading(true);
    setError(null);
    try {
      const newCompany = await companyService.createCompany({
        ...companyData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      setCompanies(prev => [...prev, newCompany]);
      return newCompany;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create company';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCompany = useCallback(async (companyId: string, companyData: CompanyUpdateRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedCompany = await companyService.updateCompany(companyId, companyData);
      setCompanies(prev => prev.map(company => 
        company.id === companyId ? updatedCompany : company
      ));
      return updatedCompany;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update company';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCompany = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      throw new Error('Company deletion is not supported');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete company';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    companies,
    loading,
    error,
    fetchCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
    clearError,
  };
}; 