import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { shipmentService } from './services/shipmentService';
import { ShipmentResponse } from './types';
import { ShipmentStatus } from '../common/types';
import { format } from 'date-fns';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import ShipmentDetail from './ShipmentDetail';

const ShipmentList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [expandedShipmentId, setExpandedShipmentId] = useState<string | null>(null);

  // Load shipment list
  const { data: shipments = [], isLoading, error, refetch } = useQuery({
    queryKey: ['shipments'],
    queryFn: () => shipmentService.getShipments(),
  });

  const getStatusColor = (status: ShipmentStatus) => {
    switch (status) {
      case ShipmentStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case ShipmentStatus.READY:
        return 'bg-blue-100 text-blue-800';
      case ShipmentStatus.DELIVERED:
        return 'bg-green-100 text-green-800';
      case ShipmentStatus.FAILED:
        return 'bg-red-100 text-red-800';
      case ShipmentStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: ShipmentStatus) => {
    switch (status) {
      case ShipmentStatus.PENDING:
        return 'Pending Shipment';
      case ShipmentStatus.READY:
        return 'Ready for Transport';
      case ShipmentStatus.DELIVERED:
        return 'Delivered';
      case ShipmentStatus.FAILED:
        return 'Delivery Failed';
      case ShipmentStatus.CANCELLED:
        return 'Cancelled';
      default:
        return status;
    }
  };

  const toggleShipment = (shipmentId: string) => {
    setExpandedShipmentId(expandedShipmentId === shipmentId ? null : shipmentId);
  };

  const handleStatusChange = async (shipmentId: string, newStatus: ShipmentStatus) => {
    try {
      await shipmentService.updateShipmentStatus(shipmentId, newStatus);
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
    } catch (error: any) {
      console.error('Status change failed:', error);
      alert(`Status change failed: ${error.message}`);
    }
  };

  interface StatusDropdownProps {
    shipmentId: string;
    currentStatus: ShipmentStatus;
    onStatusChange: (shipmentId: string, newStatus: ShipmentStatus) => void;
  }

  const StatusDropdown: React.FC<StatusDropdownProps> = ({ shipmentId, currentStatus, onStatusChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const statusOptions = [
      ShipmentStatus.PENDING,
      ShipmentStatus.READY,
      ShipmentStatus.DELIVERED,
      ShipmentStatus.FAILED,
      ShipmentStatus.CANCELLED
    ];

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
          onClick={e => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer hover:opacity-80 ${getStatusColor(currentStatus)}`}
        >
          {getStatusLabel(currentStatus)}
          <FiChevronDown className="ml-1 -mr-1 h-4 w-4" />
        </button>
        {isOpen && (
          <div className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
            <div className="py-1">
              {statusOptions.map(status => (
                <a
                  key={status}
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    onStatusChange(shipmentId, status as ShipmentStatus);
                    setIsOpen(false);
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {getStatusLabel(status as ShipmentStatus)}
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
        <p className="text-red-600 mb-4">Failed to load shipment list.</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Shipment Management</h1>
        <button
          onClick={() => navigate('/wholesaler/transactions/shipments/new')}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Create Shipment
        </button>
      </div>
      {shipments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No shipments registered.</p>
          <p className="text-sm mt-1">Click the Create Shipment button to register a new shipment.</p>
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
                    Shipment Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {shipments.map((shipment) => (
                  <React.Fragment key={shipment.id}>
                    <tr
                      onClick={() => toggleShipment(shipment.id)}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {expandedShipmentId === shipment.id ? (
                          <FiChevronDown className="h-5 w-5 text-gray-400" />
                        ) : (
                          <FiChevronRight className="h-5 w-5 text-gray-400" />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{shipment.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {shipment.supplier_company?.name || '-'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {shipment.supplier_person?.username || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {shipment.receiver_company?.name || '-'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {shipment.receiver_person?.username || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {shipment.shipment_datetime
                            ? format(new Date(shipment.shipment_datetime), 'yyyy-MM-dd')
                            : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusDropdown
                          shipmentId={shipment.id}
                          currentStatus={shipment.shipment_status}
                          onStatusChange={handleStatusChange}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/wholesaler/transactions/shipments/${shipment.id}/edit`);
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-2"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                    {expandedShipmentId === shipment.id && (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 bg-gray-50">
                          <ShipmentDetail shipment={shipment} />
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

export default ShipmentList; 