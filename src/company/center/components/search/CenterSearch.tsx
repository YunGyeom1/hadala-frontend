import React, { useState, useEffect, useRef } from 'react';
import { Center } from '../../types';
import { centerService } from '../../services/centerService';

interface CenterSearchProps {
  companyId?: string;
  onSelect?: (center: Center) => void;
  placeholder?: string;
  className?: string;
}

const CenterSearch: React.FC<CenterSearchProps> = ({ 
  companyId,
  onSelect,
  placeholder,
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Center[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // companyId가 있으면 해당 회사 센터, 없으면 모든 센터 검색
  const defaultPlaceholder = companyId 
    ? "해당 회사 센터 검색..." 
    : "센터명으로 검색...";
  
  const finalPlaceholder = placeholder || defaultPlaceholder;

  useEffect(() => {
    // searchTerm이 변경될 때만 검색
    if (!searchTerm.trim()) {
      setSearchResults([]); // 검색어 없으면 목록 초기화
      return;
    }

    const searchCenters = async () => {
      if (!companyId) return;

      setIsLoading(true);
      try {
        const allCenters = await centerService.getCenters(companyId);
        const results = allCenters.filter(center => 
          center.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(results);
      } catch (error) {
        console.error('센터 검색 실패:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchCenters, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, companyId]);

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

  const handleSelect = (center: Center) => {
    setSearchTerm('');
    setSearchResults([]);
    onSelect?.(center);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // input 클릭 시 전체 목록 표시
  const handleInputClick = async () => {
    if (!companyId) return;
    
    // 이미 검색 결과가 있거나 로딩 중이면 다시 실행하지 않음
    if (searchResults.length > 0 || isLoading) return;

    setIsLoading(true);
    try {
      const allCenters = await centerService.getCenters(companyId);
      setSearchResults(allCenters);
    } catch (error) {
      console.error('센터 전체 목록 조회 실패:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onClick={handleInputClick}
          placeholder={finalPlaceholder}
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
          {searchResults.map((center) => (
            <div
              key={center.id}
              onClick={() => handleSelect(center)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{center.name}</p>
                  <p className="text-sm text-gray-500">{center.address || '-'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{center.region || '-'}</p>
                  <p className="text-sm text-gray-500">{center.phone || '-'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CenterSearch;