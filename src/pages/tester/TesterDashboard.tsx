import React from 'react';

const TesterDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">테스터 대시보드</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">테스트 현황</h2>
          <p>진행 중인 테스트: 0건</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">완료된 테스트</h2>
          <p>이번 달 완료: 0건</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">보고서 현황</h2>
          <p>작성된 보고서: 0건</p>
        </div>
      </div>
    </div>
  );
};

export default TesterDashboard; 