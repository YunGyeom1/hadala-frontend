import React from 'react';
import { CenterView } from '@/company/center/CenterView';
import { mockCenter } from '@/company/center/center.mock';

export const CenterPage: React.FC = () => {
  const handleUpdate = (center: any) => {
    console.log('Update center:', center);
    // TODO: API 호출로 변경
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <CenterView center={mockCenter} onUpdate={handleUpdate} />
    </div>
  );
}; 