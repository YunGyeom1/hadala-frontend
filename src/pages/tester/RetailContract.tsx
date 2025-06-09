import React, { useState } from 'react';
import { mockRetailContracts } from '../../transaction/retail_contract/retail_contract.mock';
import { RetailContractView } from '../../transaction/retail_contract/RetailContractView';
import type { RetailContract } from '../../transaction/retail_contract/retail_contract';

export const RetailContractPage: React.FC = () => {
  const [contracts, setContracts] = useState<RetailContract[]>(mockRetailContracts);

  const handleUpdate = (updatedContract: RetailContract) => {
    setContracts(contracts.map(contract => 
      contract.id === updatedContract.id ? updatedContract : contract
    ));
  };

  const handleDelete = (id: string) => {
    setContracts(contracts.filter(contract => contract.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">소매계약서</h1>
      <div className="space-y-6">
        {contracts.map(contract => (
          <RetailContractView
            key={contract.id}
            contract={contract}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}; 