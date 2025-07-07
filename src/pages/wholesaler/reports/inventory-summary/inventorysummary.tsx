import { useState, useEffect } from 'react';
import DailyInventorySummary from '@/transactions/inventory/DailyInventorySummary';
import { useCompanyInventorySnapshot } from '@/transactions/inventory/hooks/useInventorySnapshot';
import { formatDate } from '@/transactions/inventory/services/inventorySnapshotService';
import { useProfile } from '@/profile/ProfileContext';

const InventorySummaryPage = () => {
  // Set today's date as default
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
    // Only fetch snapshot when companyId is valid
    if (companyId && companyId.trim() !== '') {
      fetchSnapshot(selectedDate);
    }
  }, [companyId, selectedDate, fetchSnapshot]);

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    clearError();
  };

  // Find snapshot for selected date
  const selectedSnapshot = snapshots.find(
    snapshot => snapshot.snapshot_date === selectedDate
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Inventory Summary</h1>
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {loading && (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <span className="text-sm text-gray-500">Loading...</span>
            </div>
          )}
        </div>
      </div>

      {/* Message when companyId is not available */}
      {(!companyId || companyId.trim() === '') && !loading && (
        <div className="text-center py-8 text-gray-500">
          <p className="mb-2">Unable to load company information.</p>
          <p className="text-sm">Please select a company in your profile settings.</p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
          <button 
            onClick={clearError}
            className="ml-2 text-red-500 hover:text-red-700 underline"
          >
            Close
          </button>
        </div>
      )}

      {/* Display inventory data */}
      {selectedSnapshot ? (
        <DailyInventorySummary
          date={selectedSnapshot.snapshot_date}
          data={selectedSnapshot}
        />
      ) : !loading && companyId && companyId.trim() !== '' ? (
        <div className="text-center py-8 text-gray-500">
          {error ? 'Unable to load data.' : 'No inventory data available for the selected date.'}
        </div>
      ) : null}

      {/* Loading skeleton */}
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