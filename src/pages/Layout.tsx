import { Outlet, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import TopBar from '../layout/TopBar';
import SideBar from '../layout/SideBar';

interface LayoutProps {
  children?: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const path = location.pathname;
  
  let type: 'farmer' | 'wholesaler' | 'retailer' | undefined;
  if (path.startsWith('/farmer')) {
    type = 'farmer';
  } else if (path.startsWith('/wholesaler')) {
    type = 'wholesaler';
  } else if (path.startsWith('/retailer')) {
    type = 'retailer';
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <TopBar />
      <div className="flex">
        {type && <SideBar type={type} />}
        <main className="flex-1 p-8">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default Layout; 