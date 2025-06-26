import { ProductQuality } from "../common/types";

export interface ShipmentSummaryRow {
    shipment_date: string;
    center_name: string;
    product_name: string;
    shipment_type: string;
    quality: ProductQuality;
    quantity: number;
    destination: string;
}

export interface ShipmentSummary {
    rows: ShipmentSummaryRow[];
}

// 백엔드 Summary API 응답 타입
export enum TransactionType {
    CONTRACT = "contract",
    SHIPMENT = "shipment"
}

export enum Direction {
    OUTBOUND = "outbound",
    INBOUND = "inbound"
}

export interface CenterItem {
    product_name: string;
    quality: ProductQuality;
    quantity: number;
}

export interface CenterSummary {
    center_name: string;
    items: CenterItem[];
}

export interface DailySummary {
    date: string;
    center_summaries: CenterSummary[];
}

export interface SummaryResponse {
    start_date: string;
    end_date: string;
    direction: Direction;
    transaction_type: TransactionType;
    daily_summaries: DailySummary[];
}