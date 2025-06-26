import apiClient from '../../../core/auth/auth';
import { 
  DailyInventorySnapshot, 
  CenterInventorySnapshot, 
  UpdateDailyInventorySnapshotRequest,
  InventorySnapshotResponse 
} from '../types';

const BASE_URL = '/inventory-snapshots';

export interface InventorySnapshotService {
  // 회사 전체 인벤토리 스냅샷 조회
  getCompanyInventorySnapshot(companyId: string, targetDate: string): Promise<DailyInventorySnapshot>;
  
  // 기간별 회사 인벤토리 스냅샷 조회
  getCompanyInventorySnapshotsByDateRange(
    companyId: string, 
    startDate: string, 
    endDate: string
  ): Promise<DailyInventorySnapshot[]>;
  
  // 센터 인벤토리 스냅샷 조회
  getCenterInventorySnapshot(
    centerId: string, 
    targetDate: string, 
    companyId: string
  ): Promise<CenterInventorySnapshot>;
  
  // 센터 인벤토리 스냅샷 생성
  createCenterInventorySnapshot(
    centerId: string, 
    targetDate: string, 
    companyId: string
  ): Promise<CenterInventorySnapshot>;
  
  // 센터 인벤토리 스냅샷 확정
  finalizeCenterInventorySnapshot(
    centerId: string, 
    targetDate: string, 
    companyId: string
  ): Promise<CenterInventorySnapshot>;
  
  // 회사 인벤토리 스냅샷 수정
  updateCompanyInventorySnapshot(
    companyId: string, 
    targetDate: string, 
    updateRequest: UpdateDailyInventorySnapshotRequest,
    contractId?: string
  ): Promise<DailyInventorySnapshot>;
}

class InventorySnapshotServiceImpl implements InventorySnapshotService {
  
  async getCompanyInventorySnapshot(companyId: string, targetDate: string): Promise<DailyInventorySnapshot> {
    const response = await apiClient.get<DailyInventorySnapshot>(
      `${BASE_URL}/company/${companyId}/date/${targetDate}`
    );
    return response.data;
  }
  
  async getCompanyInventorySnapshotsByDateRange(
    companyId: string, 
    startDate: string, 
    endDate: string
  ): Promise<DailyInventorySnapshot[]> {
    const response = await apiClient.get<DailyInventorySnapshot[]>(
      `${BASE_URL}/company/${companyId}/date-range`,
      {
        params: {
          start_date: startDate,
          end_date: endDate
        }
      }
    );
    return response.data;
  }
  
  async getCenterInventorySnapshot(
    centerId: string, 
    targetDate: string, 
    companyId: string
  ): Promise<CenterInventorySnapshot> {
    const response = await apiClient.get<CenterInventorySnapshot>(
      `${BASE_URL}/center/${centerId}/date/${targetDate}`,
      {
        params: { company_id: companyId }
      }
    );
    return response.data;
  }
  
  async createCenterInventorySnapshot(
    centerId: string, 
    targetDate: string, 
    companyId: string
  ): Promise<CenterInventorySnapshot> {
    const response = await apiClient.post<CenterInventorySnapshot>(
      `${BASE_URL}/center/${centerId}/date/${targetDate}`,
      {},
      {
        params: { company_id: companyId }
      }
    );
    return response.data;
  }
  
  async finalizeCenterInventorySnapshot(
    centerId: string, 
    targetDate: string, 
    companyId: string
  ): Promise<CenterInventorySnapshot> {
    const response = await apiClient.post<CenterInventorySnapshot>(
      `${BASE_URL}/center/${centerId}/finalize/${targetDate}`,
      {},
      {
        params: { company_id: companyId }
      }
    );
    return response.data;
  }
  
  async updateCompanyInventorySnapshot(
    companyId: string, 
    targetDate: string, 
    updateRequest: UpdateDailyInventorySnapshotRequest,
    contractId?: string
  ): Promise<DailyInventorySnapshot> {
    const params: any = {};
    if (contractId) {
      params.contract_id = contractId;
    }
    
    const response = await apiClient.put<DailyInventorySnapshot>(
      `${BASE_URL}/company/${companyId}/date/${targetDate}`,
      updateRequest,
      { params }
    );
    return response.data;
  }
}

export const inventorySnapshotService: InventorySnapshotService = new InventorySnapshotServiceImpl();

// 유틸리티 함수들
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
};

export const parseDate = (dateString: string): Date => {
  return new Date(dateString);
};

// 날짜 범위 생성
export const generateDateRange = (startDate: string, endDate: string): string[] => {
  const dates: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(formatDate(d));
  }
  
  return dates;
};

// 스냅샷 데이터 변환 (mock 데이터 형식으로)
export const convertToInventorySnapshotResponse = (
  snapshots: DailyInventorySnapshot[]
): InventorySnapshotResponse => {
  return {
    rows: snapshots
  };
};

// 센터별 아이템 집계
export const aggregateItemsByCenter = (snapshots: DailyInventorySnapshot[]) => {
  const centerAggregates: Record<string, any> = {};
  
  snapshots.forEach(snapshot => {
    snapshot.centers.forEach(center => {
      if (!centerAggregates[center.center_id]) {
        centerAggregates[center.center_id] = {
          center_id: center.center_id,
          center_name: center.center_name,
          total_quantity: 0,
          total_price: 0,
          items: {}
        };
      }
      
      center.items.forEach(item => {
        const key = `${item.product_name}_${item.quality}`;
        if (!centerAggregates[center.center_id].items[key]) {
          centerAggregates[center.center_id].items[key] = {
            product_name: item.product_name,
            quality: item.quality,
            quantity: 0,
            unit_price: item.unit_price,
            total_price: 0
          };
        }
        
        centerAggregates[center.center_id].items[key].quantity += item.quantity;
        centerAggregates[center.center_id].items[key].total_price += item.total_price;
      });
      
      centerAggregates[center.center_id].total_quantity += center.total_quantity;
      centerAggregates[center.center_id].total_price += center.total_price;
    });
  });
  
  return Object.values(centerAggregates).map(center => ({
    ...center,
    items: Object.values(center.items)
  }));
}; 