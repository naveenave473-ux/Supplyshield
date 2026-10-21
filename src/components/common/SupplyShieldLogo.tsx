import React from 'react';

interface SupplyShieldLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showSubtitle?: boolean;
  className?: string;
}

export const SupplyShieldLogo: React.FC<SupplyShieldLogoProps> = ({
  size = 'md',
  showText = true,
  showSubtitle = true,
  className = '',
}) => {
  const sizeMap = {
    sm: { img: 'w-8 h-8', text: 'text-sm', badge: 'text-[9px] px-1 py-0.2', sub: 'text-[8px]' },
    md: { img: 'w-10 h-10', text: 'text-base sm:text-lg', badge: 'text-[10px] px-1.5 py-0.5', sub: 'text-[9px]' },
    lg: { img: 'w-14 h-14', text: 'text-xl sm:text-2xl', badge: 'text-xs px-2 py-0.5', sub: 'text-[10px]' },
    xl: { img: 'w-20 h-20', text: 'text-2xl sm:text-3xl', badge: 'text-sm px-2.5 py-1', sub: 'text-xs' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none group ${className}`}>
      {/* 3D Shield Emblem Container with Ambient Luminous Glow */}
      <div className={`relative ${currentSize.img} rounded-2xl flex-shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        {/* Ambient back-glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#0FD3F2] via-[#082495] to-[#921CC0] opacity-60 blur-md group-hover:opacity-90 group-hover:blur-lg transition-all" />

        {/* 3D Logo Image */}
        <div className="relative w-full h-full rounded-2xl border border-white/25 shadow-[0_0_20px_rgba(15,211,242,0.4)] bg-[#1D0445]">
          <img
            src="/logo.png"
            alt="SupplyShield AI Logo"
            className="w-full h-full object-cover rounded-2xl transform group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              // Graceful SVG fallback if image fails
              const target = e.currentTarget;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="w-full h-full bg-gradient-to-br from-[#171665] to-[#1D0445] flex items-center justify-center">
                    <svg class="w-3/5 h-3/5 text-[#0FD3F2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </div>
                `;
              }
            }}
          />
        </div>

        {/* Online Status Telemetry Dot */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0FD3F2] opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0FD3F2] ring-2 ring-[#1D0445] shadow-[0_0_8px_rgba(15,211,242,0.9)]" />
        </span>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`font-display font-black tracking-tight text-white group-hover:text-primary transition-colors ${currentSize.text}`}>
              SupplyShield
            </span>
            <span className={`font-tech font-extrabold tracking-widest text-[#0FD3F2] bg-[#0FD3F2]/15 border border-[#0FD3F2]/40 rounded-md shadow-[0_0_10px_rgba(15,211,242,0.3)] ${currentSize.badge}`}>
              AI
            </span>
          </div>

          {showSubtitle && (
            <p className={`font-tech uppercase tracking-widest text-[#CBD5E1] font-semibold ${currentSize.sub}`}>
              Autonomous Supply Resilience
            </p>
          )}
        </div>
      )}
    </div>
  );
};
