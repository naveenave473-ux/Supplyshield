import React, { useState } from 'react';
import { Shield } from 'lucide-react';

interface SupplyShieldLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showSubtitle?: boolean;
  className?: string;
  onClick?: () => void;
}

export const SupplyShieldLogo: React.FC<SupplyShieldLogoProps> = ({
  size = 'md',
  showText = true,
  showSubtitle = true,
  className = '',
  onClick,
}) => {
  // Image fallback stage: 0 = /logo.png, 1 = /logo.jpg, 2 = /shield.svg, 3 = Lucide Shield icon
  const [fallbackStage, setFallbackStage] = useState<number>(0);

  const sizeMap = {
    sm: {
      img: 'w-7 h-7',
      box: 'w-8 h-8',
      text: 'text-sm font-semibold tracking-wide',
      badge: 'text-[9px] px-1.5 py-0.5',
      sub: 'text-[8px] tracking-wider',
    },
    md: {
      img: 'w-9 h-9',
      box: 'w-10 h-10',
      text: 'text-base font-semibold tracking-wide',
      badge: 'text-[10px] px-2 py-0.5',
      sub: 'text-[9px] tracking-widest',
    },
    lg: {
      img: 'w-12 h-12',
      box: 'w-13 h-13',
      text: 'text-lg font-semibold tracking-wide',
      badge: 'text-xs px-2.5 py-0.5',
      sub: 'text-[10px] tracking-widest',
    },
    xl: {
      img: 'w-16 h-16',
      box: 'w-18 h-18',
      text: 'text-2xl font-bold tracking-tight',
      badge: 'text-sm px-3 py-1',
      sub: 'text-xs tracking-widest',
    },
  };

  const currentSize = sizeMap[size];

  const handleImageError = () => {
    setFallbackStage((prev) => prev + 1);
  };

  const getImageSrc = () => {
    switch (fallbackStage) {
      case 0:
        return '/logo.png';
      case 1:
        return '/logo.jpg';
      case 2:
        return '/shield.svg';
      default:
        return null;
    }
  };

  const imageSrc = getImageSrc();

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 select-none group ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* 3D Liquid-Glass Emblem Container */}
      <div
        className={`relative ${currentSize.box} rounded-2xl flex-shrink-0 flex items-center justify-center transition-all duration-300 group-hover:scale-105 bg-white/[0.06] border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_6px_20px_rgba(0,0,0,0.5)] backdrop-blur-md overflow-hidden`}
      >
        {/* Subtle ambient chromatic backlight matching the 3D logo's cyan/magenta aura */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0FD3F2]/20 via-transparent to-[#921CC0]/25 pointer-events-none group-hover:opacity-100 opacity-60 transition-opacity" />

        {/* 3D Shield Logo with Multi-Stage Fallback */}
        {imageSrc ? (
          <img
            src={imageSrc}
            alt="SupplyShield AI Logo"
            onError={handleImageError}
            className={`${currentSize.img} object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_10px_rgba(15,211,242,0.45)]`}
          />
        ) : (
          <Shield
            className={`${currentSize.img} text-white transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]`}
            strokeWidth={2}
          />
        )}

        {/* Live Operational Status Indicator */}
        <span className="absolute top-1 right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0FD3F2] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0FD3F2] shadow-[0_0_6px_rgba(15,211,242,0.9)]" />
        </span>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-2">
            <span className={`font-sans font-bold tracking-tight text-white group-hover:text-white/90 transition-colors uppercase ${currentSize.text}`}>
              SUPPLYSHIELD
            </span>
            <span className={`font-mono font-bold text-[#0FD3F2] bg-[#0FD3F2]/15 border border-[#0FD3F2]/30 rounded-md shadow-[0_0_10px_rgba(15,211,242,0.25)] ${currentSize.badge}`}>
              AI
            </span>
          </div>

          {showSubtitle && (
            <p className={`font-sans uppercase text-white/50 font-medium mt-0.5 tracking-wider ${currentSize.sub}`}>
              PREDICTIVE PROCUREMENT INTELLIGENCE
            </p>
          )}
        </div>
      )}
    </div>
  );
};
