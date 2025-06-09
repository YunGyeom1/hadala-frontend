import React, { useState } from 'react';
import { mockRetailShipments } from '../../transaction/retail_shipment/retail_shipment.mock';
import { RetailShipmentView } from '../../transaction/retail_shipment/RetailShipmentView';
import type { RetailShipment } from '../../transaction/retail_shipment/retail_shipment';

export const RetailShipmentPage: React.FC = () => {
  const [shipments, setShipments] = useState<RetailShipment[]>(mockRetailShipments);

  const handleUpdate = (updatedShipment: RetailShipment) => {
    setShipments(shipments.map(shipment => 
      shipment.id === updatedShipment.id ? updatedShipment : shipment
    ));
  };

  const handleDelete = (id: string) => {
    setShipments(shipments.filter(shipment => shipment.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">소매 출하 관리</h1>
      <div className="space-y-6">
        {shipments.map(shipment => (
          <RetailShipmentView
            key={shipment.id}
            shipment={shipment}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}; 