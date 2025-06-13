import React from 'react';
import ShipmentList from '../../transactions/shipment/ShipmentList';

const ShipmentPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">출하 관리</h1>
      <ShipmentList />
    </div>
  );
};

export default ShipmentPage; 