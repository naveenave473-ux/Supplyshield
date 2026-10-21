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
      {/* ========================================================
          PANEL A: SUPPLY STYLES (Top Right Depth Layer)
          z-index: 20, translateZ: 50px, subtle tilt
         ======================================================== */}
      <div
        className="pointer-events-auto absolute -top-4 right-0 lg:-right-4 w-[290px] sm:w-[320px] transition-transform duration-500 ease-out hover:scale-105 group"
        style={{
          transform: 'translateZ(50px) rotateY(-7deg) rotateX(3deg)',
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="rounded-2xl glass-panel bg-[#1D0445]/90 border border-[#0FD3F2]/35 p-4 shadow-[0_20px_40px_rgba(0,0,0,0.65),0_0_20px_rgba(15,211,242,0.2)] backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3 border-b border-white/[0.08] pb-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#0FD3F2]/15 text-[#0FD3F2] border border-[#0FD3F2]/30">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs font-extrabold text-white tracking-wide uppercase font-tech">
                Panel A — Supply Styles
              </h4>
            </div>
            <span className="text-[10px] font-mono text-[#0FD3F2] bg-[#0FD3F2]/10 px-2 py-0.5 rounded-full border border-[#0FD3F2]/30 flex items-center gap-1">
              <Radio className="w-2.5 h-2.5 animate-pulse text-[#0FD3F2]" />
              Live Feed
            </span>
          </div>

          <p className="text-[11px] text-[#CBD5E1] mb-3 leading-relaxed">
            Multi-tier supply topology models for active factory clusters:
          </p>

          {/* Interactive Topology Selection Tiles */}
          <div className="space-y-2">
            <button
              onClick={() => handleStyleClick('automotive')}
              className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                activeStyle === 'automotive'
                  ? 'bg-gradient-to-r from-[#0FD3F2]/20 to-[#171665] border-[#0FD3F2]/60 shadow-[0_0_15px_rgba(15,211,242,0.25)] text-white'
                  : 'bg-white/[0.03] border-white/10 hover:border-white/20 text-[#CBD5E1]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Car className="w-4 h-4 text-[#0FD3F2]" />
                <div>
                  <p className="text-xs font-bold leading-tight">Automotive EV Powertrain</p>
                  <p className="text-[10px] text-[#CBD5E1]/70">7 Monitored Suppliers • Tier 1 & 2</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#0FD3F2]">Active</span>
            </button>

            <button
              onClick={() => handleStyleClick('battery')}
              className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                activeStyle === 'battery'
                  ? 'bg-gradient-to-r from-[#921CC0]/25 to-[#171665] border-[#921CC0]/60 shadow-[0_0_15px_rgba(146,28,192,0.3)] text-white'
                  : 'bg-white/[0.03] border-white/10 hover:border-white/20 text-[#CBD5E1]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Boxes className="w-4 h-4 text-[#921CC0]" />
                <div>
                  <p className="text-xs font-bold leading-tight">Battery Cell Logistics</p>
                  <p className="text-[10px] text-[#CBD5E1]/70">4 Monitored Suppliers • Critical</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#921CC0]">Alert</span>
            </button>

            <button
              onClick={() => handleStyleClick('avionics')}
              className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                activeStyle === 'avionics'
                  ? 'bg-gradient-to-r from-[#007CB8]/25 to-[#171665] border-[#007CB8]/60 shadow-[0_0_15px_rgba(0,124,184,0.25)] text-white'
                  : 'bg-white/[0.03] border-white/10 hover:border-white/20 text-[#CBD5E1]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Plane className="w-4 h-4 text-[#007CB8]" />
                <div>
                  <p className="text-xs font-bold leading-tight">Aerospace Avionics Rig</p>
                  <p className="text-[10px] text-[#CBD5E1]/70">5 Monitored Suppliers • Nominal</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-[#007CB8]">Standby</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          PANEL B: RISK INTELLIGENCE (Left Depth Layer)
          z-index: 25, translateZ: 85px, floating bob animation
         ======================================================== */}
      <div
        className="pointer-events-auto absolute top-44 left-0 lg:-left-6 w-[300px] sm:w-[330px] transition-transform duration-500 ease-out hover:scale-105"
        style={{
          transform: 'translateZ(85px) rotateY(6deg) rotateX(-2deg)',
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="rounded-2xl glass-panel bg-[#1D0445]/95 border border-[#921CC0]/45 p-4 shadow-[0_25px_50px_rgba(0,0,0,0.7),0_0_25px_rgba(146,28,192,0.25)] backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3 border-b border-white/[0.08] pb-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#921CC0]/20 text-[#921CC0] border border-[#921CC0]/40 shadow-[0_0_10px_rgba(146,28,192,0.4)]">
                <ShieldAlert className="w-3.5 h-3.5 text-[#921CC0]" />
              </div>
              <h4 className="text-xs font-extrabold text-white tracking-wide uppercase font-tech">
                Panel B — Risk Intelligence
              </h4>
            </div>
            <span className="text-[10px] font-mono font-bold text-[#921CC0] bg-[#921CC0]/20 px-2 py-0.5 rounded-full border border-[#921CC0]/40 animate-pulse">
              Shortage Signal
            </span>
          </div>

          {/* Supplier Delay Indicator */}
          <div className="p-2.5 rounded-xl bg-[#4C128A]/30 border border-[#921CC0]/40 mb-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#921CC0]" />
                Foxconn Port Backlog
              </span>
              <span className="font-mono font-bold text-[#921CC0]">+17.4 Days</span>
            </div>
            <p className="text-[10px] text-[#CBD5E1] mt-1">
              Shenzhen customs inspection backlog blocking STM32 shipments.
            </p>
          </div>

          {/* Inventory Coverage Visualization */}
          <div className="space-y-1.5 mb-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#CBD5E1]">Inventory Coverage:</span>
              <span className="text-[#921CC0] font-bold">4.2 Days (Buffer: 14d)</span>
            </div>
            <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden border border-white/10 relative">
              <div
                className="h-full bg-gradient-to-r from-[#4C128A] to-[#921CC0] rounded-full shadow-[0_0_12px_rgba(146,28,192,0.8)] animate-pulse"
                style={{ width: '30%' }}
              />
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-[#0FD3F2] z-10"
                style={{ left: '70%' }}
                title="Target Buffer 14d"
              />
            </div>
          </div>

          {/* Minimal Animated Risk Chart / Sparkline */}
          <div className="pt-2 border-t border-white/[0.08]">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-[#CBD5E1]">30-Day Depletion Vector</span>
              <span className="text-[10px] font-mono text-[#0FD3F2] flex items-center gap-1">
                <TrendingDown className="w-3 h-3 text-[#921CC0]" />
                Burn: 450 u/day
              </span>
            </div>
            <svg className="w-full h-8 overflow-visible" viewBox="0 0 280 32">
              <path
                d="M0,10 Q50,8 100,16 T200,26 T280,30"
                fill="none"
                stroke="#921CC0"
                strokeWidth="2.5"
                strokeDasharray="4 2"
              />
              <circle cx="100" cy="16" r="3.5" fill="#0FD3F2" />
              <circle cx="280" cy="30" r="4" fill="#921CC0" className="animate-ping" />
            </svg>
          </div>
        </div>
      </div>

      {/* ========================================================
          PANEL C: PROCUREMENT ACTION (Bottom Right Depth Layer)
          z-index: 30, translateZ: 65px, overlapping lower-right
         ======================================================== */}
      <div
        className="pointer-events-auto absolute bottom-4 right-0 lg:right-2 w-[310px] sm:w-[340px] transition-transform duration-500 ease-out hover:scale-105"
        style={{
          transform: 'translateZ(65px) rotateY(-5deg) rotateX(-2deg)',
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="rounded-2xl glass-panel bg-[#1D0445]/95 border border-[#007CB8]/40 p-4 shadow-[0_20px_45px_rgba(0,0,0,0.7),0_0_20px_rgba(0,124,184,0.2)] backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3 border-b border-white/[0.08] pb-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#007CB8]/20 text-[#0FD3F2] border border-[#007CB8]/40">
                <Cpu className="w-3.5 h-3.5 text-[#0FD3F2]" />
              </div>
              <h4 className="text-xs font-extrabold text-white tracking-wide uppercase font-tech">
                Panel C — Procurement Action
              </h4>
            </div>
            <span className="text-[10px] font-mono text-[#CBD5E1]/90 bg-white/[0.06] px-2 py-0.5 rounded-md border border-white/10">
              PO-2024-8841
            </span>
          </div>

          <div className="space-y-2 mb-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#CBD5E1]">Order Status:</span>
              <span className="font-mono font-bold text-[#0FD3F2] bg-[#0FD3F2]/15 px-2 py-0.5 rounded border border-[#0FD3F2]/30 text-[10px]">
                Expedited Air Freight
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#CBD5E1]">Material Availability:</span>
              <span className="font-mono font-bold text-white">14,000 u in Osaka</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#CBD5E1]">Recommended Alt:</span>
              <span className="text-[#0FD3F2] font-bold">Alps Alpine (99.8% Match)</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => setRerouted(true)}
            disabled={rerouted}
            className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
              rerouted
                ? 'bg-[#0FD3F2]/20 text-[#0FD3F2] border border-[#0FD3F2]/50'
                : 'bg-gradient-to-r from-[#0FD3F2] via-[#007CB8] to-[#921CC0] hover:brightness-110 text-[#1D0445] font-extrabold shadow-[0_0_20px_rgba(15,211,242,0.4)]'
            }`}
          >
            {rerouted ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0FD3F2]" />
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
              className="w-full mt-2 text-[10px] text-[#CBD5E1] hover:text-[#0FD3F2] flex items-center justify-center gap-1 transition-colors"
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
