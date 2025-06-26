import React, { useState, useEffect } from 'react';
import { shipmentSummaryService, ShipmentSummaryRequest } from './services/shipmentSummaryService';
import { SummaryResponse, Direction } from './types';
import DailyShipmentSummary from './DailyShipmentSummary';

const ShipmentSummaryPage: React.FC = () => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [summaryData, setSummaryData] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [direction, setDirection] = useState<Direction>(Direction.OUTBOUND);

  // 오늘 날짜를 기본값으로 설정
  useEffect(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    setStartDate(todayStr);
    setEndDate(todayStr);
  }, []);

  const handleSearch = async () => {
    if (!startDate || !endDate) {
      setError('시작일과 종료일을 선택해주세요.');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('시작일은 종료일보다 이전이어야 합니다.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const request: ShipmentSummaryRequest = {
        start_date: startDate,
        end_date: endDate,
      };

      // 새로운 통합 API 사용
      const response = await shipmentSummaryService.getSummary(
        'shipment',
        direction === Direction.OUTBOUND ? 'outbound' : 'inbound',
        request
      );

      setSummaryData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="p-6 space-y-6">
      {/* 페이지 제목 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {direction === Direction.OUTBOUND ? '출하' : '입하'} 현황
        </h1>
      </div>

      {/* 검색 조건 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* 방향 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              거래 방향
            </label>
            <select
              value={direction}
              onChange={(e) => setDirection(e.target.value as Direction)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={Direction.OUTBOUND}>출하</option>
              <option value={Direction.INBOUND}>입하</option>
            </select>
          </div>

          {/* 시작일 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              시작일
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 종료일 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              종료일
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 검색 버튼 */}
          <div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '검색 중...' : '검색'}
            </button>
          </div>
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* 결과 표시 */}
      {summaryData && summaryData.daily_summaries.length > 0 && (
        <div className="space-y-6">
          {summaryData.daily_summaries.map((daily) => (
            <div key={daily.date} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <DailyShipmentSummary
                date={daily.date}
                data={summaryData}
              />
            </div>
          ))}
        </div>
      )}

      {/* 데이터가 없는 경우 */}
      {summaryData && summaryData.daily_summaries.length === 0 && (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-gray-500 text-lg">
            선택한 기간에 {direction === Direction.OUTBOUND ? '출하' : '입하'} 데이터가 없습니다.
          </p>
        </div>
      )}
    </div>
  );
};

export default ShipmentSummaryPage; 