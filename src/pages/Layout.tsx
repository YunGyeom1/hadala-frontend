import { Outlet } from 'react-router-dom';
import TopBar from '../layout/TopBar';
import SideBar from '../layout/SideBar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <TopBar />
      <div className="flex">
        <SideBar />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout; 