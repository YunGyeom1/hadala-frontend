import { useState } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import type { RetailShipment } from './retail_shipment';
import React from 'react';

interface RetailShipmentViewProps {
  shipment: RetailShipment;
  onUpdate?: (shipment: RetailShipment) => void;
  onDelete?: (shipmentId: string) => void;
}

const RetailShipmentView = ({ shipment, onUpdate, onDelete }: RetailShipmentViewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedShipment, setEditedShipment] = useState<RetailShipment>(shipment);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editedShipment);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedShipment(shipment);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(shipment.id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Shipment #{shipment.id.slice(0, 8)}
          </h3>
          <div className="flex space-x-2">
            {!isEditing && (
              <>
                <button
                  onClick={handleEdit}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <FiEdit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Shipment Name</p>
            <p className="text-gray-900">{shipment.shipment_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Shipment Date</p>
            <p className="text-gray-900">{formatDate(shipment.shipment_date)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Contract ID</p>
            <p className="text-gray-900">{shipment.contract_id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Retailer ID</p>
            <p className="text-gray-900">{shipment.retailer_id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Center ID</p>
            <p className="text-gray-900">{shipment.center_id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Wholesaler ID</p>
            <p className="text-gray-900">{shipment.wholesaler_id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Company ID</p>
            <p className="text-gray-900">{shipment.company_id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Price</p>
            <p className="text-gray-900">{shipment.total_price ? formatPrice(shipment.total_price) : 'Not set'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Finalized</p>
            <p className="text-gray-900">{shipment.is_finalized ? 'Yes' : 'No'}</p>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Items</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {shipment.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.product_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPrice(item.unit_price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPrice(item.total_price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RetailShipmentView; 