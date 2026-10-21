import React from 'react';

export type BadgeVariant =
  | 'critical'
  | 'warning'
  | 'delayed'
  | 'on_track'
  | 'received'
  | 'healthy'
  | 'shortage'
  | 'in_transit'
  | 'low'
  | 'medium'
  | 'high'
  | 'info'
  | 'default';

interface StatusBadgeProps {
  status: BadgeVariant | string;
  label?: string;
  size?: 'sm' | 'md';
  pulse?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'md',
  pulse = false,
  className = '',
}) => {
  const normalized = status.toLowerCase().replace(/\s+/g, '_');

  const configs: Record<
    string,
    { text: string; bg: string; border: string; dot: string; glow: string; defaultLabel: string }
  > = {
    critical: {
      text: 'text-[#921CC0]',
      bg: 'bg-[#921CC0]/20',
      border: 'border-[#921CC0]/40',
      dot: 'bg-[#921CC0]',
      glow: 'shadow-[0_0_10px_rgba(146,28,192,0.5)]',
      defaultLabel: 'Critical Risk',
    },
    shortage: {
      text: 'text-[#921CC0]',
      bg: 'bg-[#921CC0]/20',
      border: 'border-[#921CC0]/40',
      dot: 'bg-[#921CC0]',
      glow: 'shadow-[0_0_10px_rgba(146,28,192,0.5)]',
      defaultLabel: 'Stock Shortage',
    },
    delayed: {
      text: 'text-[#FBBF24]',
      bg: 'bg-[#F59E0B]/15',
      border: 'border-[#F59E0B]/35',
      dot: 'bg-[#F59E0B]',
      glow: 'shadow-[0_0_10px_rgba(245,158,11,0.3)]',
      defaultLabel: 'Delayed',
    },
    warning: {
      text: 'text-[#FBBF24]',
      bg: 'bg-[#F59E0B]/15',
      border: 'border-[#F59E0B]/35',
      dot: 'bg-[#F59E0B]',
      glow: 'shadow-[0_0_10px_rgba(245,158,11,0.3)]',
      defaultLabel: 'Warning',
    },
    high: {
      text: 'text-[#FBBF24]',
      bg: 'bg-[#F59E0B]/15',
      border: 'border-[#F59E0B]/35',
      dot: 'bg-[#F59E0B]',
      glow: 'shadow-[0_0_10px_rgba(245,158,11,0.3)]',
      defaultLabel: 'High Risk',
    },
    medium: {
      text: 'text-[#0FD3F2]',
      bg: 'bg-[#0FD3F2]/15',
      border: 'border-[#0FD3F2]/35',
      dot: 'bg-[#0FD3F2]',
      glow: 'shadow-[0_0_10px_rgba(15,211,242,0.3)]',
      defaultLabel: 'Medium Risk',
    },
    on_track: {
      text: 'text-[#B7F000]',
      bg: 'bg-[#B7F000]/15',
      border: 'border-[#B7F000]/35',
      dot: 'bg-[#B7F000]',
      glow: 'shadow-[0_0_10px_rgba(183,240,0,0.35)]',
      defaultLabel: 'On Track',
    },
    healthy: {
      text: 'text-[#B7F000]',
      bg: 'bg-[#B7F000]/15',
      border: 'border-[#B7F000]/35',
      dot: 'bg-[#B7F000]',
      glow: 'shadow-[0_0_10px_rgba(183,240,0,0.35)]',
      defaultLabel: 'Healthy Coverage',
    },
    received: {
      text: 'text-[#BEC7D5]',
      bg: 'bg-[#BEC7D5]/15',
      border: 'border-[#BEC7D5]/35',
      dot: 'bg-[#BEC7D5]',
      glow: 'shadow-[0_0_10px_rgba(190,199,213,0.2)]',
      defaultLabel: 'Delivered',
    },
    in_transit: {
      text: 'text-[#0FD3F2]',
      bg: 'bg-[#0FD3F2]/15',
      border: 'border-[#0FD3F2]/35',
      dot: 'bg-[#0FD3F2]',
      glow: 'shadow-[0_0_10px_rgba(15,211,242,0.35)]',
      defaultLabel: 'In Transit',
    },
    low: {
      text: 'text-[#B7F000]',
      bg: 'bg-[#B7F000]/15',
      border: 'border-[#B7F000]/35',
      dot: 'bg-[#B7F000]',
      glow: 'shadow-[0_0_10px_rgba(183,240,0,0.35)]',
      defaultLabel: 'Low Risk',
    },
    mitigation: {
      text: 'text-[#0FD3F2]',
      bg: 'bg-[#0FD3F2]/15',
      border: 'border-[#0FD3F2]/35',
      dot: 'bg-[#0FD3F2]',
      glow: 'shadow-[0_0_10px_rgba(15,211,242,0.35)]',
      defaultLabel: 'AI Mitigation',
    },
    info: {
      text: 'text-[#0FD3F2]',
      bg: 'bg-[#0FD3F2]/15',
      border: 'border-[#0FD3F2]/35',
      dot: 'bg-[#0FD3F2]',
      glow: 'shadow-[0_0_10px_rgba(15,211,242,0.3)]',
      defaultLabel: 'Info',
    },
    default: {
      text: 'text-[#BEC7D5]',
      bg: 'bg-white/[0.06]',
      border: 'border-white/10',
      dot: 'bg-[#BEC7D5]',
      glow: '',
      defaultLabel: status,
    },
  };

  const current = configs[normalized] || configs.default;
  const displayText = label || current.defaultLabel;

  const sizeClasses =
    size === 'sm' ? 'px-2 py-0.5 text-[11px] gap-1.5' : 'px-2.5 py-1 text-xs gap-2';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border backdrop-blur-md ${current.bg} ${current.border} ${current.text} ${current.glow} ${sizeClasses} ${className}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        {(pulse || normalized === 'critical' || normalized === 'shortage') && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${current.dot}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${current.dot}`} />
      </span>
      <span>{displayText}</span>
    </span>
  );
};
