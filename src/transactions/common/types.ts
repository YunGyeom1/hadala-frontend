export enum ProductQuality {
  A = 'A',
  B = 'B',
  C = 'C'
}

export enum ShipmentStatus {
  PENDING = 'pending',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered'
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