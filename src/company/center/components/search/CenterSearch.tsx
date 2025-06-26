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
  const [allCenters, setAllCenters] = useState<Center[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // companyId가 있으면 해당 회사 센터, 없으면 모든 센터 검색
  const defaultPlaceholder = companyId 
    ? "해당 회사 센터 검색..." 
    : "센터명으로 검색...";
  
  const finalPlaceholder = placeholder || defaultPlaceholder;

  // 초기 센터 목록 로딩
  useEffect(() => {
    const loadCenters = async () => {
      if (!companyId) return;
      
      setIsLoading(true);
      try {
        const centers = await centerService.getCenters(companyId);
        setAllCenters(centers);
      } catch (error) {
        console.error('센터 목록 로딩 실패:', error);
        setAllCenters([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCenters();
  }, [companyId]);

  // 검색어에 따른 필터링
  useEffect(() => {
    if (!searchTerm.trim()) {
      // 검색어가 없으면 전체 목록 표시 (회사 ID가 있을 때만)
      if (companyId) {
        setSearchResults(allCenters);
      } else {
        setSearchResults([]);
      }
      return;
    }

    // 검색어가 있으면 필터링
    const filteredResults = allCenters.filter(center => 
      center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (center.address && center.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (center.region && center.region.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setSearchResults(filteredResults);
  }, [searchTerm, allCenters, companyId]);

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

  const handleSelect = (center: Center) => {
    setSearchTerm('');
    setSearchResults([]);
    setIsFocused(false);
    onSelect?.(center);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    // 회사 ID가 있고 검색어가 없으면 전체 목록 표시
    if (companyId && !searchTerm.trim()) {
      setSearchResults(allCenters);
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
          placeholder={finalPlaceholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
      
      {displayResults.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {displayResults.map((center) => (
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
      
      {isFocused && displayResults.length === 0 && !isLoading && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500">
          {companyId ? '해당 회사의 센터가 없습니다.' : '검색 결과가 없습니다.'}
        </div>
      )}
    </div>
  );
};

export default CenterSearch;