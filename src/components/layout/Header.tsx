import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  CheckCircle2,
  ExternalLink,
  SlidersHorizontal,
  ChevronDown,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';
import { SupplyShieldLogo } from '../common/SupplyShieldLogo';
import { mockNotifications } from '../../data/mockData';
import { NotificationItem } from '../../types';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenSearchModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  onOpenSearchModal,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (item: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
    );
    setIsNotifOpen(false);
    if (item.linkTo) {
      navigate(item.linkTo);
    }
  };

  const navLinks = [
    { path: '/', label: 'Overview' },
    { path: '/inventory-risks', label: 'Intelligence' },
    { path: '/suppliers', label: 'Suppliers' },
    { path: '/purchase-orders', label: 'Analytics' },
    { path: '/recommendations', label: 'Action Center' },
  ];

  return (
    <header className="glass-header sticky top-0 z-30 h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 border-b border-white/[0.08] backdrop-blur-2xl bg-[#0B0B0B]/85 shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
      {/* Left: Brand Identity & Module Drawer Toggle */}
      <div className="flex items-center gap-3 sm:gap-5">
        <button
          onClick={onToggleSidebar}
          className="p-2.5 text-white/70 hover:text-white rounded-xl glass-control flex items-center gap-2 group transition-all"
          aria-label="Toggle navigation menu"
          title="Open All Modules Drawer"
        >
          <Menu className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
          <span className="hidden xl:inline text-xs font-medium text-white/70 group-hover:text-white">
            Modules
          </span>
        </button>

        {/* Brand Logo & Title */}
        <NavLink to="/" className="flex items-center gap-3">
          <SupplyShieldLogo size="md" />
        </NavLink>
      </div>

      {/* Center: Translucent Glass Navigation Surface */}
      <nav className="hidden lg:flex items-center p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] backdrop-blur-xl">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={`px-4 py-1.5 rounded-xl text-xs font-medium tracking-wide transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#0FD3F2] to-[#007CB8] text-[#06040A] font-bold shadow-[0_2px_14px_rgba(15,211,242,0.45)]'
                  : 'text-white/70 hover:text-[#0FD3F2] hover:bg-white/[0.06]'
              }`}
            >
              {link.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Right: Search, Demo Mode, Notifications, Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Global Search Button */}
        <button
          onClick={onOpenSearchModal}
          className="p-2 sm:px-3 sm:py-2 text-white/70 hover:text-white rounded-xl glass-control flex items-center gap-2 text-xs transition-colors hover:border-[#0FD3F2]/40"
          title="Global Search (Ctrl+K)"
        >
          <Search className="w-4 h-4 text-[#0FD3F2]" />
          <span className="hidden md:inline text-xs text-white/70">Search POs & Parts</span>
          <kbd className="hidden md:inline text-[10px] font-mono bg-[#0FD3F2]/10 border border-[#0FD3F2]/20 px-1.5 py-0.5 rounded text-[#0FD3F2]">
            Ctrl+K
          </kbd>
        </button>

        {/* Live Simulation Mode Badge */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#0FD3F2]/30 bg-[#0FD3F2]/[0.06] shadow-[0_0_14px_rgba(15,211,242,0.15)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0FD3F2] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0FD3F2] ring-2 ring-[#1D0445]" />
          </span>
          <span className="text-xs font-medium text-white">Live Telemetry</span>
          <span className="text-[10px] text-[#0FD3F2] border-l border-white/10 pl-2 font-mono">
            Detroit Alpha
          </span>
        </div>

        {/* Theme Toggle Button */}
        <ThemeToggle />

        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2.5 rounded-xl glass-control text-white/70 hover:text-white hover:border-[#921CC0]/40 transition-colors"
            aria-label="Open notifications"
          >
            <Bell className="w-5 h-5 text-white/80" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-[#921CC0] text-[10px] font-bold text-white shadow-[0_0_10px_rgba(146,28,192,0.8)] animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Popover */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl liquid-glass-strong border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.95)] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-black/40">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-sm text-white">Risk Alerts</h4>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/15 text-white border border-white/25">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-white/80 hover:text-white transition-colors flex items-center gap-1 font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-white/[0.04]">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleNotificationClick(item)}
                    className={`p-3.5 hover:bg-white/[0.04] transition-colors cursor-pointer flex gap-3 ${
                      !item.read ? 'bg-white/[0.03]' : ''
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        item.type === 'critical'
                          ? 'bg-[#FF6B6B] shadow-[0_0_8px_rgba(255,107,107,0.8)]'
                          : item.type === 'warning'
                          ? 'bg-[#E5A53D] shadow-[0_0_8px_rgba(229,165,61,0.5)]'
                          : 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={`text-xs font-medium truncate ${
                            !item.read ? 'text-white' : 'text-white/60'
                          }`}
                        >
                          {item.title}
                        </p>
                        <span className="text-[10px] text-white/40 flex-shrink-0 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {item.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-white/60 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 border-t border-white/[0.08] bg-black/40 text-center">
                <button
                  onClick={() => {
                    setIsNotifOpen(false);
                    navigate('/purchase-orders');
                  }}
                  className="text-xs text-white/80 hover:text-white inline-flex items-center gap-1 font-medium"
                >
                  <span>View all monitored order alerts</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-2xl glass-control text-left"
          >
            <div className="relative w-8 h-8 rounded-xl bg-white/[0.12] border border-white/20 p-[1.5px] shadow-[0_0_10px_rgba(255,255,255,0.15)] flex items-center justify-center font-mono font-medium text-xs text-white">
              ER
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-white ring-2 ring-[#050505]" />
            </div>
            <div className="hidden 2xl:block">
              <p className="text-xs font-medium text-white leading-tight">
                Dr. Elena Rostova
              </p>
              <p className="text-[10px] text-white/50">VP Procurement</p>
            </div>
            <ChevronDown className="w-3 h-3 text-white/50" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-64 rounded-2xl liquid-glass-strong border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.95)] p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2.5 border-b border-white/[0.06]">
                <p className="text-xs font-medium text-white">Dr. Elena Rostova</p>
                <p className="text-[11px] text-white/50">elena.rostova@supplyshield.io</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/10 text-white/90 border border-white/20 text-[10px] font-mono">
                  <span>Role: Lead Procurement Admin</span>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate('/settings');
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/[0.06] rounded-xl flex items-center gap-2 transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-white/80" />
                  Workspace Settings & Rules
                </button>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate('/imports');
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/[0.06] rounded-xl flex items-center gap-2 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-white/80" />
                  Data Sources & ERP Connectors
                </button>
              </div>

              <div className="pt-2 border-t border-white/[0.06] px-3 py-2 text-[10px] text-white/50 flex items-center justify-between font-mono">
                <span>Facility: Detroit Alpha</span>
                <span className="text-white font-medium">ERP Sync OK</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
