import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SideBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const firstSegment = currentPath.split('/')[1];

  const isActive = (path: string) => {
    return currentPath === path;
  };

  const getMenuItems = () => {
    switch (firstSegment) {
      case 'farmer':
        return [
          { path: '/farmer/dashboard', label: '대시보드' },
        ];
      case 'wholesaler':
        return [
          { path: '/wholesaler/dashboard', label: '대시보드' },
        ];
      case 'retailer':
        return [
          { path: '/retailer/dashboard', label: '대시보드' },
        ];
      case 'tester':
        return [
          { path: '/tester/dashboard', label: '대시보드' },
          { path: '/tester/shipments', label: '출하' },
          { path: '/tester/contracts', label: '계약' },
          { path: '/tester/shipment-summary', label: '출하 현황 요약' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();
  if (menuItems.length === 0) return null;

  return (
    <div className="w-64 bg-white shadow-md h-screen">
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                isActive(item.path)
                  ? 'bg-green-100 text-green-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default SideBar; 