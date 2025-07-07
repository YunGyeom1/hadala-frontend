import { Center } from '../types';

export const formatOperatingHours = (start?: string, end?: string): string => {
  if (!start || !end) return '';
  return `${start} ~ ${end}`;
};

export const getCenterStatusText = (isOperational?: boolean): string => {
  return isOperational ? 'Operational' : 'Non-operational';
};

export const getCenterStatusColor = (isOperational?: boolean): string => {
  return isOperational 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800';
};

export const formatCenterAddress = (center: Center): string => {
  const parts = [];
  if (center.address) parts.push(center.address);
  if (center.region) parts.push(center.region);
  return parts.join(', ') || 'No address information';
};

export const formatCenterContact = (center: Center): string => {
  return center.phone || 'No contact information';
};

export const sortCentersByName = (centers: Center[]): Center[] => {
  return [...centers].sort((a, b) => a.name.localeCompare(b.name));
};

export const filterCentersByStatus = (centers: Center[], isOperational?: boolean): Center[] => {
  if (isOperational === undefined) return centers;
  return centers.filter(center => center.is_operational === isOperational);
};

export const searchCentersByName = (centers: Center[], searchTerm: string): Center[] => {
  if (!searchTerm.trim()) return centers;
  
  const term = searchTerm.toLowerCase();
  return centers.filter(center => 
    center.name.toLowerCase().includes(term) ||
    (center.address && center.address.toLowerCase().includes(term)) ||
    (center.region && center.region.toLowerCase().includes(term))
  );
}; 