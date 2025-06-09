import React from 'react';

interface InventoryFilterProps {
  onFilterChange: (filters: {
    date: string;
    cropName: string;
    qualityGrade: string;
    centerId: string;
  }) => void;
  centers: { id: string; name: string }[];
}

export const InventoryFilter: React.FC<InventoryFilterProps> = ({ onFilterChange, centers }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({
      date: name === 'date' ? value : '',
      cropName: name === 'cropName' ? value : '',
      qualityGrade: name === 'qualityGrade' ? value : '',
      centerId: name === 'centerId' ? value : '',
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">날짜</label>
          <input
            type="date"
            name="date"
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">작물명</label>
          <input
            type="text"
            name="cropName"
            placeholder="작물명 입력"
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">등급</label>
          <select
            name="qualityGrade"
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">전체</option>
            <option value="A">A등급</option>
            <option value="B">B등급</option>
            <option value="C">C등급</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">센터</label>
          <select
            name="centerId"
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">전체</option>
            {centers.map(center => (
              <option key={center.id} value={center.id}>
                {center.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}; 