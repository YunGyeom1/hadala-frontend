import React from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import SideBar from './SideBar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <TopBar />
      <div className="flex h-[calc(100vh-4rem)] mt-16">
        <SideBar />
        <main className="flex-1 ml-64 overflow-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout; 