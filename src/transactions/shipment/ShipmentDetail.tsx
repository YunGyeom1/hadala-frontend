
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
// import { ProductQuality, ShipmentStatus, qualityToString } from '../common/types';
import { ShipmentStatus, qualityToString } from '../common/types';
import { ShipmentResponse } from './types';
import { ContractResponse } from '../contract/types';
import { shipmentService } from './services/shipmentService';
import { useQuery } from '@tanstack/react-query';

interface ShipmentDetailProps {
  shipment?: ShipmentResponse;
}

const getStatusLabel = (status: ShipmentStatus | string) => {
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
      return 'Unknown';
  }
};

const ShipmentDetail: React.FC<ShipmentDetailProps> = ({ shipment: propShipment }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Use prop shipment if available, otherwise call API
  const { data: apiShipment, isLoading, error } = useQuery({
    queryKey: ['shipment', id],
    queryFn: () => shipmentService.getShipment(id!),
    enabled: !!id && !propShipment,
  });

  const [shipment, setShipment] = useState<ShipmentResponse | null>(propShipment || apiShipment || null);
  const [status, setStatus] = useState<ShipmentStatus | string>(shipment?.shipment_status || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (shipment) {
      setStatus(shipment.shipment_status);
    }
  }, [shipment]);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!shipment) return;
    
    const newStatus = e.target.value as ShipmentStatus;
    setStatus(newStatus);
    setSaving(true);
    try {
      await shipmentService.updateShipment(shipment.id, { ...shipment, shipment_status: newStatus });
      alert('Shipment status has been updated.');
    } catch (error: any) {
      alert(error.message || 'Failed to update status.');
      setStatus(shipment.shipment_status); // Restore on failure
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !shipment) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">Failed to load shipment information.</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate total price of items
  const totalPrice = shipment.items.reduce((sum, item) => sum + (item.total_price || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Shipment Basic Information */}
              <div>
                <h2 className="text-lg font-medium mb-4">Basic Information</h2>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Title</dt>
                    <dd className="mt-1 text-sm text-gray-900">{shipment.title}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1">
                      <select
                        value={status}
                        onChange={handleStatusChange}
                        className="select select-bordered"
                        disabled={saving}
                      >
                        {Object.values(ShipmentStatus).map((s) => (
                          <option key={s} value={s}>{getStatusLabel(s)}</option>
                        ))}
                      </select>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Shipment Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {shipment.shipment_datetime ? format(new Date(shipment.shipment_datetime), 'yyyy-MM-dd HH:mm') : '-'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Shipment ID</dt>
                    <dd className="mt-1 text-sm text-gray-900">{shipment.id}</dd>
                  </div>
                </dl>
              </div>
              {/* Company Information */}
              <div>
                <h2 className="text-lg font-medium mb-4">Company Information</h2>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Supplier</dt>
                    <dd className="mt-1 text-sm text-gray-900">{shipment.supplier_company?.name || '-'}</dd>
                    {shipment.supplier_person?.username && (
                      <dd className="text-sm text-gray-500">{shipment.supplier_person.username}</dd>
                    )}
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Receiver</dt>
                    <dd className="mt-1 text-sm text-gray-900">{shipment.receiver_company?.name || '-'}</dd>
                    {shipment.receiver_person?.username && (
                      <dd className="text-sm text-gray-500">{shipment.receiver_person.username}</dd>
                    )}
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Departure Center</dt>
                    <dd className="mt-1 text-sm text-gray-900">{shipment.departure_center?.name || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Arrival Center</dt>
                    <dd className="mt-1 text-sm text-gray-900">{shipment.arrival_center?.name || '-'}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-medium mb-4">Shipment Items</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quality</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {shipment.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.product_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{qualityToString(item.quality)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.unit_price.toLocaleString()} KRW</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.total_price.toLocaleString()} KRW</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                        Total
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {totalPrice.toLocaleString()} KRW
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {shipment.notes && (
              <div className="mt-8">
                <h2 className="text-lg font-medium mb-4">Notes</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{shipment.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetail;