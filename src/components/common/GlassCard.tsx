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
      className={`glass-card p-5 relative overflow-hidden ${
        interactive ? 'glass-card-hover cursor-pointer' : ''
      } ${
        selected ? 'border-primary/50 shadow-[0_0_24px_rgba(53,191,255,0.22)] ring-1 ring-primary/40' : ''
      } ${className}`}
      {...props}
    >
      {/* Subtle top specular highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
      {children}
    </div>
  );
};
