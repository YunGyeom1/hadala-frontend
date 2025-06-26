export enum ProductQuality {
  A = 'A',
  B = 'B',
  C = 'C'
}

export const qualityToString = (quality: ProductQuality): string => {
  switch (quality) {
    case ProductQuality.A:
      return 'A등급';
    case ProductQuality.B:
      return 'B등급';
    case ProductQuality.C:
      return 'C등급';
    default:
      return '알 수 없음';
  }
};

export enum ShipmentStatus {
  PENDING = 'pending',
  READY = 'ready',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export enum ContractStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

export enum PaymentStatus {
  UNPAID = 'unpaid',
  PARTIAL = 'partial',
  PREPARED = 'prepared',
  OVERDUE = 'overdue',
  PAID = 'paid',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
} 