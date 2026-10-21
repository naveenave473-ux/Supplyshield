import React from 'react';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'surface' | 'elevated' | 'modal';
  glow?: 'none' | 'cyan' | 'violet';
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className = '',
  variant = 'default',
  glow = 'none',
  ...props
}) => {
  const variantStyles = {
    default: 'glass-panel',
    surface: 'bg-[#0f172a]/65 backdrop-blur-[16px] border border-white/[0.08] shadow-[0_6px_24px_rgba(0,0,0,0.25)]',
    elevated: 'bg-[#16223a]/75 backdrop-blur-[20px] border border-white/[0.12] shadow-[0_12px_36px_rgba(0,0,0,0.4)]',
    modal: 'bg-[#0d1424]/92 backdrop-blur-[24px] border border-white/[0.12] shadow-[0_20px_50px_rgba(0,0,0,0.6)]',
  };

  const glowStyles = {
    none: '',
    cyan: 'shadow-[0_0_28px_rgba(53,191,255,0.22)]',
    violet: 'shadow-[0_0_28px_rgba(139,124,255,0.22)]',
  };

  return (
    <div
      className={`rounded-2xl transition-all duration-200 ${variantStyles[variant]} ${glowStyles[glow]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
