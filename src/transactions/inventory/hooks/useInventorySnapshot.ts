import { useState, useCallback } from 'react';
import { 
  inventorySnapshotService,
  formatDate,
  generateDateRange,
  convertToInventorySnapshotResponse,
  aggregateItemsByCenter
} from '../services/inventorySnapshotService';
import { 
  DailyInventorySnapshot, 
  CenterInventorySnapshot, 
  UpdateDailyInventorySnapshotRequest,
  InventorySnapshotResponse 
} from '../types';

export const useInventorySnapshot = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCompanyInventorySnapshot = useCallback(async (
    companyId: string, 
    targetDate: Date | string
  ): Promise<DailyInventorySnapshot | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const dateStr = formatDate(targetDate);
      const result = await inventorySnapshotService.getCompanyInventorySnapshot(companyId, dateStr);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCompanyInventorySnapshotsByDateRange = useCallback(async (
    companyId: string, 
    startDate: Date | string, 
    endDate: Date | string
  ): Promise<DailyInventorySnapshot[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const startStr = formatDate(startDate);
      const endStr = formatDate(endDate);
      const result = await inventorySnapshotService.getCompanyInventorySnapshotsByDateRange(
        companyId, 
        startStr, 
        endStr
      );
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getCenterInventorySnapshot = useCallback(async (
    centerId: string, 
    targetDate: Date | string, 
    companyId: string
  ): Promise<CenterInventorySnapshot | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const dateStr = formatDate(targetDate);
      const result = await inventorySnapshotService.getCenterInventorySnapshot(
        centerId, 
        dateStr, 
        companyId
      );
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createCenterInventorySnapshot = useCallback(async (
    centerId: string, 
    targetDate: Date | string, 
    companyId: string
  ): Promise<CenterInventorySnapshot | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const dateStr = formatDate(targetDate);
      const result = await inventorySnapshotService.createCenterInventorySnapshot(
        centerId, 
        dateStr, 
        companyId
      );
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const finalizeCenterInventorySnapshot = useCallback(async (
    centerId: string, 
    targetDate: Date | string, 
    companyId: string
  ): Promise<CenterInventorySnapshot | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const dateStr = formatDate(targetDate);
      const result = await inventorySnapshotService.finalizeCenterInventorySnapshot(
        centerId, 
        dateStr, 
        companyId
      );
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCompanyInventorySnapshot = useCallback(async (
    companyId: string, 
    targetDate: Date | string, 
    updateRequest: UpdateDailyInventorySnapshotRequest,
    contractId?: string
  ): Promise<DailyInventorySnapshot | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const dateStr = formatDate(targetDate);
      const result = await inventorySnapshotService.updateCompanyInventorySnapshot(
        companyId, 
        dateStr, 
        updateRequest,
        contractId
      );
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    getCompanyInventorySnapshot,
    getCompanyInventorySnapshotsByDateRange,
    getCenterInventorySnapshot,
    createCenterInventorySnapshot,
    finalizeCenterInventorySnapshot,
    updateCompanyInventorySnapshot,
    clearError
  };
};

// 특정 센터의 인벤토리 스냅샷을 위한 hook
export const useCenterInventorySnapshot = (
  centerId: string,
  companyId: string
) => {
  const [snapshot, setSnapshot] = useState<CenterInventorySnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSnapshot = useCallback(async (targetDate: Date | string) => {
    setLoading(true);
    setError(null);
    
    try {
      const dateStr = formatDate(targetDate);
      const result = await inventorySnapshotService.getCenterInventorySnapshot(
        centerId, 
        dateStr, 
        companyId
      );
      setSnapshot(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [centerId, companyId]);

  const createSnapshot = useCallback(async (targetDate: Date | string) => {
    setLoading(true);
    setError(null);
    
    try {
      const dateStr = formatDate(targetDate);
      const result = await inventorySnapshotService.createCenterInventorySnapshot(
        centerId, 
        dateStr, 
        companyId
      );
      setSnapshot(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [centerId, companyId]);

  const finalizeSnapshot = useCallback(async (targetDate: Date | string) => {
    setLoading(true);
    setError(null);
    
    try {
      const dateStr = formatDate(targetDate);
      const result = await inventorySnapshotService.finalizeCenterInventorySnapshot(
        centerId, 
        dateStr, 
        companyId
      );
      setSnapshot(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [centerId, companyId]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    snapshot,
    loading,
    error,
    fetchSnapshot,
    createSnapshot,
    finalizeSnapshot,
    clearError
  };
};

// 회사 전체 인벤토리 스냅샷을 위한 hook
export const useCompanyInventorySnapshot = (companyId: string) => {
  const [snapshots, setSnapshots] = useState<DailyInventorySnapshot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSnapshotsByDateRange = useCallback(async (
    startDate: Date | string, 
    endDate: Date | string
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const startStr = formatDate(startDate);
      const endStr = formatDate(endDate);
      const result = await inventorySnapshotService.getCompanyInventorySnapshotsByDateRange(
        companyId, 
        startStr, 
        endStr
      );
      setSnapshots(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  const fetchSnapshot = useCallback(async (targetDate: Date | string) => {
    setLoading(true);
    setError(null);
    
    try {
      const dateStr = formatDate(targetDate);
      const result = await inventorySnapshotService.getCompanyInventorySnapshot(companyId, dateStr);
      setSnapshots([result]);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  const updateSnapshot = useCallback(async (
    targetDate: Date | string, 
    updateRequest: UpdateDailyInventorySnapshotRequest,
    contractId?: string
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const dateStr = formatDate(targetDate);
      const result = await inventorySnapshotService.updateCompanyInventorySnapshot(
        companyId, 
        dateStr, 
        updateRequest,
        contractId
      );
      // 업데이트된 스냅샷으로 상태 갱신
      setSnapshots(prev => prev.map(s => 
        s.snapshot_date === dateStr ? result : s
      ));
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 유틸리티 함수들
  const getInventorySnapshotResponse = useCallback((): InventorySnapshotResponse => {
    return convertToInventorySnapshotResponse(snapshots);
  }, [snapshots]);

  const getAggregatedCenters = useCallback(() => {
    return aggregateItemsByCenter(snapshots);
  }, [snapshots]);

  return {
    snapshots,
    loading,
    error,
    fetchSnapshotsByDateRange,
    fetchSnapshot,
    updateSnapshot,
    clearError,
    getInventorySnapshotResponse,
    getAggregatedCenters
  };
}; 