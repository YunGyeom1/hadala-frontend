import React from 'react';
import { ContractStatus } from '@/transactions/common/types';

interface ContractBasicInfoProps {
  title: string;
  contract_datetime: string;
  delivery_datetime: string;
  payment_due_date: string;
  contract_status?: string;
  payment_status?: string;
  onTitleChange: (value: string) => void;
  onContractDateChange: (value: string) => void;
  onDeliveryDateChange: (value: string) => void;
  onPaymentDueDateChange: (value: string) => void;
  onContractStatusChange?: (value: string) => void;
  onPaymentStatusChange?: (value: string) => void;
}

const ContractBasicInfo: React.FC<ContractBasicInfoProps> = ({
  title,
  contract_datetime,
  delivery_datetime,
  payment_due_date,
  contract_status = 'draft',
  payment_status = 'unpaid',
  onTitleChange,
  onContractDateChange,
  onDeliveryDateChange,
  onPaymentDueDateChange,
  onContractStatusChange,
  onPaymentStatusChange,
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4 border-b pb-2">Contract Basic Information</h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Contract Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Contract Date</label>
          <input
            type="date"
            value={contract_datetime}
            onChange={(e) => onContractDateChange(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Delivery Date</label>
          <input
            type="date"
            value={delivery_datetime}
            onChange={(e) => onDeliveryDateChange(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Payment Due Date</label>
          <input
            type="date"
            value={payment_due_date}
            onChange={(e) => onPaymentDueDateChange(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Contract Status</label>
          <select
            value={contract_status}
            onChange={(e) => onContractStatusChange?.(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Payment Status</label>
          <select
            value={payment_status}
            onChange={(e) => onPaymentStatusChange?.(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ContractBasicInfo; 