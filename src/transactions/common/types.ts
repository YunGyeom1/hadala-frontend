export enum ProductQuality {
  A = 'A',
  B = 'B',
  C = 'C'
}

export const qualityToString = (quality: ProductQuality): string => {
  switch (quality) {
    case ProductQuality.A:
      return 'Grade A';
    case ProductQuality.B:
      return 'Grade B';
    case ProductQuality.C:
      return 'Grade C';
    default:
      return 'Unknown';
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