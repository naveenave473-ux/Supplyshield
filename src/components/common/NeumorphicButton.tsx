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
    lg: 'px-6 py-3.5 text-base font-semibold rounded-2xl gap-2.5',
    icon: 'p-2.5 text-sm rounded-xl aspect-square justify-center items-center',
  };

  const variantStyles = {
    raised: active
      ? 'neu-inset text-primary border-primary/40'
      : 'neu-raised text-white hover:text-white',
    primary:
      'neu-raised-primary text-white font-semibold',
    secondary:
      'bg-gradient-to-r from-[#0FD3F2] to-[#007CB8] text-[#1D0445] font-bold shadow-[0_4px_16px_rgba(15,211,242,0.35)] border border-primary/40 hover:brightness-110 active:scale-[0.98]',
    accent:
      'bg-gradient-to-r from-[#921CC0] to-[#4C128A] text-white shadow-[0_4px_16px_rgba(146,28,192,0.4)] border border-secondary/40 hover:brightness-110 active:scale-[0.98]',
    danger:
      'bg-status-critical/15 text-status-critical border border-status-critical/30 hover:bg-status-critical/25 active:scale-[0.98]',
    ghost:
      'bg-transparent hover:bg-white/[0.06] text-[#BEC7D5] hover:text-white border border-transparent hover:border-white/10',
    inset:
      'neu-inset text-primary border-primary/30',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center select-none outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1D0445] disabled:opacity-50 disabled:pointer-events-none transition-all duration-200 ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
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
