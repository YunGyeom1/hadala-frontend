import React from 'react';
import { Center } from '../../types';
import { CenterStatusBadge } from './CenterStatusBadge';
import { formatOperatingHours, formatCenterAddress, formatCenterContact } from '../../utils/centerUtils';

interface CenterCardProps {
  center: Center;
  onClick?: (center: Center) => void;
  showActions?: boolean;
  className?: string;
}

export const CenterCard: React.FC<CenterCardProps> = ({ 
  center, 
  onClick, 
  showActions = false,
  className = ""
}) => {
  const handleClick = () => {
    onClick?.(center);
  };

  return (
    <div 
      className={`border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors ${className}`}
      onClick={handleClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{center.name}</h4>
          <p className="text-sm text-gray-600 mt-1">
            {formatCenterAddress(center)}
          </p>
          <p className="text-sm text-gray-600">
            {formatCenterContact(center)}
          </p>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <CenterStatusBadge isOperational={center.is_operational} />
        </div>
      </div>
      
      {center.operating_start && center.operating_end && (
        <div className="mt-2 text-sm text-gray-600">
          Operating Hours: {formatOperatingHours(center.operating_start, center.operating_end)}
        </div>
      )}
      
      {showActions && (
        <div className="mt-3 pt-3 border-t border-gray-200 flex justify-end space-x-2">
          <button
            className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-700"
            onClick={(e) => {
              e.stopPropagation();
              // Edit action
            }}
          >
            Edit
          </button>
          <button
            className="px-3 py-1 text-xs font-medium text-red-600 hover:text-red-700"
            onClick={(e) => {
              e.stopPropagation();
              // Delete action
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}; 