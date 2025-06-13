import React from 'react';
import ContractList from '../../transactions/contract/ContractList';
import { mockContracts } from '../../transactions/contract/mock';

const ContractPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">계약 관리</h1>
      <ContractList contracts={mockContracts} />
    </div>
  );
};

export default ContractPage; 