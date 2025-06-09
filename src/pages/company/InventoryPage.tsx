import React from 'react';
import { InventoryView } from '@/company/inventory/InventoryView';
import { mockInventory } from '@/company/inventory/inventory.mock';

export const InventoryPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <InventoryView inventory={mockInventory} />
    </div>
  );
}; 