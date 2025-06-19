import React, { useState, useEffect } from 'react';

interface SearchListProps<T> {
  items: T[];
  onSelect: (item: T) => void;
  onCancel: () => void;
  searchFields: (item: T) => string[];
  renderItem: (item: T) => React.ReactNode;
  placeholder?: string;
}

function SearchList<T>({
  items,
  onSelect,
  onCancel,
  searchFields,
  renderItem,
  placeholder = '검색어를 입력하세요...'
}: SearchListProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<T[]>([]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const results = items.filter(item => 
      searchFields(item).some(field => 
        field?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setSearchResults(results);
  }, [searchTerm, items, searchFields]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
        </div>
        <button
          onClick={onCancel}
          className="ml-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
        >
          취소
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {searchResults.length > 0 ? (
          <div className="space-y-2">
            {searchResults.map((item, index) => (
              <div
                key={index}
                onClick={() => onSelect(item)}
                className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                {renderItem(item)}
              </div>
            ))}
          </div>
        ) : searchTerm ? (
          <div className="text-center text-gray-500 py-4">
            검색 결과가 없습니다.
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4">
            검색어를 입력해주세요.
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchList; 