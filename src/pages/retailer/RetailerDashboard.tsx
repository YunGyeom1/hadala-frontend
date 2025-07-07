import { useState, useEffect } from 'react';

const RetailerDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Retailer Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Sales Status</h2>
          <p>Today's sales: 0</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Inventory Status</h2>
          <p>Current inventory: 0</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Revenue Status</h2>
          <p>This month's revenue: 0원</p>
        </div>
      </div>
    </div>
  );
};

export default RetailerDashboard; 