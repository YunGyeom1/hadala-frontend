import React, { useState, useEffect } from 'react';
import { Center } from './types';
import { mockCenters } from './mockData';

interface CenterSearchProps {
  onSelect?: (center: Center) => void;
  placeholder?: string;
  className?: string;
}

const CenterSearch: React.FC<CenterSearchProps> = ({ 
  onSelect,
  placeholder = "센터명으로 검색...",
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Center[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);

  useEffect(() => {
    const searchCenters = () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      // 실제 API 연동 시에는 여기서 API 호출
      const results = mockCenters.filter(center => 
        center.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
      setIsLoading(false);
    };

    const debounceTimer = setTimeout(searchCenters, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleSelect = (center: Center) => {
    setSelectedCenter(center);
    setSearchTerm(center.name);
    setSearchResults([]);
    onSelect?.(center);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (selectedCenter) {
      setSelectedCenter(null);
    }
  };

  const handleInputClick = () => {
    if (selectedCenter) {
      setSearchTerm('');
      setSelectedCenter(null);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onClick={handleInputClick}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
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
                <p className="text-sm text-gray-500">{center.phone || '-'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CenterSearch; 