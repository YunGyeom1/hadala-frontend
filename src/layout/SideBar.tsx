import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';

interface MenuItem {
  path: string;
  label: string;
  children?: MenuItem[];
}

const SideBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const firstSegment = currentPath.split('/')[1];
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const isActive = (path: string) => {
    return currentPath === path;
  };

  const toggleMenu = (path: string) => {
    setExpandedMenus(prev => 
      prev.includes(path) 
        ? prev.filter(p => p !== path)
        : [...prev, path]
    );
  };

  const getMenuItems = (): MenuItem[] => {
    switch (firstSegment) {
      case 'farmer':
        return [
          { path: '/farmer/dashboard', label: '대시보드' },
        ];
      case 'wholesaler':
        return [
          { path: '/wholesaler/dashboard', label: '대시보드' },
          {
            path: '/wholesaler/transactions',
            label: '거래 관리',
            children: [
              { path: '/wholesaler/transactions/contracts', label: '계약 관리' },
              { path: '/wholesaler/transactions/shipments', label: '출하 관리' },
            ]
          },
          {
            path: '/wholesaler/reports',
            label: '보고서',
            children: [
              { path: '/wholesaler/reports/shipment-summary', label: '출하 현황' },
              { path: '/wholesaler/reports/inventory-summary', label: '재고 현황' },
              { path: '/wholesaler/reports/approval', label: '결재 현황' },
            ]
          },
        ];
      case 'retailer':
        return [
          { path: '/retailer/dashboard', label: '대시보드' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();
  if (menuItems.length === 0) return null;

  const renderMenuItem = (item: MenuItem) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus.includes(item.path);
    const isActiveItem = isActive(item.path);

    return (
      <div key={item.path}>
        <div
          className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
            isActiveItem
              ? 'bg-green-100 text-green-900'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          {hasChildren ? (
            <button
              onClick={() => toggleMenu(item.path)}
              className="flex items-center flex-1"
            >
              {isExpanded ? (
                <FiChevronDown className="mr-2 h-5 w-5" />
              ) : (
                <FiChevronRight className="mr-2 h-5 w-5" />
              )}
              {item.label}
            </button>
          ) : (
            <Link to={item.path} className="flex items-center flex-1">
              {item.label}
            </Link>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div className="ml-4 mt-1 space-y-1">
            {item.children?.map(child => (
              <Link
                key={child.path}
                to={child.path}
                className={`block px-2 py-2 text-sm font-medium rounded-md ${
                  isActive(child.path)
                    ? 'bg-green-50 text-green-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-white shadow-md overflow-y-auto">
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {menuItems.map(renderMenuItem)}
        </div>
      </nav>
    </div>
  );
};

export default SideBar; 