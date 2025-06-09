import React, { useState } from 'react';
import { mockWholesaleContracts } from '../../transaction/wholesale_contract/wholesale_contract.mock';
import { WholesaleContractView } from '../../transaction/wholesale_contract/WholesaleContractView';
import type { WholesaleContract } from '../../transaction/wholesale_contract/wholesale_contract';

export const WholesaleContractPage: React.FC = () => {
  const [contracts, setContracts] = useState<WholesaleContract[]>(mockWholesaleContracts);

  const handleUpdate = (updatedContract: WholesaleContract) => {
    setContracts(contracts.map(contract => 
      contract.id === updatedContract.id ? updatedContract : contract
    ));
  };

  const handleDelete = (id: string) => {
    setContracts(contracts.filter(contract => contract.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">도매계약서</h1>
      <div className="space-y-6">
        {contracts.map(contract => (
          <WholesaleContractView
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