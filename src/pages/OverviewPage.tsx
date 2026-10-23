import React, { useState, useEffect, useRef } from 'react';
import {
  FileSpreadsheet,
  AlertTriangle,
  Clock,
  DollarSign,
  UploadCloud,
  ChevronRight,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Activity,
  ArrowDown,
  Building2,
  Radio,
  SlidersHorizontal,
  Menu,
  ShieldAlert,
  Network,
  Orbit,
  BrainCircuit,
  Bell,
  User,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from 'recharts';

import { MetricCard } from '../components/common/MetricCard';
import { GlassPanel } from '../components/common/GlassPanel';
import { GlassTable, Column } from '../components/common/GlassTable';
import { ChartPanel, CustomChartTooltip } from '../components/common/ChartPanel';
import { StatusBadge } from '../components/common/StatusBadge';
import { NeumorphicButton } from '../components/common/NeumorphicButton';
import { Tilt3DCard } from '../components/common/Tilt3DCard';
import { SupplyShieldLogo } from '../components/common/SupplyShieldLogo';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { SupplyNetworkIntelligence3D } from '../components/3d/SupplyNetworkIntelligence3D';
import {
  mockPurchaseOrders,
  mockMaterialRisks,
  mockSuppliers,
  deliveryPerformanceChartData,
  supplierRiskDistributionData,
  inventoryCoverageDemandData,
  shortageExposureTrendData,
} from '../data/mockData';
import { MaterialRisk } from '../types';

export const OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeSection, setActiveSection] = useState<'hero' | 'network' | 'analytics' | 'command'>('hero');
  const [showRightNotifTooltip, setShowRightNotifTooltip] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const secNet = document.getElementById('section-network');
      const secAnalytics = document.getElementById('section-analytics');
      const secCommand = document.getElementById('operational-command');

      const posNet = secNet ? secNet.offsetTop - 300 : 900;
      const posAnalytics = secAnalytics ? secAnalytics.offsetTop - 300 : 1700;
      const posCommand = secCommand ? secCommand.offsetTop - 300 : 2500;

      if (scrollY >= posCommand) {
        setActiveSection('command');
      } else if (scrollY >= posAnalytics) {
        setActiveSection('analytics');
      } else if (scrollY >= posNet) {
        setActiveSection('network');
      } else {
        setActiveSection('hero');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setRefreshKey((k) => k + 1);
    }, 600);
  };

  const criticalMaterials = mockMaterialRisks.filter(
    (m) => m.replenishmentStatus === 'shortage' || m.replenishmentStatus === 'delayed'
  );

  const upcomingDeliveries = [...mockPurchaseOrders]
    .filter((po) => po.status !== 'received')
    .sort((a, b) => new Date(a.revisedDeliveryDate).getTime() - new Date(b.revisedDeliveryDate).getTime())
    .slice(0, 4);

  const highestRiskSuppliers = mockSuppliers
    .filter((s) => s.riskLevel === 'critical' || s.riskLevel === 'high')
    .slice(0, 3);

  // Sparkline data for Risk Monitor card
  const riskSparklineData = [
    { day: 'M', val: 32 },
    { day: 'T', val: 45 },
    { day: 'W', val: 58 },
    { day: 'T', val: 52 },
    { day: 'F', val: 78 },
    { day: 'S', val: 68 },
    { day: 'S', val: 84 },
  ];

  const materialColumns: Column<MaterialRisk>[] = [
    {
      key: 'sku',
      header: 'Material / SKU',
      render: (m) => (
        <div>
          <span className="font-mono font-medium text-xs text-white block">
            {m.sku}
          </span>
          <span className="text-xs text-white/60 truncate max-w-[180px] block">
            {m.name}
          </span>
        </div>
      ),
    },
    {
      key: 'daysOfCoverage',
      header: 'Days of Coverage',
      render: (m) => {
        const isCritical = m.daysOfCoverage < 7;
        return (
          <div className="space-y-1 min-w-[110px]">
            <div className="flex justify-between text-xs font-mono">
              <span className={isCritical ? 'text-[#FF6B6B] font-medium' : 'text-[#3DD598]'}>
                {m.daysOfCoverage} days
              </span>
              <span className="text-[10px] text-white/50">Burn: {m.dailyBurnRate}/d</span>
            </div>
            <div className="h-1.5 w-full bg-black/60 rounded-full overflow-hidden border border-white/10">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isCritical
                    ? 'bg-[#FF6B6B] shadow-[0_0_8px_rgba(255,107,107,0.7)]'
                    : 'bg-[#3DD598] shadow-[0_0_8px_rgba(61,213,152,0.5)]'
                }`}
                style={{ width: `${Math.min(100, (m.daysOfCoverage / 20) * 100)}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: 'currentStock',
      header: 'Stock vs Min',
      render: (m) => (
        <span className="font-mono text-xs">
          <strong className="text-white">{m.currentStock.toLocaleString()}</strong>{' '}
          <span className="text-white/50">/ {m.minRequiredStock.toLocaleString()} {m.unit}</span>
        </span>
      ),
    },
    {
      key: 'replenishmentStatus',
      header: 'Status',
      render: (m) => <StatusBadge status={m.replenishmentStatus} size="sm" />,
    },
    {
      key: 'primarySupplier',
      header: 'Primary Supplier',
      render: (m) => (
        <span className="text-xs text-white/70 truncate max-w-[140px] block">
          {m.primarySupplier}
        </span>
      ),
    },
    {
      key: 'action',
      header: 'Mitigation',
      align: 'right',
      render: () => (
        <NeumorphicButton
          variant="secondary"
          size="sm"
          onClick={() => navigate('/recommendations')}
          className="text-xs text-white"
        >
          Resolve
        </NeumorphicButton>
      ),
    },
  ];

  return (
    <div key={refreshKey} ref={containerRef} className="relative w-full overflow-hidden space-y-24 pb-24">
      {/* ========================================================
          VERTICAL FLOATING SECTION PROGRESS NAVIGATOR (Right Edge)
         ======================================================== */}
      <div className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-3 p-2 rounded-2xl liquid-glass border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        {[
          { id: 'section-hero', label: '01 Identity', key: 'hero' },
          { id: 'section-network', label: '02 3D Network', key: 'network' },
          { id: 'section-analytics', label: '03 Analytics', key: 'analytics' },
          { id: 'operational-command', label: '04 Command Center', key: 'command' },
        ].map((sec) => (
          <button
            key={sec.id}
            onClick={() => scrollToSection(sec.id)}
            className={`group relative flex items-center justify-end p-2 rounded-xl transition-all ${
              activeSection === sec.key
                ? 'bg-white/15 text-white'
                : 'text-white/40 hover:text-white hover:bg-white/[0.05]'
            }`}
            title={sec.label}
          >
            <span
              className={`w-2 h-2 rounded-full transition-all ${
                activeSection === sec.key
                  ? 'bg-white scale-125 shadow-[0_0_8px_rgba(255,255,255,0.9)]'
                  : 'bg-white/30 group-hover:bg-white'
              }`}
            />
            <span className="absolute right-8 px-2 py-1 rounded-md bg-black/90 border border-white/15 text-[10px] font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
              {sec.label}
            </span>
          </button>
        ))}
      </div>

      {/* ========================================================
          SECTION 1 — CINEMATIC SPLIT-SCREEN LANDING HERO (TWO-PANEL)
          Left: ~52% width SupplyShield Identity
          Right: ~48% width Live Intelligence
         ======================================================== */}
      <section
        id="section-hero"
        className="relative min-h-[calc(100vh-80px)] flex items-center justify-center pt-2 sm:pt-4 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto"
      >
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* ====================================================
              LEFT PANEL — SUPPLYSHIELD IDENTITY (~52% width)
             ==================================================== */}
          <div className="lg:col-span-7 flex flex-col justify-between liquid-glass-strong rounded-3xl p-6 sm:p-10 border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.85)] relative overflow-hidden min-h-[640px]">
            {/* Soft Ambient Inner Specular Highlight */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

            {/* Top Navigation Row */}
            <div className="flex items-center justify-between pb-6 border-b border-white/[0.08] relative z-10">
              <div className="flex items-center gap-3">
                <SupplyShieldLogo size="md" showText={true} showSubtitle={true} />
              </div>

              {/* Functional Controls: Theme Toggle & Glass Pill Menu */}
              <div className="flex items-center gap-2.5">
                <ThemeToggle variant="pill" />

                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('toggle-sidebar'))}
                  className="glass-pill px-4 py-2 gap-2 text-xs font-medium text-white/90 hover:text-white cursor-pointer group"
                  aria-label="Open Navigation Menu"
                >
                  <Menu className="w-4 h-4 text-white/80 group-hover:scale-110 transition-transform" />
                  <span>Menu</span>
                </button>
              </div>
            </div>

            {/* Central Hero Body */}
            <div className="my-auto py-8 space-y-6 relative z-10">
              {/* Monochromatic Status Pill with Cyan Accent */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0FD3F2]/10 border border-[#0FD3F2]/30 text-[#0FD3F2] text-[11px] font-mono tracking-wider uppercase shadow-[0_0_12px_rgba(15,211,242,0.15)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0FD3F2] animate-pulse shadow-[0_0_8px_rgba(15,211,242,0.9)]" />
                <span>PREDICTIVE PROCUREMENT INTELLIGENCE</span>
              </div>

              {/* Hero Heading: Oversized typography with Feather Gradient accents */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-[1.08]">
                See the <span className="font-serif-italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#0FD3F2] via-[#007CB8] to-[#921CC0]">risks</span>.<br />
                Secure the <span className="font-serif-italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#921CC0] via-[#007CB8] to-[#0FD3F2]">supply</span>.
              </h1>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg text-white/70 max-w-xl leading-relaxed font-normal">
                Anticipate disruptions, uncover material shortages, and make smarter
                procurement decisions with supply-chain intelligence.
              </p>

              {/* Primary Call to Action & Capability Pills */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4">
                <button
                  onClick={() => scrollToSection('operational-command')}
                  className="inline-flex items-center justify-between gap-4 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#0FD3F2] via-[#007CB8] to-[#921CC0] text-[#06040A] font-semibold text-sm hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-[0_4px_24px_rgba(15,211,242,0.45)] group cursor-pointer"
                >
                  <span className="text-[#06040A] font-bold">Explore Command Center</span>
                  <div className="w-7 h-7 rounded-full bg-black/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-4 h-4 text-[#06040A]" />
                  </div>
                </button>

                {/* Secondary Capability Pills */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => scrollToSection('section-network')}
                    className="glass-pill px-3.5 py-1.5 text-xs text-white/85 hover:text-[#0FD3F2] hover:border-[#0FD3F2]/50 hover:shadow-[0_0_12px_rgba(15,211,242,0.25)] cursor-pointer font-medium"
                  >
                    3D Supply Network
                  </button>
                  <button
                    onClick={() => scrollToSection('section-analytics')}
                    className="glass-pill px-3.5 py-1.5 text-xs text-white/85 hover:text-[#0FD3F2] hover:border-[#0FD3F2]/50 hover:shadow-[0_0_12px_rgba(15,211,242,0.25)] cursor-pointer font-medium"
                  >
                    Predictive Risk
                  </button>
                  <button
                    onClick={() => navigate('/suppliers')}
                    className="glass-pill px-3.5 py-1.5 text-xs text-white/85 hover:text-[#0FD3F2] hover:border-[#0FD3F2]/50 hover:shadow-[0_0_12px_rgba(15,211,242,0.25)] cursor-pointer font-medium"
                  >
                    Supplier Intelligence
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Editorial Section */}
            <div className="pt-6 border-t border-white/[0.08] relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block">
                  SUPPLY CHAIN INTELLIGENCE
                </span>
                <blockquote className="text-sm sm:text-base font-serif-italic text-white/85">
                  "Resilience begins before disruption."
                </blockquote>
                <span className="text-[10px] font-mono tracking-wider text-white/40 block">
                  THE SUPPLYSHIELD VISION
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-white/50">
                <span>Facility: Detroit Alpha</span>
                <span>•</span>
                <span className="text-white">Active Sensor Grid</span>
              </div>
            </div>
          </div>

          {/* ====================================================
              RIGHT PANEL — LIVE INTELLIGENCE (~48% width)
             ==================================================== */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            
            {/* Top Floating Liquid-Glass Utility Toolbar */}
            <div className="liquid-glass px-4 py-2.5 rounded-2xl flex items-center justify-between border border-white/15 shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="text-xs font-mono font-medium text-white/80">
                  OPERATIONAL INTELLIGENCE
                </span>
              </div>

              {/* Utility Shortcut Actions */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => scrollToSection('section-network')}
                  className="p-2 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                  title="3D Supply Network Overview"
                >
                  <Network className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollToSection('section-analytics')}
                  className="p-2 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                  title="Analytics & Burn Projections"
                >
                  <Activity className="w-4 h-4" />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowRightNotifTooltip(!showRightNotifTooltip)}
                    className="p-2 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-colors relative"
                    title="Active Risk Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
                  </button>

                  {/* Micro notification popover */}
                  {showRightNotifTooltip && (
                    <div className="absolute right-0 top-10 w-64 liquid-glass-strong p-3 rounded-xl border border-white/20 shadow-2xl z-30 text-xs space-y-2 animate-in fade-in">
                      <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                        <span className="font-mono text-[10px] text-white/60">LIVE ALERTS</span>
                        <span className="font-mono text-[10px] text-white">4 Pending</span>
                      </div>
                      <p className="text-white/80 text-[11px] leading-tight">
                        STM32 MCU delivery delay (+17d). Expedited transit mitigation proposal ready.
                      </p>
                      <button
                        onClick={() => {
                          setShowRightNotifTooltip(false);
                          navigate('/recommendations');
                        }}
                        className="text-[11px] text-white underline font-medium hover:text-white/80"
                      >
                        Inspect AI Sourcing Plan →
                      </button>
                    </div>
                  )}
                </div>
                <ThemeToggle variant="icon" />
                <button
                  onClick={() => navigate('/settings')}
                  className="p-2 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                  title="Workspace Settings"
                >
                  <User className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Supply Intelligence Card */}
            <div className="liquid-glass p-5 rounded-2xl border border-white/15 shadow-[0_12px_36px_rgba(0,0,0,0.65)] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-white tracking-tight">
                    Supply Network
                  </h3>
                  <p className="text-[11px] text-white/50 font-mono">
                    Telemetry Twin • Detroit Assembly
                  </p>
                </div>
                <StatusBadge status="critical" label="ELEVATED RISK" size="sm" />
              </div>

              {/* 4 Clean Metric Blocks with Feather Palette Accents */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-black/40 border border-white/[0.08] hover:border-[#0FD3F2]/30 transition-colors">
                  <span className="text-[10px] font-mono uppercase text-white/50 block">
                    Connected Suppliers
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xl font-mono font-medium text-[#0FD3F2]">
                      {mockSuppliers.length}
                    </span>
                    <span className="text-[10px] text-white/40">Tier-1 Partners</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/[0.08] hover:border-[#007CB8]/30 transition-colors">
                  <span className="text-[10px] font-mono uppercase text-white/50 block">
                    Active Purchase Orders
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xl font-mono font-medium text-[#007CB8]">
                      {mockPurchaseOrders.filter((po) => po.status !== 'received').length}
                    </span>
                    <span className="text-[10px] text-white/40">In-Transit</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/[0.08] hover:border-[#921CC0]/30 transition-colors">
                  <span className="text-[10px] font-mono uppercase text-white/50 block">
                    Materials At Risk
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xl font-mono font-medium text-[#921CC0]">
                      {criticalMaterials.length}
                    </span>
                    <span className="text-[10px] text-white/40">Critical SKUs</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/[0.08] hover:border-[#0FD3F2]/30 transition-colors">
                  <span className="text-[10px] font-mono uppercase text-white/50 block">
                    Network Status
                  </span>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#0FD3F2] shadow-[0_0_8px_rgba(15,211,242,0.9)]" />
                    <span className="font-mono text-xs font-medium text-[#0FD3F2]">
                      AUTONOMOUS
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Feature Container: Three Feature Areas (Cards A, B, C) */}
            <div className="liquid-glass-strong p-4 sm:p-5 rounded-2xl border border-white/20 shadow-[0_16px_48px_rgba(0,0,0,0.85)] space-y-3 flex-1 flex flex-col justify-between">
              
              {/* CARD A — RISK MONITOR */}
              <div
                onClick={() => scrollToSection('section-analytics')}
                className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-[#0FD3F2]/40 hover:bg-[#0FD3F2]/[0.05] transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-[#0FD3F2]/15 border border-[#0FD3F2]/30 text-[#0FD3F2] flex-shrink-0 group-hover:scale-110 group-hover:shadow-[0_0_12px_rgba(15,211,242,0.4)] transition-all">
                      <ShieldAlert className="w-4 h-4 text-[#0FD3F2]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-white flex items-center gap-1.5 group-hover:text-[#0FD3F2] transition-colors">
                        Risk Monitor
                        <ArrowUpRight className="w-3 h-3 text-white/40 group-hover:text-[#0FD3F2] transition-colors" />
                      </h4>
                      <p className="text-[11px] text-white/60 mt-0.5 leading-snug">
                        Identify delivery delays and emerging material shortages.
                      </p>
                    </div>
                  </div>

                  {/* Mini Sparkline Chart */}
                  <div className="w-20 h-9 flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={riskSparklineData}>
                        <Line
                          type="monotone"
                          dataKey="val"
                          stroke="#0FD3F2"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* CARD B — PROCUREMENT INTELLIGENCE */}
              <div
                onClick={() => navigate('/recommendations')}
                className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-[#921CC0]/40 hover:bg-[#921CC0]/[0.05] transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#921CC0]/15 border border-[#921CC0]/30 text-[#921CC0] flex-shrink-0 group-hover:scale-110 group-hover:shadow-[0_0_12px_rgba(146,28,192,0.4)] transition-all">
                    <BrainCircuit className="w-4 h-4 text-[#921CC0]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-medium text-white flex items-center justify-between group-hover:text-[#921CC0] transition-colors">
                      <span>AI Intelligence</span>
                      <span className="text-[10px] font-mono text-[#921CC0]">3 Proposals</span>
                    </h4>
                    <p className="text-[11px] text-white/60 mt-0.5 leading-snug">
                      Turn supply-chain signals into actionable procurement insights.
                    </p>
                    <div className="mt-2 text-[10px] font-mono text-white/80 bg-black/40 px-2 py-1 rounded border border-white/10 flex items-center justify-between">
                      <span>Alps Alpine Expedited Air</span>
                      <span className="text-[#0FD3F2] font-semibold">Saves 11d</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD C — NETWORK EXPLORER */}
              <div
                onClick={() => scrollToSection('section-network')}
                className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-[#007CB8]/40 hover:bg-[#007CB8]/[0.05] transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#007CB8]/15 border border-[#007CB8]/30 text-[#007CB8] flex-shrink-0 group-hover:scale-110 group-hover:shadow-[0_0_12px_rgba(0,124,184,0.4)] transition-all">
                    <Orbit className="w-4 h-4 text-[#007CB8]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-medium text-white flex items-center justify-between group-hover:text-[#007CB8] transition-colors">
                      <span>3D Network Explorer</span>
                      <span className="text-[10px] font-mono text-[#007CB8]">Interactive</span>
                    </h4>
                    <p className="text-[11px] text-white/60 mt-0.5 leading-snug">
                      Explore supplier relationships and material flows in three dimensions.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Subtle Downward Scroll Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
          <span className="text-[10px] font-mono tracking-widest uppercase text-white/60">
            Scroll to Operational Command
          </span>
          <ArrowDown className="w-3.5 h-3.5 text-white/70 animate-bounce" />
        </div>
      </section>

      {/* ========================================================
          SECTION 2 — THREE-DIMENSIONAL SUPPLY NETWORK (FOCAL POINT)
          Full 3D WebGL Digital Twin of Supply Chain
         ======================================================== */}
      <section id="section-network" className="px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div>
            <div className="section-badge inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-palette-void/70 border border-palette-cyan/40 text-palette-cyan text-[10px] font-mono tracking-widest uppercase mb-2 shadow-glow-cyan/20 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-palette-cyan animate-pulse" />
              <span>02 // SPATIAL TOPOLOGY INTELLIGENCE</span>
            </div>
            <h2 className="section-title text-2xl sm:text-3xl font-medium text-white tracking-tight">
              Three-Dimensional Digital Supply Network
            </h2>
            <p className="section-subtitle text-xs sm:text-sm text-white/80 mt-1 font-normal">
              Directly interact with manufacturing intake nodes, tier-1 suppliers, and active transit routes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="section-badge text-xs font-mono text-palette-cyan bg-palette-void/70 px-3.5 py-1.5 rounded-full border border-palette-cyan/30 shadow-glow-cyan/15 backdrop-blur-md">
              Drag to Rotate • Click Node to Inspect
            </span>
          </div>
        </div>

        {/* Embedded Full Interactive 3D Supply Network Scene */}
        <SupplyNetworkIntelligence3D />
      </section>

      {/* ========================================================
          SECTION 3 — PREDICTIVE ANALYTICS & BURN CHARTS
          Clean Recharts Monochromatic Visualizations
         ======================================================== */}
      <section id="section-analytics" className="px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="section-badge inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-palette-void/70 border border-palette-cyan/40 text-palette-cyan text-[10px] font-mono tracking-widest uppercase shadow-glow-cyan/20 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-palette-cyan animate-pulse" />
            <span>03 // EMPIRICAL RISK EVALUATION</span>
          </div>
          <h2 className="section-title text-2xl sm:text-3xl font-medium text-white tracking-tight">
            Predictive Analytics & Burn Depletion
          </h2>
          <p className="section-subtitle text-xs sm:text-sm text-white/80 font-normal">
            Algorithmic burn-rate models comparing incoming purchase order receipts against daily assembly consumption.
          </p>
        </div>

        {/* 4 Analytics & Modern Data Visualization Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: PO Delivery Performance */}
          <ChartPanel
            title="Purchase Order Delivery Performance"
            subtitle="Monthly on-time delivery rate vs 95% SLA target baseline"
          >
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={deliveryPerformanceChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,211,242,0.08)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
                <YAxis domain={[60, 100]} stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} unit="%" />
                <Tooltip content={<CustomChartTooltip valueSuffix="%" />} />
                <Line
                  type="monotone"
                  dataKey="target"
                  name="SLA Target"
                  stroke="#007CB8"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="onTime"
                  name="On-Time Rate"
                  stroke="#0FD3F2"
                  strokeWidth={2.5}
                  dot={{ fill: '#0FD3F2', r: 4 }}
                  activeDot={{ r: 6, fill: '#0FD3F2', stroke: '#1D0445', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartPanel>

          {/* Chart 2: Supplier Risk Distribution */}
          <ChartPanel
            title="Supplier Risk Distribution"
            subtitle="Portfolio categorization across monitored vendor network"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 h-[260px]">
              <div className="w-full sm:w-1/2 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip content={<CustomChartTooltip valueSuffix="%" />} />
                    <Pie
                      data={supplierRiskDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      <Cell fill="#0FD3F2" stroke="rgba(0,0,0,0.5)" strokeWidth={1} />
                      <Cell fill="#007CB8" stroke="rgba(0,0,0,0.5)" strokeWidth={1} />
                      <Cell fill="#4C128A" stroke="rgba(0,0,0,0.5)" strokeWidth={1} />
                      <Cell fill="#921CC0" stroke="rgba(0,0,0,0.5)" strokeWidth={1} />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Feather Palette Pie Legend */}
              <div className="w-full sm:w-1/2 space-y-2.5">
                {[
                  { name: 'Low Risk', value: 45, color: '#0FD3F2' },
                  { name: 'Moderate Risk', value: 30, color: '#007CB8' },
                  { name: 'High Risk', value: 15, color: '#4C128A' },
                  { name: 'Critical Delay', value: 10, color: '#921CC0' },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                      <span className="text-white/70">{item.name}</span>
                    </div>
                    <span className="font-mono font-medium text-white">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartPanel>

          {/* Chart 3: Projected Demand vs Current Inventory Coverage */}
          <ChartPanel
            title="Projected Demand vs Coverage"
            subtitle="30-day forward simulation showing critical depletion below safety buffer"
          >
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={inventoryCoverageDemandData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="coverageGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0FD3F2" stopOpacity={0.40} />
                    <stop offset="95%" stopColor="#0FD3F2" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="safetyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#921CC0" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#921CC0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,211,242,0.08)" />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomChartTooltip valueSuffix=" units" />} />
                <Area
                  type="monotone"
                  dataKey="stock"
                  name="Projected Inventory"
                  stroke="#0FD3F2"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#coverageGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="safetyBuffer"
                  name="Safety Stock Buffer"
                  stroke="#921CC0"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  fillOpacity={1}
                  fill="url(#safetyGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartPanel>

          {/* Chart 4: Financial Shortage Exposure Trend */}
          <ChartPanel
            title="Factory Financial Exposure Trend"
            subtitle="Unhedged stoppage cost vs mitigations executed across active lines"
          >
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={shortageExposureTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,211,242,0.08)" />
                <XAxis dataKey="week" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} unit="k" />
                <Tooltip content={<CustomChartTooltip valuePrefix="$" valueSuffix="k" />} />
                <Bar dataKey="exposure" name="Exposure Liability" fill="#921CC0" radius={[4, 4, 0, 0]} />
                <Bar dataKey="mitigated" name="Mitigated Savings" fill="#0FD3F2" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>
        </div>
      </section>

      {/* ========================================================
          SECTION 4 — OPERATIONAL COMMAND CENTER
          Core KPIs, Critical Tables, Recommendations & Launchpad
         ======================================================== */}
      <section id="operational-command" className="px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto space-y-8">
        {/* Command Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="section-badge inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-palette-void/70 border border-palette-cyan/40 text-palette-cyan text-[10px] font-mono tracking-widest uppercase mb-1 shadow-glow-cyan/20 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-palette-cyan animate-pulse" />
              <span>04 // OPERATIONAL COMMAND CENTER</span>
            </div>
            <h2 className="section-title text-2xl sm:text-3xl font-medium tracking-tight text-white">
              Take Action & Direct Procurement
            </h2>
            <p className="section-subtitle text-sm text-white/80 mt-1 max-w-2xl font-normal">
              Live operational telemetry for <span className="text-palette-cyan font-medium">Detroit Assembly Plant Alpha</span>.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <NeumorphicButton
              variant="secondary"
              size="md"
              isLoading={isRefreshing}
              onClick={handleRefresh}
            >
              Refresh Telemetry
            </NeumorphicButton>

            <NeumorphicButton
              variant="primary"
              size="md"
              leftIcon={<UploadCloud className="w-4 h-4" />}
              onClick={() => navigate('/imports')}
            >
              Import Data
            </NeumorphicButton>
          </div>
        </div>

        {/* 4 Core KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <MetricCard
            title="Open Purchase Orders"
            value="7"
            icon={FileSpreadsheet}
            subtitle="Total spend: $1,270,360"
            trend={{
              value: "+2 POs",
              direction: "up",
              label: "vs last week",
              isPositive: true,
            }}
            onClick={() => navigate('/purchase-orders')}
          />

          <MetricCard
            title="At-Risk Materials"
            value="4"
            icon={AlertTriangle}
            subtitle="Impacts 3 production lines"
            trend={{
              value: "2 Critical",
              direction: "up",
              label: "coverage <7d",
              isPositive: false,
            }}
            onClick={() => navigate('/inventory-risks')}
          />

          <MetricCard
            title="Delayed Deliveries"
            value="3"
            icon={Clock}
            subtitle="Avg slippage: 14.3 days"
            trend={{
              value: "42.8%",
              direction: "up",
              label: "of active orders",
              isPositive: false,
            }}
            onClick={() => navigate('/purchase-orders')}
          />

          <MetricCard
            title="Estimated Exposure"
            value="$647,500"
            icon={DollarSign}
            subtitle="Factory stoppage liability"
            trend={{
              value: "+$157k",
              direction: "up",
              label: "unhedged delta",
              isPositive: false,
            }}
            onClick={() => navigate('/recommendations')}
          />
        </div>

        {/* AI Critical Recommendation Highlight Banner */}
        <Tilt3DCard maxTilt={3} perspective={1200} scale={1.008} glare={true} className="rounded-2xl">
          <div className="liquid-glass-strong border border-white/20 p-6 relative overflow-hidden rounded-2xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-start gap-4">
                <div className="p-3.5 rounded-2xl bg-white/10 text-white border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.15)] flex-shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/15 text-white border border-white/25">
                      CRITICAL AI MITIGATION READY
                    </span>
                    <span className="text-xs text-white/50 font-mono">Confidence: 94%</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-medium text-white">
                    STM32 Microcontroller 17-Day Delay Can Be Mitigated via Alps Alpine
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 mt-1 max-w-3xl leading-relaxed">
                    SupplyShield detected 14,000 spec-compatible units in Osaka ready for expedited transit, reducing factory stoppage exposure by{' '}
                    <strong className="text-white font-mono">$312,000</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <NeumorphicButton
                  variant="primary"
                  size="md"
                  onClick={() => navigate('/recommendations')}
                  rightIcon={<ArrowUpRight className="w-4 h-4" />}
                  className="w-full md:w-auto"
                >
                  Review Sourcing Plan
                </NeumorphicButton>
              </div>
            </div>
          </div>
        </Tilt3DCard>

        {/* Operational Tables: Critical Materials & Deliveries */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Critical Materials Table (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-medium text-white">
                  Critical Materials Requiring Immediate Action
                </h3>
                <p className="text-xs text-white/55">
                  Components below minimum buffer threshold or experiencing supplier delivery slippage
                </p>
              </div>

              <button
                onClick={() => navigate('/inventory-risks')}
                className="text-xs text-white/80 hover:text-white flex items-center gap-1 font-medium transition-colors"
              >
                <span>View All Materials</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <GlassTable
              columns={materialColumns}
              data={criticalMaterials}
              keyExtractor={(m) => m.id}
              emptyMessage="No critical materials detected."
            />
          </div>

          {/* Side Monitored Watchlist (1 Col) */}
          <div className="space-y-6">
            {/* Upcoming Monitored Deliveries */}
            <GlassPanel className="p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                <div>
                  <h4 className="font-medium text-xs text-white">Next Inbound Shipments</h4>
                  <p className="text-[10px] text-white/50">Expedited dock delivery schedule</p>
                </div>
                <button
                  onClick={() => navigate('/purchase-orders')}
                  className="text-xs text-white/80 hover:text-white transition-colors"
                >
                  View POs
                </button>
              </div>

              <div className="space-y-3">
                {upcomingDeliveries.map((po) => (
                  <div
                    key={po.id}
                    onClick={() => navigate('/purchase-orders')}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium text-xs text-white">{po.poNumber}</span>
                        <StatusBadge status={po.status} size="sm" />
                      </div>
                      <p className="text-xs text-white/60 mt-0.5 truncate max-w-[150px]">
                        {po.supplierName}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-white/50 block font-mono">
                        {po.revisedDeliveryDate}
                      </span>
                      <span className="text-xs font-mono font-medium text-white">
                        ${po.totalValue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>

            {/* High-Risk Supplier Watchlist */}
            <GlassPanel className="p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                <div>
                  <h4 className="font-medium text-xs text-white">High-Risk Suppliers</h4>
                  <p className="text-[10px] text-white/50">Active disruption watch</p>
                </div>
                <button
                  onClick={() => navigate('/suppliers')}
                  className="text-xs text-white/80 hover:text-white transition-colors"
                >
                  All 7
                </button>
              </div>

              <div className="space-y-3">
                {highestRiskSuppliers.map((sup) => (
                  <div
                    key={sup.id}
                    onClick={() => navigate('/suppliers')}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-xs text-white">{sup.name}</span>
                      <StatusBadge status={sup.riskLevel} size="sm" />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-white/60">
                      <span>OTD SLA: {sup.onTimeDeliveryRate}%</span>
                      <span className="text-[#E5A53D] font-mono">Lead Time: {sup.leadTimeDays}d</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </div>
        </div>

        {/* Quick Launchpad to all 8 specialized modules */}
        <div className="pt-8 border-t border-white/[0.08]">
          <h4 className="text-xs font-mono uppercase tracking-widest text-white/50 mb-4">
            Deep-Dive Functional Procurement Modules
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { path: '/imports', label: 'Data Imports', icon: UploadCloud },
              { path: '/purchase-orders', label: 'Purchase Orders', icon: FileSpreadsheet },
              { path: '/inventory-risks', label: 'Inventory Risks', icon: AlertTriangle },
              { path: '/suppliers', label: 'Suppliers', icon: Building2 },
              { path: '/recommendations', label: 'AI Mitigation', icon: Sparkles },
              { path: '/communications', label: 'Comms Dispatch', icon: Radio },
              { path: '/settings', label: 'Rules & Settings', icon: SlidersHorizontal },
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="p-3.5 rounded-xl liquid-glass border border-white/10 hover:border-white/25 transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
              >
                <item.icon className="w-5 h-5 mb-2 text-white/70 group-hover:scale-110 group-hover:text-white transition-all" />
                <span className="text-xs font-medium text-white/80 group-hover:text-white transition-colors leading-tight">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
