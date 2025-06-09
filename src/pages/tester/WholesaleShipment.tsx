import React, { useState } from 'react';
import { mockWholesaleShipments } from '../../transaction/wholesale_shipment/wholesale_shipment.mock';
import { WholesaleShipmentView } from '../../transaction/wholesale_shipment/WholesaleShipmentView';
import type { WholesaleShipment } from '../../transaction/wholesale_shipment/wholesale_shipment';

export const WholesaleShipment: React.FC = () => {
  const [shipments, setShipments] = useState<WholesaleShipment[]>(mockWholesaleShipments);

  const handleUpdate = (updatedShipment: WholesaleShipment) => {
    setShipments(shipments.map(shipment => 
      shipment.id === updatedShipment.id ? updatedShipment : shipment
    ));
  };

  const handleDelete = (id: string) => {
    setShipments(shipments.filter(shipment => shipment.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">도매출하</h1>
      <div className="space-y-6">
        {shipments.map(shipment => (
          <WholesaleShipmentView
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