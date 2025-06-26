import { useState, useEffect } from 'react';
import DailyInventorySummary from '@/transactions/inventory/DailyInventorySummary';
import { useCompanyInventorySnapshot } from '@/transactions/inventory/hooks/useInventorySnapshot';
import { formatDate } from '@/transactions/inventory/services/inventorySnapshotService';
import { useProfile } from '@/profile/ProfileContext';

const InventorySummaryPage = () => {
  // 오늘 날짜를 기본값으로 설정
  const today = formatDate(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(today);
  
  const { currentProfile } = useProfile();
  const companyId = currentProfile?.company_id;
  
  const {
    snapshots,
    loading,
    error,
    fetchSnapshot,
    clearError
  } = useCompanyInventorySnapshot(companyId || '');

  useEffect(() => {
    // companyId가 유효한 값일 때만 스냅샷 조회
    if (companyId && companyId.trim() !== '') {
      fetchSnapshot(selectedDate);
    }
  }, [companyId, selectedDate, fetchSnapshot]);

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    clearError();
  };

  // 선택된 날짜의 스냅샷 찾기
  const selectedSnapshot = snapshots.find(
    snapshot => snapshot.snapshot_date === selectedDate
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">재고 요약</h1>
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">날짜 선택:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {loading && (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <span className="text-sm text-gray-500">로딩 중...</span>
            </div>
          )}
        </div>
      </div>

      {/* companyId가 없을 때 메시지 */}
      {(!companyId || companyId.trim() === '') && !loading && (
        <div className="text-center py-8 text-gray-500">
          <p className="mb-2">회사 정보를 불러올 수 없습니다.</p>
          <p className="text-sm">프로필 설정에서 회사를 선택해주세요.</p>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>오류:</strong> {error}
          <button 
            onClick={clearError}
            className="ml-2 text-red-500 hover:text-red-700 underline"
          >
            닫기
          </button>
        </div>
      )}

      {/* 재고 데이터 표시 */}
      {selectedSnapshot ? (
        <DailyInventorySummary
          date={selectedSnapshot.snapshot_date}
          data={selectedSnapshot}
        />
      ) : !loading && companyId && companyId.trim() !== '' ? (
        <div className="text-center py-8 text-gray-500">
          {error ? '데이터를 불러올 수 없습니다.' : '해당 날짜의 재고 데이터가 없습니다.'}
        </div>
      ) : null}

      {/* 로딩 중일 때 스켈레톤 */}
      {loading && !selectedSnapshot && (
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventorySummaryPage; 