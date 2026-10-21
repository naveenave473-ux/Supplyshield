import React, { useState, useEffect, useRef } from 'react';
import {
  FileSpreadsheet,
  AlertTriangle,
  Clock,
  DollarSign,
  UploadCloud,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  Activity,
  Compass,
  ArrowDown,
  Building2,
  Radio,
  SlidersHorizontal,
  ChevronDown,
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
import { GlassCard } from '../components/common/GlassCard';
import { GlassTable, Column } from '../components/common/GlassTable';
import { ChartPanel, CustomChartTooltip } from '../components/common/ChartPanel';
import { StatusBadge } from '../components/common/StatusBadge';
import { NeumorphicButton } from '../components/common/NeumorphicButton';
import { Tilt3DCard } from '../components/common/Tilt3DCard';
import { CinematicHeroSculpture } from '../components/3d/CinematicHeroSculpture';
import { FloatingExperiencePanels } from '../components/3d/FloatingExperiencePanels';
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
  const [activeSection, setActiveSection] = useState<'intro' | 'risk' | 'network' | 'intelligence' | 'actions'>('intro');
  const [scrollProgress, setScrollProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  // Monitor natural scroll progress without hijacking
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollY / docHeight : 0;
      setScrollProgress(progress);

      // Determine active section by scroll position
      const secRisk = document.getElementById('section-risk');
      const secNet = document.getElementById('section-network');
      const secIntel = document.getElementById('section-intelligence');
      const secAction = document.getElementById('section-actions');

      const posRisk = secRisk ? secRisk.offsetTop - 300 : 800;
      const posNet = secNet ? secNet.offsetTop - 300 : 1600;
      const posIntel = secIntel ? secIntel.offsetTop - 300 : 2500;
      const posAction = secAction ? secAction.offsetTop - 300 : 3400;

      if (scrollY >= posAction) {
        setActiveSection('actions');
      } else if (scrollY >= posIntel) {
        setActiveSection('intelligence');
      } else if (scrollY >= posNet) {
        setActiveSection('network');
      } else if (scrollY >= posRisk) {
        setActiveSection('risk');
      } else {
        setActiveSection('intro');
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

  const materialColumns: Column<MaterialRisk>[] = [
    {
      key: 'sku',
      header: 'Material / SKU',
      render: (m) => (
        <div>
          <span className="font-mono font-bold text-xs text-white block">
            {m.sku}
          </span>
          <span className="text-xs text-[#BEC7D5] truncate max-w-[180px] block">
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
              <span className={isCritical ? 'text-[#921CC0] font-bold' : 'text-[#B7F000]'}>
                {m.daysOfCoverage} days
              </span>
              <span className="text-[10px] text-[#BEC7D5]/70">Burn: {m.dailyBurnRate}/d</span>
            </div>
            <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isCritical
                    ? 'bg-[#921CC0] shadow-[0_0_8px_rgba(146,28,192,0.8)]'
                    : 'bg-[#B7F000] shadow-[0_0_8px_rgba(183,240,0,0.6)]'
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
          <span className="text-[#BEC7D5]/70">/ {m.minRequiredStock.toLocaleString()} {m.unit}</span>
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
        <span className="text-xs text-[#BEC7D5] truncate max-w-[140px] block">
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
          variant="raised"
          size="sm"
          onClick={() => navigate('/recommendations')}
          className="text-xs text-[#0FD3F2] hover:text-white"
        >
          Resolve
        </NeumorphicButton>
      ),
    },
  ];

  return (
    <div key={refreshKey} ref={containerRef} className="relative w-full overflow-hidden space-y-24 pb-20">
      {/* ========================================================
          VERTICAL FLOATING SECTION PROGRESS NAVIGATOR (Right Edge)
         ======================================================== */}
      <div className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-3 p-2 rounded-2xl glass-panel bg-[#1D0445]/85 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        {[
          { id: 'section-intro', label: '01 Hero', key: 'intro' },
          { id: 'section-risk', label: '02 Risk', key: 'risk' },
          { id: 'section-network', label: '03 Network', key: 'network' },
          { id: 'section-intelligence', label: '04 Intel', key: 'intelligence' },
          { id: 'section-actions', label: '05 Action', key: 'actions' },
        ].map((sec) => (
          <button
            key={sec.id}
            onClick={() => scrollToSection(sec.id)}
            className={`group relative flex items-center justify-end p-2 rounded-xl transition-all ${
              activeSection === sec.key
                ? 'bg-gradient-to-r from-[#0FD3F2]/30 to-[#921CC0]/30 text-white'
                : 'text-[#CBD5E1]/60 hover:text-white hover:bg-white/[0.05]'
            }`}
            title={sec.label}
          >
            <span
              className={`w-2 h-2 rounded-full transition-all ${
                activeSection === sec.key
                  ? 'bg-[#0FD3F2] scale-125 shadow-[0_0_8px_rgba(15,211,242,0.9)]'
                  : 'bg-white/30 group-hover:bg-white'
              }`}
            />
            {/* Tooltip on hover */}
            <span className="absolute right-8 px-2 py-1 rounded-md bg-[#1D0445] border border-white/10 text-[10px] font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
              {sec.label}
            </span>
          </button>
        ))}
      </div>

      {/* ========================================================
          SECTION 1 — DRAMATIC HERO COMPOSITION
          Midnight background, Signature 3D Centerpiece, Overlapping Panels
         ======================================================== */}
      <section
        id="section-intro"
        className="relative min-h-[calc(100vh-80px)] flex items-center justify-center pt-4 sm:pt-8 px-4 sm:px-8 max-w-[1560px] mx-auto"
      >
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
          {/* Left Column (5 Cols): Oversized Typography & CTAs */}
          <div className="lg:col-span-5 space-y-6 relative z-20">
            {/* Ambient Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#0FD3F2]/15 via-[#921CC0]/15 to-[#007CB8]/10 border border-[#0FD3F2]/40 shadow-[0_0_20px_rgba(15,211,242,0.25)]">
              <Sparkles className="w-3.5 h-3.5 text-[#0FD3F2] animate-pulse" />
              <span className="text-[11px] font-tech font-extrabold tracking-widest text-white uppercase">
                Predictive AI Procurement Engine
              </span>
            </div>

            {/* Oversized Cinematic Headline with Syne Display Typography */}
            <h1 className="text-4xl sm:text-5xl xl:text-6xl 2xl:text-7xl font-display font-black tracking-tight text-white leading-[1.04]">
              See Supply Risks{' '}
              <span className="bg-gradient-to-r from-[#0FD3F2] via-[#007CB8] to-[#921CC0] bg-clip-text text-transparent text-glow-cyan">
                Before They Stop
              </span>{' '}
              Production.
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-[#E2E8F0] max-w-xl leading-relaxed font-sans font-medium">
              Predict supplier delays, identify material shortages, and discover smarter
              procurement decisions in one intelligent workspace.
            </p>

            {/* Primary & Secondary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => scrollToSection('section-actions')}
                className="px-6 py-3.5 rounded-2xl font-extrabold text-sm text-[#1D0445] bg-gradient-to-r from-[#0FD3F2] to-[#007CB8] hover:from-[#0FD3F2] hover:to-[#921CC0] shadow-[0_0_25px_rgba(15,211,242,0.45)] hover:shadow-[0_0_35px_rgba(15,211,242,0.7)] transition-all flex items-center gap-2.5 active:scale-95 group"
              >
                <span>Explore Dashboard</span>
                <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </button>

              <button
                onClick={() => scrollToSection('section-network')}
                className="px-6 py-3.5 rounded-2xl font-bold text-sm text-white bg-white/[0.04] hover:bg-white/[0.09] border border-white/15 hover:border-[#0FD3F2]/50 shadow-md backdrop-blur-lg transition-all flex items-center gap-2.5 neu-raised"
              >
                <Compass className="w-4 h-4 text-[#0FD3F2]" />
                <span>Explore Supply Network</span>
              </button>
            </div>

            {/* Live Facility Telemetry Ticker */}
            <div className="pt-6 border-t border-white/[0.08] flex items-center gap-6 text-xs text-[#CBD5E1]">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#CBD5E1]/70 block font-mono">
                  Primary Node
                </span>
                <span className="font-bold text-white">Detroit Alpha Plant</span>
              </div>
              <div className="border-l border-white/10 pl-6">
                <span className="text-[10px] uppercase tracking-wider text-[#CBD5E1]/70 block font-mono">
                  Line Uptime
                </span>
                <span className="font-bold text-[#0FD3F2] font-mono">99.4% Active</span>
              </div>
              <div className="border-l border-white/10 pl-6">
                <span className="text-[10px] uppercase tracking-wider text-[#CBD5E1]/70 block font-mono">
                  Exposure Monitored
                </span>
                <span className="font-bold text-[#921CC0] font-mono">$647.5k</span>
              </div>
            </div>
          </div>

          {/* Right Column (7 Cols): Signature 3D Sculpture & Floating Panels */}
          <div className="lg:col-span-7 relative w-full h-[620px] lg:h-[760px] flex items-center justify-center">
            {/* Signature 3D Centerpiece Sculpture */}
            <CinematicHeroSculpture
              scrollProgress={scrollProgress}
              onNodeSelect={() => {
                scrollToSection('section-network');
              }}
              className="w-full h-full"
            />

            {/* Three Layered Floating Glass Panels (Panels A, B, C) */}
            <FloatingExperiencePanels
              onExploreDashboard={() => scrollToSection('section-actions')}
              className="absolute inset-0"
            />
          </div>
        </div>

        {/* Scroll Indicator Prompt */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity">
          <span className="text-[10px] font-mono tracking-widest uppercase text-[#0FD3F2]">
            Scroll to Explore Story
          </span>
          <ArrowDown className="w-4 h-4 text-[#0FD3F2] animate-bounce" />
        </div>
      </section>

      {/* ========================================================
          SECTION 2 — UNDERSTAND THE RISK
          Supplier Delays, Lead Time Variances, Stoppage Liability
         ======================================================== */}
      <section id="section-risk" className="px-4 sm:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#921CC0]/15 border border-[#921CC0]/35 text-[#921CC0] text-[10px] font-mono font-bold tracking-widest uppercase">
            <span>02 // EARLY DETECTION MATRIX</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">
            Understand The Risk Before Lines Halt
          </h2>
          <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed font-sans font-medium">
            Supply disruptions rarely originate at final assembly. SupplyShield monitors Tier-1 and
            Tier-2 sub-suppliers to calculate compounding delays days before raw shortages hit factory docks.
          </p>
        </div>

        {/* 3 Translucent Risk Intelligence Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Tilt3DCard maxTilt={5} perspective={1200} glare={true} className="rounded-2xl hud-bracket">
            <GlassCard className="p-6 h-full flex flex-col justify-between border-t-2 border-t-[#921CC0] bg-[#1D0445]/90">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-[#921CC0]/15 text-[#921CC0] border border-[#921CC0]/30">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#921CC0] bg-[#921CC0]/20 px-2 py-0.5 rounded-full border border-[#921CC0]/40">
                    +17.4d Slippage
                  </span>
                </div>
                <h3 className="text-lg font-display font-bold text-white mb-2">Shenzhen Port Bottleneck</h3>
                <p className="text-xs text-[#CBD5E1] leading-relaxed font-sans">
                  Customs audits in Yantian port are delaying 6,000 STM32 microcontrollers designated for
                  Chassis Control Module ECU-294. Buffer will be depleted in 4.2 days.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-tech">
                <span className="text-[#CBD5E1]">Line 4 Stoppage Risk:</span>
                <span className="font-mono font-bold text-[#921CC0]">High (92%)</span>
              </div>
            </GlassCard>
          </Tilt3DCard>

          <Tilt3DCard maxTilt={5} perspective={1200} glare={true} className="rounded-2xl hud-bracket">
            <GlassCard className="p-6 h-full flex flex-col justify-between border-t-2 border-t-[#0FD3F2] bg-[#1D0445]/90">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-[#0FD3F2]/15 text-[#0FD3F2] border border-[#0FD3F2]/30">
                    <Activity className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#0FD3F2] bg-[#0FD3F2]/20 px-2 py-0.5 rounded-full border border-[#0FD3F2]/40">
                    Tooling Churn
                  </span>
                </div>
                <h3 className="text-lg font-display font-bold text-white mb-2">Monterrey Tooling Delay</h3>
                <p className="text-xs text-[#CBD5E1] leading-relaxed font-sans">
                  Apex Precision Castings reports casting mold maintenance slippage. Structural aluminum
                  housings delayed by 14 days, impacting Battery Tray sub-assemblies.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-tech">
                <span className="text-[#CBD5E1]">Line 2 Buffer:</span>
                <span className="font-mono font-bold text-[#0FD3F2]">6.1 Days Left</span>
              </div>
            </GlassCard>
          </Tilt3DCard>

          <Tilt3DCard maxTilt={5} perspective={1200} glare={true} className="rounded-2xl hud-bracket">
            <GlassCard className="p-6 h-full flex flex-col justify-between border-t-2 border-t-[#007CB8] bg-[#1D0445]/90">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-[#007CB8]/15 text-[#0FD3F2] border border-[#007CB8]/30">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#0FD3F2] bg-[#007CB8]/20 px-2 py-0.5 rounded-full border border-[#007CB8]/40">
                    $647,500 Risk
                  </span>
                </div>
                <h3 className="text-lg font-display font-bold text-white mb-2">Factory Stoppage Exposure</h3>
                <p className="text-xs text-[#CBD5E1] leading-relaxed font-sans">
                  Unmitigated shortages pose a calculated $42,000/hr idle factory liability. Autonomous
                  sourcing models propose air freight switch to recover 12 lost days.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-tech">
                <span className="text-[#CBD5E1]">Potential Recovery:</span>
                <span className="font-mono font-bold text-[#0FD3F2]">$312,000 Saved</span>
              </div>
            </GlassCard>
          </Tilt3DCard>
        </div>
      </section>

      {/* ========================================================
          SECTION 3 — EXPLORE THE NETWORK
          Interactive 3D Supply Network with Tiers & Telemetry
         ======================================================== */}
      <section id="section-network" className="px-4 sm:px-8 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0FD3F2]/15 border border-[#0FD3F2]/35 text-[#0FD3F2] text-[10px] font-mono font-bold tracking-widest uppercase mb-2">
              <span>03 // TOPOLOGY INTELLIGENCE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
              Explore The 3D Supplier Network
            </h2>
            <p className="text-xs sm:text-sm text-[#CBD5E1] mt-1 font-sans font-medium">
              Interact directly with Detroit Plant Alpha's tier nodes, transit splines, and live dock receipts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-semibold text-[#CBD5E1] bg-white/[0.05] px-3 py-1.5 rounded-full border border-white/10">
              Drag to Rotate • Click Node to Inspect
            </span>
          </div>
        </div>

        {/* Embedded Full Interactive 3D Supply Network Scene */}
        <SupplyNetworkIntelligence3D />
      </section>

      {/* ========================================================
          SECTION 4 — SEE THE INTELLIGENCE
          Empirical Charts, Burn-Rate Sim, Depletion Projections
         ======================================================== */}
      <section id="section-intelligence" className="px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0FD3F2]/15 border border-[#0FD3F2]/35 text-[#0FD3F2] text-[10px] font-mono font-bold tracking-widest uppercase">
            <span>04 // PREDICTIVE ANALYTICS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
            See How Risks Are Evaluated
          </h2>
          <p className="text-xs sm:text-sm text-[#CBD5E1] font-sans font-medium">
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
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#7E8C9F" fontSize={11} tickLine={false} />
                <YAxis domain={[60, 100]} stroke="#7E8C9F" fontSize={11} tickLine={false} unit="%" />
                <Tooltip content={<CustomChartTooltip valueSuffix="%" />} />
                <Line
                  type="monotone"
                  dataKey="target"
                  name="SLA Target"
                  stroke="#CBD5E1"
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
                  activeDot={{ r: 6, fill: '#0FD3F2', stroke: '#FFFFFF', strokeWidth: 2 }}
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
                      {supplierRiskDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.4)" strokeWidth={1} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Custom Pie Legend */}
              <div className="w-full sm:w-1/2 space-y-2.5">
                {supplierRiskDistributionData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-[#CBD5E1]">{item.name}</span>
                    </div>
                    <span className="font-mono font-bold text-white">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartPanel>

          {/* Chart 3: Projected Demand vs Current Inventory Coverage */}
          <ChartPanel
            title="Projected Demand vs Stock Coverage"
            subtitle="30-day forward simulation showing critical depletion below safety buffer"
          >
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={inventoryCoverageDemandData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="coverageGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0FD3F2" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0FD3F2" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="safetyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#921CC0" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#921CC0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="#7E8C9F" fontSize={11} tickLine={false} />
                <YAxis stroke="#7E8C9F" fontSize={11} tickLine={false} />
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
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="week" stroke="#7E8C9F" fontSize={11} tickLine={false} />
                <YAxis stroke="#7E8C9F" fontSize={11} tickLine={false} unit="k" />
                <Tooltip content={<CustomChartTooltip valuePrefix="$" valueSuffix="k" />} />
                <Bar dataKey="exposure" name="Exposure Liability" fill="#921CC0" radius={[4, 4, 0, 0]} />
                <Bar dataKey="mitigated" name="Mitigated Savings" fill="#007CB8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>
        </div>
      </section>

      {/* ========================================================
          SECTION 5 — TAKE ACTION (OPERATIONAL COMMAND CENTER)
          Full Dashboard, KPIs, Critical Materials Table, Recommendations
         ======================================================== */}
      <section id="section-actions" className="px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
        {/* Command Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0FD3F2]/15 border border-[#0FD3F2]/35 text-[#0FD3F2] text-[10px] font-mono font-bold tracking-widest uppercase mb-1">
              <span>05 // OPERATIONAL COMMAND</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-white">
              Take Action & Direct Procurement
            </h2>
            <p className="text-sm text-[#CBD5E1] mt-1 max-w-2xl font-sans font-medium">
              Live operational telemetry for <span className="text-white font-bold">Detroit Assembly Plant Alpha</span>.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <NeumorphicButton
              variant="raised"
              size="md"
              isLoading={isRefreshing}
              onClick={handleRefresh}
            >
              Refresh Data
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
            accentColor="cyan"
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
            accentColor="magenta"
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
            accentColor="amber"
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
            accentColor="lime"
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
        <Tilt3DCard maxTilt={3.5} perspective={1200} scale={1.008} glare={true} className="rounded-2xl">
          <GlassCard className="border border-[#921CC0]/40 bg-gradient-to-r from-[#1D0445]/90 via-[#171665]/90 to-[#4C128A]/90 p-6 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-start gap-4">
                <div className="p-3.5 rounded-2xl bg-[#921CC0]/15 text-[#921CC0] border border-[#921CC0]/35 shadow-[0_0_20px_rgba(146,28,192,0.35)] flex-shrink-0">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#921CC0]/20 text-[#921CC0] border border-[#921CC0]/35">
                      CRITICAL AI MITIGATION READY
                    </span>
                    <span className="text-xs text-[#CBD5E1]">Confidence: 94%</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    STM32 Microcontroller 17-Day Delay Can Be Mitigated via Alps Alpine
                  </h3>
                  <p className="text-xs sm:text-sm text-[#CBD5E1] mt-1 max-w-3xl leading-relaxed">
                    SupplyShield detected 14,000 spec-compatible units in Osaka ready for expedited transit, reducing factory stoppage exposure by{' '}
                    <strong className="text-[#0FD3F2]">$312,000</strong>.
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
          </GlassCard>
        </Tilt3DCard>

        {/* Operational Tables: Critical Materials & Deliveries */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Critical Materials Table (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Critical Materials Requiring Immediate Action
                </h3>
                <p className="text-xs text-[#CBD5E1]">
                  Components below minimum buffer threshold or experiencing supplier delivery slippage
                </p>
              </div>

              <button
                onClick={() => navigate('/inventory-risks')}
                className="text-xs text-[#0FD3F2] hover:text-white flex items-center gap-1 font-medium transition-colors"
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
                  <h4 className="font-bold text-xs text-white">Next Inbound Shipments</h4>
                  <p className="text-[10px] text-[#CBD5E1]">Expedited dock delivery schedule</p>
                </div>
                <button
                  onClick={() => navigate('/purchase-orders')}
                  className="text-xs text-[#0FD3F2] hover:text-white transition-colors"
                >
                  View POs
                </button>
              </div>

              <div className="space-y-3">
                {upcomingDeliveries.map((po) => (
                  <div
                    key={po.id}
                    onClick={() => navigate('/purchase-orders')}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-white">{po.poNumber}</span>
                        <StatusBadge status={po.status} size="sm" />
                      </div>
                      <p className="text-xs text-[#CBD5E1] mt-0.5 truncate max-w-[150px]">
                        {po.supplierName}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-[#CBD5E1]/70 block font-mono">
                        {po.revisedDeliveryDate}
                      </span>
                      <span className="text-xs font-mono font-bold text-white">
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
                  <h4 className="font-bold text-xs text-white">High-Risk Suppliers</h4>
                  <p className="text-[10px] text-[#CBD5E1]">Active disruption watch</p>
                </div>
                <button
                  onClick={() => navigate('/suppliers')}
                  className="text-xs text-[#0FD3F2] hover:text-white transition-colors"
                >
                  All 7
                </button>
              </div>

              <div className="space-y-3">
                {highestRiskSuppliers.map((sup) => (
                  <div
                    key={sup.id}
                    onClick={() => navigate('/suppliers')}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-white">{sup.name}</span>
                      <StatusBadge status={sup.riskLevel} size="sm" />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#CBD5E1]">
                      <span>OTD SLA: {sup.onTimeDeliveryRate}%</span>
                      <span className="text-[#921CC0] font-mono">Lead Time: {sup.leadTimeDays}d</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </div>
        </div>

        {/* Quick Launchpad to all 8 specialized modules */}
        <div className="pt-8 border-t border-white/[0.08]">
          <h4 className="text-xs font-mono uppercase tracking-widest text-[#CBD5E1]/70 mb-4">
            Deep-Dive Functional Procurement Modules
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { path: '/imports', label: 'Data Imports', icon: UploadCloud, color: 'text-[#0FD3F2]' },
              { path: '/purchase-orders', label: 'Purchase Orders', icon: FileSpreadsheet, color: 'text-[#007CB8]' },
              { path: '/inventory-risks', label: 'Inventory Risks', icon: AlertTriangle, color: 'text-[#921CC0]' },
              { path: '/suppliers', label: 'Suppliers', icon: Building2, color: 'text-[#082495]' },
              { path: '/recommendations', label: 'AI Mitigation', icon: Sparkles, color: 'text-[#0FD3F2]' },
              { path: '/communications', label: 'Comms Dispatch', icon: Radio, color: 'text-[#4C128A]' },
              { path: '/settings', label: 'Rules & Settings', icon: SlidersHorizontal, color: 'text-[#CBD5E1]' },
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="p-3 rounded-xl glass-card border border-white/10 hover:border-white/25 transition-all flex flex-col items-center justify-center text-center group neu-raised"
              >
                <item.icon className={`w-5 h-5 mb-1.5 ${item.color} group-hover:scale-110 transition-transform`} />
                <span className="text-xs font-bold text-white group-hover:text-[#0FD3F2] transition-colors leading-tight">
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
