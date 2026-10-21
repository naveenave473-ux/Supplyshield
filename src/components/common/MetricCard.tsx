import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Tilt3DCard } from './Tilt3DCard';

export interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
    label: string;
    isPositive?: boolean; // if up is good or bad
  };
  accentColor?: 'cyan' | 'blue' | 'violet' | 'magenta' | 'amber' | 'red' | 'lime' | 'silver';
  onClick?: () => void;
  className?: string;
  enableTilt?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  subtitle,
  trend,
  accentColor = 'cyan',
  onClick,
  className = '',
  enableTilt = true,
}) => {
  const accentConfigs = {
    cyan: {
      borderHover: 'hover:border-[#0FD3F2]/40',
      glow: 'group-hover:shadow-[0_0_24px_rgba(15,211,242,0.25)]',
      iconBg: 'bg-[#0FD3F2]/15 border-[#0FD3F2]/35 text-[#0FD3F2]',
      iconGlow: 'shadow-[0_0_14px_rgba(15,211,242,0.3)]',
      accentBar: 'from-[#0FD3F2]',
    },
    blue: {
      borderHover: 'hover:border-[#007CB8]/40',
      glow: 'group-hover:shadow-[0_0_24px_rgba(0,124,184,0.25)]',
      iconBg: 'bg-[#007CB8]/15 border-[#007CB8]/35 text-[#0FD3F2]',
      iconGlow: 'shadow-[0_0_14px_rgba(0,124,184,0.3)]',
      accentBar: 'from-[#007CB8]',
    },
    violet: {
      borderHover: 'hover:border-[#921CC0]/40',
      glow: 'group-hover:shadow-[0_0_24px_rgba(146,28,192,0.25)]',
      iconBg: 'bg-[#921CC0]/20 border-[#921CC0]/40 text-[#0FD3F2]',
      iconGlow: 'shadow-[0_0_14px_rgba(146,28,192,0.35)]',
      accentBar: 'from-[#921CC0]',
    },
    magenta: {
      borderHover: 'hover:border-[#921CC0]/40',
      glow: 'group-hover:shadow-[0_0_24px_rgba(146,28,192,0.25)]',
      iconBg: 'bg-[#921CC0]/20 border-[#921CC0]/40 text-white',
      iconGlow: 'shadow-[0_0_14px_rgba(146,28,192,0.35)]',
      accentBar: 'from-[#921CC0]',
    },
    lime: {
      borderHover: 'hover:border-[#B7F000]/40',
      glow: 'group-hover:shadow-[0_0_24px_rgba(183,240,0,0.25)]',
      iconBg: 'bg-[#B7F000]/15 border-[#B7F000]/35 text-[#B7F000]',
      iconGlow: 'shadow-[0_0_14px_rgba(183,240,0,0.3)]',
      accentBar: 'from-[#B7F000]',
    },
    amber: {
      borderHover: 'hover:border-[#F59E0B]/40',
      glow: 'group-hover:shadow-[0_0_24px_rgba(245,158,11,0.22)]',
      iconBg: 'bg-[#F59E0B]/15 border-[#F59E0B]/35 text-[#F59E0B]',
      iconGlow: 'shadow-[0_0_14px_rgba(245,158,11,0.28)]',
      accentBar: 'from-[#F59E0B]',
    },
    red: {
      borderHover: 'hover:border-[#921CC0]/40',
      glow: 'group-hover:shadow-[0_0_24px_rgba(146,28,192,0.25)]',
      iconBg: 'bg-[#921CC0]/20 border-[#921CC0]/40 text-[#921CC0]',
      iconGlow: 'shadow-[0_0_14px_rgba(146,28,192,0.35)]',
      accentBar: 'from-[#921CC0]',
    },
    silver: {
      borderHover: 'hover:border-[#BEC7D5]/40',
      glow: 'group-hover:shadow-[0_0_24px_rgba(190,199,213,0.18)]',
      iconBg: 'bg-[#BEC7D5]/15 border-[#BEC7D5]/35 text-[#BEC7D5]',
      iconGlow: 'shadow-[0_0_14px_rgba(190,199,213,0.2)]',
      accentBar: 'from-[#BEC7D5]',
    },
  };

  const style = accentConfigs[accentColor] || accentConfigs.cyan;

  const cardInner = (
    <div
      onClick={onClick}
      className={`group relative glass-card p-5 border border-white/[0.08] rounded-2xl transition-all duration-300 h-full ${
        style.borderHover
      } ${style.glow} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Specular highlight border accent on hover */}
      <div
        className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${style.accentBar} via-white/10 to-transparent opacity-60 group-hover:opacity-100 transition-opacity`}
      />

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#BEC7D5]">
            {title}
          </p>
          <h3 className="text-3xl font-bold tracking-tight text-white mt-2 font-mono">
            {value}
          </h3>
        </div>

        {/* Soft illuminated icon container */}
        <div
          className={`neu-icon-container p-3 rounded-xl border ${style.iconBg} ${style.iconGlow} transition-transform duration-300 group-hover:scale-110`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(trend || subtitle) && (
        <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
          {trend ? (
            <div className="flex items-center gap-1.5">
              <span
                className={`inline-flex items-center gap-0.5 font-medium px-1.5 py-0.5 rounded text-[11px] ${
                  trend.isPositive
                    ? 'text-[#B7F000] bg-[#B7F000]/15'
                    : 'text-[#0FD3F2] bg-[#921CC0]/25 border border-[#921CC0]/40'
                }`}
              >
                {trend.direction === 'up' && <TrendingUp className="w-3 h-3" />}
                {trend.direction === 'down' && <TrendingDown className="w-3 h-3" />}
                {trend.direction === 'neutral' && <Minus className="w-3 h-3" />}
                {trend.value}
              </span>
              <span className="text-[#BEC7D5]">{trend.label}</span>
            </div>
          ) : (
            <span className="text-[#BEC7D5]">{subtitle}</span>
          )}

          {subtitle && trend && (
            <span className="text-[11px] text-[#BEC7D5]/70 truncate max-w-[140px]">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (enableTilt) {
    return (
      <Tilt3DCard
        maxTilt={6}
        perspective={900}
        scale={1.02}
        glare={true}
        onClick={onClick}
        className="h-full rounded-2xl"
      >
        {cardInner}
      </Tilt3DCard>
    );
  }

  return cardInner;
};
