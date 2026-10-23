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

  // Restrained status styling: maintains clear operational distinction
  // while adhering to the sleek grayscale liquid-glass aesthetic.
  const configs: Record<
    string,
    { text: string; bg: string; border: string; dot: string; glow: string; defaultLabel: string }
  > = {
    critical: {
      text: 'text-[#921CC0]',
      bg: 'bg-[#921CC0]/15',
      border: 'border-[#921CC0]/40',
      dot: 'bg-[#921CC0]',
      glow: 'shadow-[0_0_12px_rgba(146,28,192,0.4)]',
      defaultLabel: 'Critical Risk',
    },
    shortage: {
      text: 'text-[#921CC0]',
      bg: 'bg-[#921CC0]/15',
      border: 'border-[#921CC0]/40',
      dot: 'bg-[#921CC0]',
      glow: 'shadow-[0_0_12px_rgba(146,28,192,0.4)]',
      defaultLabel: 'Stock Shortage',
    },
    delayed: {
      text: 'text-[#007CB8]',
      bg: 'bg-[#007CB8]/15',
      border: 'border-[#007CB8]/40',
      dot: 'bg-[#007CB8]',
      glow: 'shadow-[0_0_10px_rgba(0,124,184,0.35)]',
      defaultLabel: 'Delayed',
    },
    warning: {
      text: 'text-[#007CB8]',
      bg: 'bg-[#007CB8]/15',
      border: 'border-[#007CB8]/40',
      dot: 'bg-[#007CB8]',
      glow: 'shadow-[0_0_10px_rgba(0,124,184,0.35)]',
      defaultLabel: 'Warning',
    },
    high: {
      text: 'text-[#921CC0]',
      bg: 'bg-[#921CC0]/15',
      border: 'border-[#921CC0]/40',
      dot: 'bg-[#921CC0]',
      glow: 'shadow-[0_0_10px_rgba(146,28,192,0.35)]',
      defaultLabel: 'High Risk',
    },
    medium: {
      text: 'text-[#007CB8]',
      bg: 'bg-[#007CB8]/15',
      border: 'border-[#007CB8]/35',
      dot: 'bg-[#007CB8]',
      glow: 'shadow-[0_0_8px_rgba(0,124,184,0.3)]',
      defaultLabel: 'Medium Risk',
    },
    on_track: {
      text: 'text-[#0FD3F2]',
      bg: 'bg-[#0FD3F2]/15',
      border: 'border-[#0FD3F2]/40',
      dot: 'bg-[#0FD3F2]',
      glow: 'shadow-[0_0_10px_rgba(15,211,242,0.4)]',
      defaultLabel: 'On Track',
    },
    healthy: {
      text: 'text-[#0FD3F2]',
      bg: 'bg-[#0FD3F2]/15',
      border: 'border-[#0FD3F2]/40',
      dot: 'bg-[#0FD3F2]',
      glow: 'shadow-[0_0_10px_rgba(15,211,242,0.4)]',
      defaultLabel: 'Healthy Coverage',
    },
    received: {
      text: 'text-[#0FD3F2]/80',
      bg: 'bg-[#0FD3F2]/10',
      border: 'border-[#0FD3F2]/25',
      dot: 'bg-[#0FD3F2]/70',
      glow: '',
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
      text: 'text-[#3DD598]',
      bg: 'bg-[#3DD598]/10',
      border: 'border-[#3DD598]/30',
      dot: 'bg-[#3DD598]',
      glow: 'shadow-[0_0_10px_rgba(61,213,152,0.25)]',
      defaultLabel: 'Low Risk',
    },
    mitigation: {
      text: 'text-white',
      bg: 'bg-white/15',
      border: 'border-white/35',
      dot: 'bg-white',
      glow: 'shadow-[0_0_12px_rgba(255,255,255,0.3)]',
      defaultLabel: 'AI Mitigation',
    },
    info: {
      text: 'text-white/80',
      bg: 'bg-white/5',
      border: 'border-white/15',
      dot: 'bg-white/80',
      glow: '',
      defaultLabel: 'Info',
    },
    default: {
      text: 'text-white/80',
      bg: 'bg-white/5',
      border: 'border-white/15',
      dot: 'bg-white/80',
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
