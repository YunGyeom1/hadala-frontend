import React, { useState, useEffect, useRef } from 'react';
import { Company } from './types';
import { companyService } from './services/companyService';

interface CompanySearchProps {
  onSelect?: (company: Company) => void;
  placeholder?: string;
  className?: string;
}

const CompanySearch: React.FC<CompanySearchProps> = ({ 
  onSelect,
  placeholder = "회사명 또는 사업자등록번호로 검색...",
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const searchCompanies = async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        // 실제 API 호출
        const companies = await companyService.getCompanies();
        const results = companies.filter(company => 
          company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.business_number?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(results);
      } catch (error) {
        console.error('회사 검색 실패:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchCompanies, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // 다른 곳 클릭 시 검색 결과 숨기기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (company: Company) => {
    setSearchTerm('');
    setSearchResults([]);
    onSelect?.(company);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleInputClick = () => {
    // 클릭 시 아무것도 안 함
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onClick={handleInputClick}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
      
      {searchResults.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {searchResults.map((company) => (
            <div
              key={company.id}
              onClick={() => handleSelect(company)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{company.name}</p>
                  <p className="text-sm text-gray-500">{company.business_number || '-'}</p>
                </div>
                <p className="text-sm text-gray-500">{company.address || '-'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanySearch; 