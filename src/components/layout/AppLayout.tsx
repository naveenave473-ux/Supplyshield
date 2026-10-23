import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { SearchModal } from './SearchModal';
import { Background3DScene } from '../3d/Background3DScene';

export const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  React.useEffect(() => {
    const handleToggle = () => setIsSidebarOpen((prev) => !prev);
    const handleOpen = () => setIsSidebarOpen(true);
    window.addEventListener('toggle-sidebar', handleToggle);
    window.addEventListener('open-sidebar', handleOpen);
    return () => {
      window.removeEventListener('toggle-sidebar', handleToggle);
      window.removeEventListener('open-sidebar', handleOpen);
    };
  }, []);

  return (
    <div className="min-h-screen bg-transparent text-[#FFFFFF] flex relative overflow-x-hidden font-sans selection:bg-white/20 selection:text-white">
      {/* 3D WebGL & Spinning Particle Globe Background Scene */}
      <Background3DScene />

      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 w-full relative z-10">
        <Header
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onOpenSearchModal={() => setIsSearchOpen(true)}
        />

        <main className="flex-1 w-full mx-auto space-y-8 animate-in fade-in duration-300">
          <Outlet />
        </main>
      </div>

      {/* Global Search Dialog */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
};
