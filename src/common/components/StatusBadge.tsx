import { ContractStatus, PaymentStatus } from '../types/common';

interface StatusBadgeProps {
  status: ContractStatus | PaymentStatus;
  type: 'contract' | 'payment';
}

const StatusBadge = ({ status, type }: StatusBadgeProps) => {
  const getStatusColor = (status: ContractStatus | PaymentStatus, type: 'contract' | 'payment') => {
    if (type === 'contract') {
      switch (status) {
        case ContractStatus.PENDING:
          return 'bg-yellow-100 text-yellow-800';
        case ContractStatus.APPROVED:
          return 'bg-green-100 text-green-800';
        case ContractStatus.REJECTED:
          return 'bg-red-100 text-red-800';
        case ContractStatus.COMPLETED:
          return 'bg-blue-100 text-blue-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    } else {
      switch (status) {
        case PaymentStatus.PENDING:
          return 'bg-yellow-100 text-yellow-800';
        case PaymentStatus.PAID:
          return 'bg-green-100 text-green-800';
        case PaymentStatus.OVERDUE:
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
        status,
        type
      )}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge; 