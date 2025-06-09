import React from 'react';
import { AggregatedInventoryView } from '@/company/inventory/AggregatedInventoryView';
import { mockAggregatedInventory } from '@/company/inventory/aggregated_inventory.mock';

export const AggregatedInventoryPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <AggregatedInventoryView inventories={mockAggregatedInventory} />
    </div>
  );
}; 