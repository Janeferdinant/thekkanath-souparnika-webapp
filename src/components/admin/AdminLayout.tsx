import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';
export const AdminLayout: React.FC = () => {
  const [, setGlobalSearch] = useState('');

  return (
    <div className="min-h-screen flex flex-col bg-cream-100/50 text-ink-900 selection:bg-forest-800 selection:text-white">
      <AdminHeader onSearch={setGlobalSearch} />
      <div className="flex-1 flex overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
