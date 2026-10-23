import React from 'react';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'surface' | 'elevated' | 'modal' | 'strong';
  glow?: 'none' | 'cyan' | 'violet' | 'white';
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className = '',
  variant = 'default',
  glow = 'none',
  ...props
}) => {
  const variantStyles = {
    default: 'liquid-glass',
    surface: 'bg-[#0B0B0B]/80 backdrop-blur-[20px] border border-white/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.6)]',
    elevated: 'bg-[#141414]/80 backdrop-blur-[24px] border border-white/[0.12] shadow-[0_14px_40px_rgba(0,0,0,0.7)]',
    modal: 'liquid-glass-strong shadow-[0_24px_64px_rgba(0,0,0,0.9)]',
    strong: 'liquid-glass-strong',
  };

  const glowStyles = {
    none: '',
    cyan: 'shadow-[0_0_24px_rgba(255,255,255,0.12)]',
    violet: 'shadow-[0_0_24px_rgba(255,255,255,0.12)]',
    white: 'shadow-[0_0_28px_rgba(255,255,255,0.14)]',
  };

  return (
    <div
      className={`rounded-2xl transition-all duration-300 ${variantStyles[variant]} ${glowStyles[glow]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
