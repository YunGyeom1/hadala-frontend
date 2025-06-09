import React from 'react';
import { DailySettlementView } from '@/company/daily_settlement/DailySettlementView';
import { mockDailySettlements } from '@/company/daily_settlement/daily_settlement.mock';

export const DailySettlementPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <DailySettlementView settlements={mockDailySettlements} />
    </div>
  );
}; 