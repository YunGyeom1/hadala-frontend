import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SideBarProps {
  type: 'farmer' | 'wholesaler' | 'retailer';
}

const SideBar = ({ type }: SideBarProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    return currentPath === path;
  };

  const getMenuItems = () => {
    switch (type) {
      case 'farmer':
        return [
          { path: '/farmer', label: '대시보드' },
          { path: '/farmer/products', label: '상품 관리' },
          { path: '/farmer/orders', label: '주문 관리' },
          { path: '/farmer/settings', label: '설정' }
        ];
      case 'wholesaler':
        return [
          { path: '/wholesaler', label: '대시보드' },
          { path: '/wholesaler/inventory', label: '재고 관리' },
          { path: '/wholesaler/suppliers', label: '공급업체' },
          { path: '/wholesaler/orders', label: '주문 관리' },
          { path: '/wholesaler/settings', label: '설정' }
        ];
      case 'retailer':
        return [
          { path: '/retailer', label: '대시보드' },
          { path: '/retailer/products', label: '상품 관리' },
          { path: '/retailer/suppliers', label: '공급업체' },
          { path: '/retailer/orders', label: '주문 관리' },
          { path: '/retailer/settings', label: '설정' }
        ];
    }
  };

  return (
    <div className="w-64 bg-white shadow-md h-screen">
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {getMenuItems()?.map((item) => (
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