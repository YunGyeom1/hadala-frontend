import { ProductQuality } from '../common/types';

export interface InventorySnapshotItem {
  product_name: string;
  quality: ProductQuality;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface CenterInventorySnapshot {
  center_id: string;
  center_name: string;
  total_quantity: number;
  total_price: number;
  items: InventorySnapshotItem[];
}

export interface DailyInventorySnapshot {
  snapshot_date: string;
  centers: CenterInventorySnapshot[];
}

export interface InventorySnapshotResponse {
  rows: DailyInventorySnapshot[];
}

// 수정 요청 타입
export interface UpdateInventorySnapshotItemRequest {
  product_name: string;
  quality: ProductQuality;
  quantity: number;
  unit_price: number;
}

export interface UpdateCenterInventorySnapshotRequest {
  center_id: string;
  items: UpdateInventorySnapshotItemRequest[];
}

export interface UpdateDailyInventorySnapshotRequest {
  snapshot_date: string;
  centers: UpdateCenterInventorySnapshotRequest[];
} 