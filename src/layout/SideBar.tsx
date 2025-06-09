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
          { path: '/farmer/wholesale-contract', label: '농산물 도매계약서' },
          { path: '/farmer/wholesale-certification', label: '농산물 도매인증서' }
        ];
      case 'wholesaler':
        return [
          { path: '/wholesaler/dashboard', label: '대시보드' },
          { path: '/wholesaler/price-guide', label: '농산물 가격 가이드라인' },
          { path: '/wholesaler/wholesale-contract', label: '농산물 도매계약' },
          { path: '/wholesaler/wholesale-certification', label: '농산물 도매인증' },
          { path: '/wholesaler/retail-contract', label: '농산물 소매계약' },
          { path: '/wholesaler/retail-certification', label: '농산물 소매인증' },
          { path: '/wholesaler/inventory', label: '재고현황' },
          { path: '/wholesaler/inventory-comparison', label: '재고비교' }
        ];
      case 'retailer':
        return [
          { path: '/retailer/dashboard', label: '대시보드' },
          { path: '/retailer/retail-contract', label: '농산물 소매계약서' },
          { path: '/retailer/wholesale-certification', label: '농산물 도매인증서' }
        ];
      case 'tester':
        return [
          { path: '/tester/dashboard', label: '대시보드' },
          { path: '/tester/wholesale-contract', label: '도매계약서' },
          { path: '/tester/retail-contract', label: '소매계약서' },
          { path: '/tester/wholesale-shipment', label: '도매출하' },
          { path: '/tester/retail-shipment', label: '소매출하' },
          { path: '/tester/wholesale-certification', label: '도매인증서' },
          { path: '/tester/retail-certification', label: '소매인증서' },
          { path: '/tester/inventory', label: '재고현황서' },
          { path: '/tester/inventory-comparison', label: '재고비교' },
          { path: '/tester/company', label: '회사정보' },
          { path: '/tester/company-inventory', label: '회사 재고현황' },
          { path: '/tester/aggregated-inventory', label: '전체 재고현황' },
          { path: '/tester/company-center', label: '회사 집하장' },
          { path: '/tester/daily-settlement', label: '일일 정산' },
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