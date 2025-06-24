import { useState, useCallback } from 'react';
import { centerService } from '../services/centerService';
import { Center, CenterUpdateRequest } from '../types';

export const useCenter = (centerId?: string) => {
  const [center, setCenter] = useState<Center | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCenter = useCallback(async () => {
    if (!centerId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await centerService.getCenter(centerId);
      setCenter(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '센터 정보를 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  }, [centerId]);

  const updateCenter = useCallback(async (centerData: CenterUpdateRequest) => {
    if (!centerId) throw new Error('센터 ID가 필요합니다');
    
    setLoading(true);
    setError(null);
    
    try {
      const updatedCenter = await centerService.updateCenter(centerId, centerData);
      setCenter(updatedCenter);
      return updatedCenter;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '센터 수정에 실패했습니다';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [centerId]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    center,
    loading,
    error,
    fetchCenter,
    updateCenter,
    clearError,
  };
}; 