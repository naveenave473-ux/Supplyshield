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
    isPositive?: boolean;
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
  onClick,
  className = '',
  enableTilt = true,
}) => {
  const cardInner = (
    <div
      onClick={onClick}
      className={`group relative liquid-glass p-5 rounded-2xl transition-all duration-300 h-full hover:border-white/25 hover:shadow-[0_12px_36px_rgba(0,0,0,0.8),0_0_24px_rgba(255,255,255,0.06)] ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Subtle top specular edge highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-white/60">
            {title}
          </p>
          <h3 className="text-3xl font-medium tracking-tight text-white mt-2 font-mono">
            {value}
          </h3>
        </div>

        {/* Soft illuminated icon container */}
        <div className="p-2.5 rounded-xl border border-white/15 bg-white/[0.06] backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_4px_12px_rgba(0,0,0,0.4)] text-white/90 group-hover:scale-110 group-hover:text-white transition-all duration-300">
          <Icon className="w-5 h-5" strokeWidth={1.75} />
        </div>
      </div>

      {(trend || subtitle) && (
        <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
          {trend ? (
            <div className="flex items-center gap-1.5">
              <span
                className={`inline-flex items-center gap-0.5 font-medium px-2 py-0.5 rounded-full text-[11px] border ${
                  trend.isPositive
                    ? 'text-[#3DD598] bg-[#3DD598]/10 border-[#3DD598]/25'
                    : 'text-[#FF6B6B] bg-[#FF6B6B]/10 border-[#FF6B6B]/25'
                }`}
              >
                {trend.direction === 'up' && <TrendingUp className="w-3 h-3" />}
                {trend.direction === 'down' && <TrendingDown className="w-3 h-3" />}
                {trend.direction === 'neutral' && <Minus className="w-3 h-3" />}
                {trend.value}
              </span>
              <span className="text-white/60">{trend.label}</span>
            </div>
          ) : (
            <span className="text-white/60">{subtitle}</span>
          )}

          {subtitle && trend && (
            <span className="text-[11px] text-white/40 truncate max-w-[140px]">
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
        maxTilt={5}
        perspective={1000}
        scale={1.01}
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
