import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  selected?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  interactive = false,
  selected = false,
  ...props
}) => {
  return (
    <div
      className={`liquid-glass p-5 relative overflow-hidden ${
        interactive ? 'hover:border-white/25 hover:shadow-[0_12px_36px_rgba(0,0,0,0.8),0_0_20px_rgba(255,255,255,0.06)] hover:-translate-y-0.5 cursor-pointer' : ''
      } ${
        selected ? 'border-white/40 shadow-[0_0_24px_rgba(255,255,255,0.15)] ring-1 ring-white/30' : ''
      } ${className}`}
      {...props}
    >
      {/* Subtle top specular highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
      {children}
    </div>
  );
};
