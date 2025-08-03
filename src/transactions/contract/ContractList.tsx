import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { contractService } from './services/contractService';
// import { ContractResponse } from './types';
import { ContractStatus, PaymentStatus } from '@/transactions/common/types';
import { format } from 'date-fns';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import ContractDetail from './ContractDetail';

const ContractList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [expandedContractId, setExpandedContractId] = useState<string | null>(null);

  // Get contract list
  const { data: contracts = [], isLoading, error, refetch } = useQuery({
    queryKey: ['contracts'],
    queryFn: () => contractService.getContracts(),
  });

  const getStatusColor = (status: ContractStatus) => {
    switch (status) {
      case ContractStatus.DRAFT:
        return 'bg-gray-100 text-gray-800';
      case ContractStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case ContractStatus.APPROVED:
        return 'bg-green-100 text-green-800';
      case ContractStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      case ContractStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800';
      case ContractStatus.COMPLETED:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: ContractStatus) => {
    switch (status) {
      case ContractStatus.DRAFT:
        return 'Draft';
      case ContractStatus.PENDING:
        return 'Pending';
      case ContractStatus.APPROVED:
        return 'Approved';
      case ContractStatus.REJECTED:
        return 'Rejected';
      case ContractStatus.CANCELLED:
        return 'Cancelled';
      case ContractStatus.COMPLETED:
        return 'Completed';
      default:
        return status;
    }
  };

  const getPaymentStatusLabel = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.UNPAID:
        return 'Unpaid';
      case PaymentStatus.PAID:
        return 'Paid';
      case PaymentStatus.PARTIAL:
        return 'Partial';
      case PaymentStatus.OVERDUE:
        return 'Overdue';
      case PaymentStatus.PREPARED:
        return 'Prepared';
      case PaymentStatus.REFUNDED:
        return 'Refunded';
      case PaymentStatus.CANCELLED:
        return 'Payment Cancelled';
      default:
        return status;
    }
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.UNPAID:
        return 'bg-red-100 text-red-800';
      case PaymentStatus.PAID:
        return 'bg-green-100 text-green-800';
      case PaymentStatus.PARTIAL:
        return 'bg-yellow-100 text-yellow-800';
      case PaymentStatus.OVERDUE:
        return 'bg-red-100 text-red-800';
      case PaymentStatus.PREPARED:
        return 'bg-blue-100 text-blue-800';
      case PaymentStatus.REFUNDED:
        return 'bg-gray-100 text-gray-800';
      case PaymentStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleContract = (contractId: string) => {
    setExpandedContractId(expandedContractId === contractId ? null : contractId);
  };

  const handleStatusChange = async (contractId: string, newStatus: ContractStatus) => {
    try {
      await contractService.updateContractStatus(contractId, newStatus);
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    } catch (error: any) {
      console.error('Status change failed:', error);
      alert(`Status change failed: ${error.message}`);
    }
  };

  const handlePaymentStatusChange = async (contractId: string, newStatus: PaymentStatus) => {
    try {
      await contractService.updatePaymentStatus(contractId, newStatus);
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    } catch (error: any) {
      console.error('Payment status change failed:', error);
      alert(`Payment status change failed: ${error.message}`);
    }
  };

  interface StatusDropdownProps {
    contractId: string;
    currentStatus: ContractStatus | PaymentStatus;
    statusType: 'contract' | 'payment';
    onStatusChange: (contractId: string, newStatus: any) => void;
  }

  const StatusDropdown: React.FC<StatusDropdownProps> = ({ contractId, currentStatus, statusType, onStatusChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const statusOptions = statusType === 'contract'
      ? Object.values(ContractStatus)
      : Object.values(PaymentStatus);

    const getLabelForStatus = (status: ContractStatus | PaymentStatus): string => {
      if (!status) return 'N/A';
      return statusType === 'contract' ? getStatusLabel(status as ContractStatus) : getPaymentStatusLabel(status as PaymentStatus);
    }

    const getColorForStatus = (status: ContractStatus | PaymentStatus): string => {
      if (!status) return 'bg-gray-100 text-gray-800';
      return statusType === 'contract' ? getStatusColor(status as ContractStatus) : getPaymentStatusColor(status as PaymentStatus);
    }

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    return (
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer hover:opacity-80 ${getColorForStatus(currentStatus)}`}
        >
          {getLabelForStatus(currentStatus)}
          <FiChevronDown className="ml-1 -mr-1 h-4 w-4" />
        </button>

        {isOpen && (
          <div className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
            <div className="py-1">
              {statusOptions.map((status) => (
                <a
                  key={status}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onStatusChange(contractId, status);
                    setIsOpen(false);
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {getLabelForStatus(status)}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Failed to load contract list.</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contract Management</h1>
        <button
          onClick={() => navigate('/wholesaler/transactions/contracts/new')}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Create Contract
        </button>
      </div>

      {contracts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No contracts registered.</p>
          <p className="text-sm mt-1">Click the Create Contract button to register a new contract.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-8 px-6 py-3"></th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supplier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Receiver
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contract Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contract Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contracts.map((contract) => (
                  <React.Fragment key={contract.id}>
                    <tr
                      onClick={() => toggleContract(contract.id)}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {expandedContractId === contract.id ? (
                          <FiChevronDown className="h-5 w-5 text-gray-400" />
                        ) : (
                          <FiChevronRight className="h-5 w-5 text-gray-400" />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{contract.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {contract.supplier_company?.name || '-'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {contract.supplier_contractor?.username || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {contract.receiver_company?.name || '-'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {contract.receiver_contractor?.username || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {contract.contract_datetime
                            ? format(new Date(contract.contract_datetime), 'yyyy-MM-dd')
                            : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusDropdown
                          contractId={contract.id}
                          currentStatus={contract.contract_status}
                          statusType="contract"
                          onStatusChange={handleStatusChange}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {contract.payment_status && (
                          <StatusDropdown
                            contractId={contract.id}
                            currentStatus={contract.payment_status}
                            statusType="payment"
                            onStatusChange={handlePaymentStatusChange}
                          />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/wholesaler/transactions/contracts/${contract.id}/edit`);
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-2"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                    {expandedContractId === contract.id && (
                      <tr>
                        <td colSpan={9} className="px-6 py-4 bg-gray-50">
                          <ContractDetail contract={contract} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractList; 