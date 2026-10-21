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
          className="block text-xs font-medium uppercase tracking-wider text-[#BEC7D5]"
        >
          {label}
        </label>
      )}
      <div
        className={`neu-inset relative flex items-center rounded-xl px-3.5 py-2.5 transition-all duration-200 group ${
          error
            ? 'border-status-critical/50 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.7),0_0_12px_rgba(193,24,167,0.3)]'
            : 'focus-within:border-primary/50 focus-within:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.7),0_0_14px_rgba(45,226,230,0.25)]'
        } ${className}`}
      >
        {leftIcon && (
          <div className="mr-2.5 text-[#BEC7D5] group-focus-within:text-primary transition-colors flex-shrink-0">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          value={value}
          className="w-full bg-transparent text-sm text-white placeholder-[#BEC7D5]/60 focus:outline-none"
          {...props}
        />
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="p-1 text-[#BEC7D5] hover:text-white rounded-md transition-colors"
            title="Clear input"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        {shortcutBadge && !value && (
          <span className="ml-2 text-[10px] font-mono font-medium px-1.5 py-0.5 rounded border border-white/10 bg-white/[0.04] text-[#BEC7D5]">
            {shortcutBadge}
          </span>
        )}
        {rightIcon && !value && (
          <div className="ml-2 text-[#BEC7D5] flex-shrink-0">{rightIcon}</div>
        )}
      </div>
      {error && <p className="text-xs text-status-critical">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-[#BEC7D5]/70">{helperText}</p>
      )}
    </div>
  );
};
