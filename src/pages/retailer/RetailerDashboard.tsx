import { useState, useEffect } from 'react';

const RetailerDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">소매상 대시보드</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">판매 현황</h2>
          <p>오늘 판매량: 0건</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">재고 현황</h2>
          <p>현재 재고: 0개</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">매출 현황</h2>
          <p>이번 달 매출: 0원</p>
        </div>
      </div>
    </div>
  );
};

export default RetailerDashboard; 