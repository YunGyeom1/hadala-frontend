import { useState, useEffect } from 'react';

const FarmerDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">농부 대시보드</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">작물 현황</h2>
          <p>재배 중인 작물: 0개</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">판매 현황</h2>
          <p>이번 달 판매량: 0kg</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">수익 현황</h2>
          <p>이번 달 수익: 0원</p>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard; 