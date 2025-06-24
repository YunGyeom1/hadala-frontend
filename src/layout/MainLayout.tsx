import { Outlet, useLocation } from 'react-router-dom';
import SideBar from './SideBar';
import TopBar from './TopBar';

const MainLayout = () => {
  const location = useLocation();
  const isProfilePage = location.pathname === '/profile';

  return (
    <div className="min-h-screen bg-gray-100">
      <TopBar />
      <div className="flex h-[calc(100vh-4rem)] mt-16">
        {!isProfilePage && <SideBar />}
        <main className={`flex-1 overflow-auto ${!isProfilePage ? 'ml-64' : ''}`}>
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout; 