import React, { useState, useMemo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';

// Types
export interface MenuItem {
  path: string;
  label: string;
  children?: MenuItem[];
}

export interface MenuConfig {
  [key: string]: MenuItem[];
}

// Constants
const MENU_CONFIG: MenuConfig = {
  farmer: [
    { path: '/farmer/dashboard', label: '대시보드' },
  ],
  wholesaler: [
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
  ],
  retailer: [
    { path: '/retailer/dashboard', label: '대시보드' },
  ],
};

// Utility functions
const getPathSegment = (pathname: string): string => {
  const segments = pathname.split('/').filter(Boolean);
  return segments[0] || '';
};

const isPathActive = (currentPath: string, menuPath: string): boolean => {
  return currentPath.startsWith(menuPath);
};

// Component
const SideBar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const pathSegment = getPathSegment(currentPath);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());

  // Memoized menu items
  const menuItems = useMemo(() => {
    return MENU_CONFIG[pathSegment] || [];
  }, [pathSegment]);

  // Early return if no menu items
  if (menuItems.length === 0) {
    return null;
  }

  // Handlers
  const handleToggleMenu = useCallback((path: string) => {
    setExpandedMenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  }, []);

  // Render functions
  const renderMenuItem = useCallback((item: MenuItem) => {
    const hasChildren = Boolean(item.children?.length);
    const isExpanded = expandedMenus.has(item.path);
    const isActiveItem = isPathActive(currentPath, item.path);

    const baseClasses = "group flex items-center px-2 py-2 text-base font-medium rounded-md";
    const activeClasses = "bg-green-100 text-green-900";
    const inactiveClasses = "text-gray-600 hover:bg-gray-50 hover:text-gray-900";

    return (
      <div key={item.path}>
        <div className={`${baseClasses} ${isActiveItem ? activeClasses : inactiveClasses}`}>
          {hasChildren ? (
            <button
              onClick={() => handleToggleMenu(item.path)}
              className="flex items-center flex-1"
              type="button"
              aria-expanded={isExpanded}
              aria-label={`${item.label} 메뉴 ${isExpanded ? '접기' : '펼치기'}`}
            >
              {isExpanded ? (
                <FiChevronDown className="mr-2 h-5 w-5" aria-hidden="true" />
              ) : (
                <FiChevronRight className="mr-2 h-5 w-5" aria-hidden="true" />
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
                  isPathActive(currentPath, child.path)
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
  }, [currentPath, expandedMenus, handleToggleMenu]);

  return (
    <aside className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-white shadow-md overflow-y-auto">
      <nav className="mt-5 px-2" role="navigation" aria-label="사이드바 네비게이션">
        <div className="space-y-1">
          {menuItems.map(renderMenuItem)}
        </div>
      </nav>
    </aside>
  );
};

export default SideBar; 