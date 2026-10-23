import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  UploadCloud,
  FileSpreadsheet,
  AlertTriangle,
  Building2,
  Sparkles,
  MessageSquareShare,
  Settings,
  ShieldCheck,
  Radio,
  ChevronRight,
  X
} from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';
import { SupplyShieldLogo } from '../common/SupplyShieldLogo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navItems = [
    {
      path: '/',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: undefined,
    },
    {
      path: '/imports',
      label: 'Data Imports',
      icon: UploadCloud,
      badge: 'CSV/ERP',
      badgeColor: 'text-white/70 bg-white/5 border-white/10',
    },
    {
      path: '/purchase-orders',
      label: 'Purchase Orders',
      icon: FileSpreadsheet,
      badge: '2 Delayed',
      badgeColor: 'text-[#E5A53D] bg-[#E5A53D]/10 border-[#E5A53D]/25',
    },
    {
      path: '/inventory-risks',
      label: 'Inventory Risks',
      icon: AlertTriangle,
      badge: 'Critical',
      badgeColor: 'text-[#FF6B6B] bg-[#FF6B6B]/10 border-[#FF6B6B]/25',
    },
    {
      path: '/suppliers',
      label: 'Suppliers',
      icon: Building2,
      badge: '7 Monitored',
      badgeColor: 'text-white/70 bg-white/5 border-white/10',
    },
    {
      path: '/recommendations',
      label: 'Recommendations',
      icon: Sparkles,
      badge: '3 Plans',
      badgeColor: 'text-white bg-white/10 border-white/20',
    },
    {
      path: '/communications',
      label: 'Communications',
      icon: MessageSquareShare,
      badge: undefined,
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: Settings,
      badge: undefined,
    },
  ];

  return (
    <>
      {/* Drawer backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 transition-opacity animate-in fade-in duration-200"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 sm:w-80 liquid-glass-strong flex flex-col justify-between transition-transform duration-300 ease-out shadow-[0_0_60px_rgba(0,0,0,0.95)] border-r border-white/15 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header / Logo */}
        <div>
          <div className="h-20 px-6 flex items-center justify-between border-b border-white/[0.08]">
            <NavLink to="/" onClick={onClose} className="flex items-center gap-3">
              <SupplyShieldLogo size="md" />
            </NavLink>

            <button
              onClick={onClose}
              className="p-2 text-white/60 hover:text-white rounded-xl hover:bg-white/[0.08] transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5 text-white/80" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-4 py-5 space-y-1.5 overflow-y-auto max-h-[calc(100vh-250px)]">
            <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-white/40">
              Intelligence Console
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => onClose()}
                  className={`relative flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-[#0FD3F2]/15 via-[#082495]/20 to-[#921CC0]/15 text-white border border-[#0FD3F2]/40 shadow-[0_4px_16px_rgba(15,211,242,0.25)]'
                      : 'text-white/65 hover:text-[#0FD3F2] hover:bg-[#0FD3F2]/[0.06] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-1.5 rounded-lg transition-colors ${
                        isActive
                          ? 'text-[#0FD3F2] bg-[#0FD3F2]/20 border border-[#0FD3F2]/40 shadow-[0_0_12px_rgba(15,211,242,0.35)]'
                          : 'text-white/60 group-hover:text-[#0FD3F2]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span
                        className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border ${
                          item.badgeColor || 'text-[#921CC0] bg-[#921CC0]/15 border-[#921CC0]/30'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <ChevronRight className="w-4 h-4 text-[#0FD3F2]" />
                    )}
                  </div>

                  {/* Active left indicator bar with Cyan to Magenta gradient */}
                  {isActive && (
                    <div className="absolute left-0 top-2.5 bottom-2.5 w-1 bg-gradient-to-b from-[#0FD3F2] to-[#921CC0] rounded-r shadow-[0_0_10px_rgba(15,211,242,0.9)]" />
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        <div>
          {/* Theme Switcher in Sidebar */}
          <div className="px-4 pb-1">
            <ThemeToggle variant="labeled" />
          </div>

          {/* Bottom Status Card */}
          <div className="p-4 m-4 mt-2 rounded-2xl liquid-glass border border-[#0FD3F2]/20 bg-[#1D0445]/60">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-[#0FD3F2] animate-pulse" />
                <span className="text-xs font-medium text-white">
                  Radar Telemetry
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0FD3F2]/15 text-[#0FD3F2] border border-[#0FD3F2]/30 shadow-[0_0_8px_rgba(15,211,242,0.3)]">
                LIVE
              </span>
            </div>

            <p className="text-[11px] text-white/60 leading-tight">
              Autonomous threat scanner monitoring 7 Tier-1 vendors & 3,840 SKUs.
            </p>

            <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-white/50 font-mono">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-[#0FD3F2]" />
                <span className="text-[#0FD3F2]/90">Integrity: 99.8%</span>
              </div>
              <span className="text-white/40">v1.2.0-EA</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
