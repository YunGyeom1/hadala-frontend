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
      <h2 className="text-lg font-semibold mb-4 border-b pb-2">계약 기본 정보</h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">계약 제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">계약일</label>
          <input
            type="date"
            value={contract_datetime}
            onChange={(e) => onContractDateChange(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">납기일</label>
          <input
            type="date"
            value={delivery_datetime}
            onChange={(e) => onDeliveryDateChange(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">결제 기한</label>
          <input
            type="date"
            value={payment_due_date}
            onChange={(e) => onPaymentDueDateChange(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">계약 상태</label>
          <select
            value={contract_status}
            onChange={(e) => onContractStatusChange?.(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="draft">초안</option>
            <option value="pending">검토중</option>
            <option value="approved">승인됨</option>
            <option value="rejected">거절됨</option>
            <option value="cancelled">취소됨</option>
            <option value="completed">완료됨</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">결제 상태</label>
          <select
            value={payment_status}
            onChange={(e) => onPaymentStatusChange?.(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="unpaid">미결제</option>
            <option value="paid">결제완료</option>
            <option value="overdue">연체</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ContractBasicInfo; 