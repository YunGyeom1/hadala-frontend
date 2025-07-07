import React, { useState } from 'react';

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
  placeholder = "Search..."
}: SearchListProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(item => {
    const fields = searchFields(item);
    return fields.some(field => 
      field.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="bg-white rounded-lg shadow h-[600px]">
      <div className="p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-base font-medium">Search</h4>
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredItems.length > 0 ? (
            <div className="space-y-2">
              {filteredItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => onSelect(item)}
                  className="w-full text-left p-4 border rounded-lg hover:bg-gray-50"
                >
                  {renderItem(item)}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-4">
              No search results found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchList; 