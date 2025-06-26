import React, { useState, useEffect, useRef } from 'react';
import { ContractResponse } from '../types';
import { contractService } from '../services/contractService';
import { format } from 'date-fns';

interface ContractSearchProps {
  onSelect?: (contract: ContractResponse) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const ContractSearch: React.FC<ContractSearchProps> = ({ 
  onSelect,
  placeholder = "계약명으로 검색...",
  className = "",
  disabled = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<ContractResponse[]>([]);
  const [allContracts, setAllContracts] = useState<ContractResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 초기 계약 목록 로딩
  useEffect(() => {
    const loadContracts = async () => {
      setIsLoading(true);
      try {
        const contracts = await contractService.getContracts();
        setAllContracts(contracts);
      } catch (error) {
        console.error('계약 목록 로딩 실패:', error);
        setAllContracts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadContracts();
  }, []);

  // 검색어에 따른 필터링
  useEffect(() => {
    if (!searchTerm.trim()) {
      // 검색어가 없으면 전체 목록 표시
      setSearchResults(allContracts);
      return;
    }

    // 검색어가 있으면 필터링
    const filteredResults = allContracts.filter(contract => 
      contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contract.supplier_company?.name && contract.supplier_company.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contract.receiver_company?.name && contract.receiver_company.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contract.contract_status && contract.contract_status.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setSearchResults(filteredResults);
  }, [searchTerm, allContracts]);

  // 다른 곳 클릭 시 검색 결과 숨기기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (contract: ContractResponse) => {
    setSearchTerm('');
    setSearchResults([]);
    setIsFocused(false);
    onSelect?.(contract);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    // 검색어가 없으면 전체 목록 표시
    if (!searchTerm.trim()) {
      setSearchResults(allContracts);
    }
  };

  const handleInputBlur = () => {
    // 약간의 지연을 두어 클릭 이벤트가 처리될 수 있도록 함
    setTimeout(() => {
      setIsFocused(false);
    }, 200);
  };

  // 표시할 결과 결정
  const displayResults = isFocused ? searchResults : [];

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
      
      {displayResults.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {displayResults.map((contract) => (
            <div
              key={contract.id}
              onClick={() => handleSelect(contract)}
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{contract.title}</p>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                    <span>공급: {contract.supplier_company?.name || '-'}</span>
                    <span>수신: {contract.receiver_company?.name || '-'}</span>
                  </div>
                  <div className="flex items-center space-x-4 mt-1 text-xs text-gray-400">
                    <span>계약일: {contract.contract_datetime ? format(new Date(contract.contract_datetime), 'yyyy-MM-dd') : '-'}</span>
                    <span>상태: {contract.contract_status || '-'}</span>
                    <span>결제: {contract.payment_status || '-'}</span>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p className="font-medium">{contract.total_price?.toLocaleString()}원</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {isFocused && displayResults.length === 0 && !isLoading && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500">
          검색 결과가 없습니다.
        </div>
      )}
    </div>
  );
};

export default ContractSearch; 