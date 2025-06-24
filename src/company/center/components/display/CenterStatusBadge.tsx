import React from 'react';
import { getCenterStatusText, getCenterStatusColor } from '../../utils/centerUtils';

interface CenterStatusBadgeProps {
  isOperational?: boolean;
  className?: string;
}

export const CenterStatusBadge: React.FC<CenterStatusBadgeProps> = ({ 
  isOperational, 
  className = "" 
}) => {
  const statusText = getCenterStatusText(isOperational);
  const statusColor = getCenterStatusColor(isOperational);

  return (
    <span className={`px-2 py-1 text-xs rounded-full ${statusColor} ${className}`}>
      {statusText}
    </span>
  );
}; 