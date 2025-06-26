import { useState, useCallback } from 'react';
import { centerService } from '../services/centerService';
import { Center, CenterCreateRequest, CenterUpdateRequest } from '../types';

export const useCenters = (companyId?: string) => {
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCenters = useCallback(async () => {
    if (!companyId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await centerService.getCenters(companyId);
      setCenters(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '센터 목록을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  const createCenter = useCallback(async (centerData: CenterCreateRequest) => {
    if (!companyId) throw new Error('회사 ID가 필요합니다');
    
    setLoading(true);
    setError(null);
    
    try {
      const newCenter = await centerService.createCenter(centerData);
      setCenters(prev => [...prev, newCenter]);
      return newCenter;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '센터 생성에 실패했습니다';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  const updateCenter = useCallback(async (centerId: string, centerData: CenterUpdateRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedCenter = await centerService.updateCenter(centerId, centerData);
      setCenters(prev => prev.map(center => 
        center.id === centerId ? updatedCenter : center
      ));
      return updatedCenter;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '센터 수정에 실패했습니다';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCenter = useCallback(async (centerId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await centerService.deleteCenter(centerId);
      setCenters(prev => prev.filter(center => center.id !== centerId));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '센터 삭제에 실패했습니다';
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
    centers,
    loading,
    error,
    fetchCenters,
    createCenter,
    updateCenter,
    deleteCenter,
    clearError,
  };
}; 