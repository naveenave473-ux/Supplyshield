import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { SearchModal } from './SearchModal';
import { Background3DScene } from '../3d/Background3DScene';

export const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#1D0445] text-[#FFFFFF] flex relative overflow-x-hidden font-sans">
      {/* 3D WebGL Background Scene (Shield, constellation, orbital rings) */}
      <Background3DScene />

      {/* Ambient Radial Lights with 7-Color Palette */}
      <div className="fixed top-0 left-1/4 w-[520px] h-[520px] bg-[#0FD3F2]/[0.08] rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-10 w-[620px] h-[620px] bg-[#921CC0]/[0.08] rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="fixed top-1/2 right-1/3 w-[460px] h-[460px] bg-[#4C128A]/[0.06] rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 left-10 w-[420px] h-[420px] bg-[#082495]/[0.06] rounded-full blur-[140px] pointer-events-none -z-10" />

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
