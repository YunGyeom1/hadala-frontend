export interface DailySettlement {
  id: string;
  date: string;
  company_id: string;
  center_id: string;
  total_wholesale_in_kg: number;
  total_wholesale_in_price: number;
  total_retail_out_kg: number;
  total_retail_out_price: number;
  discrepancy_in_kg?: number;
  discrepancy_out_kg?: number;
  total_in_kg?: number;
  total_out_kg?: number;
  created_at: string;
  updated_at: string;
}

export interface DailySettlementCreate {
  date: string;
  company_id: string;
  center_id: string;
  total_wholesale_in_kg?: number;
  total_wholesale_in_price?: number;
  total_retail_out_kg?: number;
  total_retail_out_price?: number;
  discrepancy_in_kg?: number;
  discrepancy_out_kg?: number;
  total_in_kg?: number;
  total_out_kg?: number;
}

export interface DailySettlementUpdate {
  total_wholesale_in_kg?: number;
  total_wholesale_in_price?: number;
  total_retail_out_kg?: number;
  total_retail_out_price?: number;
  discrepancy_in_kg?: number;
  discrepancy_out_kg?: number;
  total_in_kg?: number;
  total_out_kg?: number;
}

export interface DailySettlementTotal {
  date: string;
  company_id: string;
  total_wholesale_in_kg: number;
  total_wholesale_in_price: number;
  total_retail_out_kg: number;
  total_retail_out_price: number;
  discrepancy_in_kg?: number;
  discrepancy_out_kg?: number;
  total_in_kg?: number;
  total_out_kg?: number;
}

export interface DailySettlementCenterTotal {
  date: string;
  company_id: string;
  center_id: string;
  total_wholesale_in_kg: number;
  total_wholesale_in_price: number;
  total_retail_out_kg: number;
  total_retail_out_price: number;
  discrepancy_in_kg?: number;
  discrepancy_out_kg?: number;
  total_in_kg?: number;
  total_out_kg?: number;
}

export interface DailyAccounting {
  id: string;
  date: string;
  company_id: string;
  total_prepaid: number;
  total_pre_received: number;
  total_paid: number;
  total_received: number;
  total_pending_payment: number;
  total_pending_receipt: number;
  created_at: string;
  updated_at: string;
}

export interface DailyAccountingCreate {
  date: string;
  company_id: string;
  total_prepaid?: number;
  total_pre_received?: number;
  total_paid?: number;
  total_received?: number;
  total_pending_payment?: number;
  total_pending_receipt?: number;
}

export interface DailyAccountingUpdate {
  total_prepaid?: number;
  total_pre_received?: number;
  total_paid?: number;
  total_received?: number;
  total_pending_payment?: number;
  total_pending_receipt?: number;
}