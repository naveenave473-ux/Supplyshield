import React from 'react';
import { X } from 'lucide-react';

export interface InsetInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  helperText?: string;
  onClear?: () => void;
  shortcutBadge?: string;
}

export const InsetInput: React.FC<InsetInputProps> = ({
  label,
  leftIcon,
  rightIcon,
  error,
  helperText,
  value,
  onClear,
  shortcutBadge,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-medium uppercase tracking-wider text-white/60"
        >
          {label}
        </label>
      )}
      <div
        className={`relative flex items-center rounded-xl px-3.5 py-2.5 transition-all duration-200 group bg-black/40 border border-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] ${
          error
            ? 'border-[#FF6B6B]/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_0_12px_rgba(255,107,107,0.25)]'
            : 'focus-within:border-white/30 focus-within:shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_0_14px_rgba(255,255,255,0.1)]'
        } ${className}`}
      >
        {leftIcon && (
          <div className="mr-2.5 text-white/50 group-focus-within:text-white transition-colors flex-shrink-0">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          value={value}
          className="w-full bg-transparent text-sm text-white placeholder-white/40 focus:outline-none"
          {...props}
        />
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="p-1 text-white/50 hover:text-white rounded-md transition-colors"
            title="Clear input"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        {shortcutBadge && !value && (
          <span className="ml-2 text-[10px] font-mono font-medium px-1.5 py-0.5 rounded border border-white/10 bg-white/[0.04] text-white/60">
            {shortcutBadge}
          </span>
        )}
        {rightIcon && !value && (
          <div className="ml-2 text-white/50 flex-shrink-0">{rightIcon}</div>
        )}
      </div>
      {error && <p className="text-xs text-[#FF6B6B]">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-white/50">{helperText}</p>
      )}
    </div>
  );
};
