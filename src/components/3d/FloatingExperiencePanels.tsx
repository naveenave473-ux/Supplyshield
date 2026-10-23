import React, { useState } from 'react';
import {
  ShieldAlert,
  Clock,
  Layers,
  Sparkles,
  TrendingDown,
  CheckCircle2,
  Radio,
  Boxes,
  Cpu,
  Car,
  Plane,
  ChevronRight,
} from 'lucide-react';

interface FloatingExperiencePanelsProps {
  onSelectStyle?: (style: string) => void;
  onExploreDashboard?: () => void;
  className?: string;
}

export const FloatingExperiencePanels: React.FC<FloatingExperiencePanelsProps> = ({
  onSelectStyle,
  onExploreDashboard,
  className = '',
}) => {
  const [activeStyle, setActiveStyle] = useState<'automotive' | 'battery' | 'avionics'>('automotive');
  const [rerouted, setRerouted] = useState(false);

  const handleStyleClick = (style: 'automotive' | 'battery' | 'avionics') => {
    setActiveStyle(style);
    if (onSelectStyle) onSelectStyle(style);
  };

  return (
    <div className={`relative pointer-events-none ${className}`} style={{ perspective: '1600px' }}>
      {/* PANEL A: SUPPLY STYLES */}
      <div
        className="pointer-events-auto absolute -top-4 right-0 lg:-right-4 w-[290px] sm:w-[320px] transition-transform duration-500 ease-out hover:scale-105 group"
        style={{
          transform: 'translateZ(50px) rotateY(-7deg) rotateX(3deg)',
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="rounded-2xl liquid-glass-strong border border-white/15 p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3 border-b border-white/[0.08] pb-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-white/[0.08] text-white border border-white/10">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs font-semibold text-white tracking-wide uppercase">
                Panel A — Supply Styles
              </h4>
            </div>
            <span className="text-[10px] font-mono text-white/80 bg-white/[0.08] px-2 py-0.5 rounded-full border border-white/15 flex items-center gap-1">
              <Radio className="w-2.5 h-2.5 animate-pulse text-white" />
              Live Feed
            </span>
          </div>

          <p className="text-[11px] text-white/60 mb-3 leading-relaxed">
            Multi-tier supply topology models for active factory clusters:
          </p>

          {/* Interactive Topology Selection Tiles */}
          <div className="space-y-2">
            <button
              onClick={() => handleStyleClick('automotive')}
              className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                activeStyle === 'automotive'
                  ? 'bg-white text-black font-semibold shadow-sm border-white'
                  : 'bg-white/[0.03] border-white/10 hover:border-white/20 text-white/70'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Car className="w-4 h-4" />
                <div>
                  <p className="text-xs font-semibold leading-tight">Automotive EV Powertrain</p>
                  <p className="text-[10px] opacity-75">7 Monitored Suppliers • Tier 1 & 2</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold">Active</span>
            </button>

            <button
              onClick={() => handleStyleClick('battery')}
              className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                activeStyle === 'battery'
                  ? 'bg-white text-black font-semibold shadow-sm border-white'
                  : 'bg-white/[0.03] border-white/10 hover:border-white/20 text-white/70'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Boxes className="w-4 h-4" />
                <div>
                  <p className="text-xs font-semibold leading-tight">Battery Cell Logistics</p>
                  <p className="text-[10px] opacity-75">4 Monitored Suppliers • Critical</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-risk-critical">Alert</span>
            </button>

            <button
              onClick={() => handleStyleClick('avionics')}
              className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                activeStyle === 'avionics'
                  ? 'bg-white text-black font-semibold shadow-sm border-white'
                  : 'bg-white/[0.03] border-white/10 hover:border-white/20 text-white/70'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Plane className="w-4 h-4" />
                <div>
                  <p className="text-xs font-semibold leading-tight">Aerospace Avionics Rig</p>
                  <p className="text-[10px] opacity-75">5 Monitored Suppliers • Nominal</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-risk-low">Nominal</span>
            </button>
          </div>
        </div>
      </div>

      {/* PANEL B: RISK INTELLIGENCE */}
      <div
        className="pointer-events-auto absolute top-44 left-0 lg:-left-6 w-[300px] sm:w-[330px] transition-transform duration-500 ease-out hover:scale-105"
        style={{
          transform: 'translateZ(85px) rotateY(6deg) rotateX(-2deg)',
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="rounded-2xl liquid-glass-strong border border-white/15 p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3 border-b border-white/[0.08] pb-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-risk-critical/15 text-risk-critical border border-risk-critical/30">
                <ShieldAlert className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs font-semibold text-white tracking-wide uppercase">
                Panel B — Risk Intelligence
              </h4>
            </div>
            <span className="text-[10px] font-mono font-bold text-risk-critical bg-risk-critical/10 px-2 py-0.5 rounded-full border border-risk-critical/30 animate-pulse">
              Shortage Signal
            </span>
          </div>

          {/* Supplier Delay Indicator */}
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 mb-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-risk-critical" />
                Foxconn Port Backlog
              </span>
              <span className="font-mono font-bold text-risk-critical">+17.4 Days</span>
            </div>
            <p className="text-[10px] text-white/60 mt-1">
              Shenzhen customs inspection backlog blocking STM32 shipments.
            </p>
          </div>

          {/* Inventory Coverage Visualization */}
          <div className="space-y-1.5 mb-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-white/60">Inventory Coverage:</span>
              <span className="text-risk-critical font-bold">4.2 Days (Buffer: 14d)</span>
            </div>
            <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden border border-white/10 relative">
              <div
                className="h-full bg-risk-critical rounded-full animate-pulse"
                style={{ width: '30%' }}
              />
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white z-10"
                style={{ left: '70%' }}
                title="Target Buffer 14d"
              />
            </div>
          </div>

          {/* Minimal Sparkline */}
          <div className="pt-2 border-t border-white/[0.08]">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-white/60">30-Day Depletion Vector</span>
              <span className="text-[10px] font-mono text-white/80 flex items-center gap-1">
                <TrendingDown className="w-3 h-3 text-risk-critical" />
                Burn: 450 u/day
              </span>
            </div>
            <svg className="w-full h-8 overflow-visible" viewBox="0 0 280 32">
              <path
                d="M0,10 Q50,8 100,16 T200,26 T280,30"
                fill="none"
                stroke="#FF6B6B"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
              <circle cx="100" cy="16" r="3" fill="#FFFFFF" />
              <circle cx="280" cy="30" r="3.5" fill="#FF6B6B" className="animate-ping" />
            </svg>
          </div>
        </div>
      </div>

      {/* PANEL C: PROCUREMENT ACTION */}
      <div
        className="pointer-events-auto absolute bottom-4 right-0 lg:right-2 w-[310px] sm:w-[340px] transition-transform duration-500 ease-out hover:scale-105"
        style={{
          transform: 'translateZ(65px) rotateY(-5deg) rotateX(-2deg)',
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="rounded-2xl liquid-glass-strong border border-white/15 p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3 border-b border-white/[0.08] pb-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-white/[0.08] text-white border border-white/10">
                <Cpu className="w-3.5 h-3.5 text-white/90" />
              </div>
              <h4 className="text-xs font-semibold text-white tracking-wide uppercase">
                Panel C — Procurement Action
              </h4>
            </div>
            <span className="text-[10px] font-mono text-white/70 bg-white/[0.06] px-2 py-0.5 rounded-md border border-white/10">
              PO-2024-8841
            </span>
          </div>

          <div className="space-y-2 mb-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-white/60">Order Status:</span>
              <span className="font-mono font-medium text-white bg-white/[0.06] px-2 py-0.5 rounded border border-white/10 text-[10px]">
                Expedited Air Freight
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-white/60">Material Availability:</span>
              <span className="font-mono font-medium text-white">14,000 u in Osaka</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-white/60">Recommended Alt:</span>
              <span className="text-risk-low font-medium">Alps Alpine (99.8% Match)</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => setRerouted(true)}
            disabled={rerouted}
            className={`w-full py-2.5 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
              rerouted
                ? 'bg-white/[0.08] text-white border border-white/20'
                : 'bg-white hover:bg-white/90 text-black font-semibold shadow-lg'
            }`}
          >
            {rerouted ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-risk-low" />
                <span>Reroute Dispatched via Alps</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Authorize Autonomous Mitigation</span>
              </>
            )}
          </button>

          {onExploreDashboard && (
            <button
              onClick={onExploreDashboard}
              className="w-full mt-2 text-[10px] text-white/60 hover:text-white flex items-center justify-center gap-1 transition-colors"
            >
              <span>Jump to Command Center</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
