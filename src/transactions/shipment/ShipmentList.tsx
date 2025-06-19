import React, { useState } from 'react';
import { ShipmentResponse } from './types';
import { mockShipments } from './mock';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ShipmentStatus } from '../common/types';
import ShipmentDetail from './ShipmentDetail';
import { useNavigate } from 'react-router-dom';

interface ShipmentListProps {
  shipments?: ShipmentResponse[];
}

const getStatusLabel = (status: ShipmentStatus) => {
  switch (status) {
    case ShipmentStatus.DELIVERED:
      return '배송완료';
    case ShipmentStatus.IN_TRANSIT:
      return '배송중';
    default:
      return '알 수 없음';
  }
};

const ShipmentList: React.FC<ShipmentListProps> = ({ shipments = mockShipments }) => {
  const [expandedShipmentId, setExpandedShipmentId] = useState<string | null>(null);
  const navigate = useNavigate();

  const toggleShipment = (shipmentId: string) => {
    setExpandedShipmentId(expandedShipmentId === shipmentId ? null : shipmentId);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">출하 관리</h1>
        <button
          onClick={() => navigate('/wholesaler/transactions/shipments/new')}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          출하 생성
        </button>
      </div>

      <div className="space-y-4">
        {shipments.map((shipment) => (
          <div key={shipment.id} className="bg-white rounded-lg shadow">
            {/* 간단 정보 */}
            <div 
              className="p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleShipment(shipment.id)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{shipment.title}</h3>
                  <p className="text-sm text-gray-600">
                    {shipment.supplier_company_name} → {shipment.receiver_company_name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {shipment.shipment_datetime && format(shipment.shipment_datetime, 'yyyy-MM-dd HH:mm', { locale: ko })}
                  </p>
                  <p className="text-sm font-medium">
                    {getStatusLabel(shipment.shipment_status)}
                  </p>
                </div>
              </div>
            </div>

            {/* 상세 정보 (토글) */}
            {expandedShipmentId === shipment.id && (
              <div className="border-t border-gray-200">
                <ShipmentDetail shipment={shipment} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShipmentList; 