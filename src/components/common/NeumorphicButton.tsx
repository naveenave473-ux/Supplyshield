import React from 'react';
import { Loader2 } from 'lucide-react';

export interface NeumorphicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'raised' | 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost' | 'inset';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  active?: boolean;
}

export const NeumorphicButton: React.FC<NeumorphicButtonProps> = ({
  children,
  className = '',
  variant = 'raised',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  active = false,
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs font-medium rounded-lg gap-1.5',
    md: 'px-4 py-2.5 text-sm font-medium rounded-xl gap-2',
    lg: 'px-6 py-3.5 text-base font-medium rounded-2xl gap-2.5',
    icon: 'p-2.5 text-sm rounded-xl aspect-square justify-center items-center',
  };

  const variantStyles = {
    raised: active
      ? 'bg-[#0FD3F2]/15 text-[#0FD3F2] border border-[#0FD3F2]/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),0_0_12px_rgba(15,211,242,0.25)]'
      : 'glass-control text-white/90 hover:text-[#0FD3F2] hover:border-[#0FD3F2]/40',
    primary:
      'bg-gradient-to-r from-[#0FD3F2] to-[#007CB8] text-[#06040A] font-semibold hover:from-[#35DCF5] hover:to-[#0FD3F2] border border-[#0FD3F2]/50 shadow-[0_4px_20px_rgba(15,211,242,0.45)] active:scale-[0.98]',
    secondary:
      'bg-gradient-to-r from-[#921CC0] to-[#4C128A] text-white border border-[#921CC0]/40 hover:from-[#A929DB] hover:to-[#921CC0] shadow-[0_4px_20px_rgba(146,28,192,0.4)] active:scale-[0.98]',
    accent:
      'bg-[#0FD3F2]/15 backdrop-blur-md text-[#0FD3F2] border border-[#0FD3F2]/40 hover:bg-[#0FD3F2]/25 hover:border-[#0FD3F2]/60 shadow-[0_0_20px_rgba(15,211,242,0.25)] active:scale-[0.98]',
    danger:
      'bg-[#921CC0]/20 text-[#FF70C5] border border-[#921CC0]/40 hover:bg-[#921CC0]/30 shadow-[0_0_16px_rgba(146,28,192,0.3)] active:scale-[0.98]',
    ghost:
      'bg-transparent hover:bg-[#0FD3F2]/10 text-white/70 hover:text-[#0FD3F2] border border-transparent hover:border-[#0FD3F2]/20',
    inset:
      'bg-[#1D0445]/60 border border-white/10 text-white/90 shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)]',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center select-none outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] disabled:opacity-50 disabled:pointer-events-none transition-all duration-200 cursor-pointer ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};
