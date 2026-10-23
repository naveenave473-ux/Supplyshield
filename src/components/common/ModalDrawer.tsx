import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { NeumorphicButton } from './NeumorphicButton';

export interface ModalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: string;
  footer?: React.ReactNode;
  variant?: 'drawer' | 'modal';
}

export const ModalDrawer: React.FC<ModalDrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  width = 'max-w-2xl',
  footer,
  variant = 'drawer',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
        <div
          className={`w-full ${width} rounded-3xl liquid-glass-strong border border-white/20 shadow-[0_30px_80px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[90vh]`}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/[0.08] flex items-center justify-between bg-black/40">
            <div>
              <h3 className="text-lg font-medium text-white tracking-tight">{title}</h3>
              {subtitle && <p className="text-xs text-white/55 mt-0.5">{subtitle}</p>}
            </div>
            <NeumorphicButton
              variant="secondary"
              size="icon"
              onClick={onClose}
              className="text-white/70 hover:text-white"
            >
              <X className="w-4 h-4" />
            </NeumorphicButton>
          </div>

          {/* Body */}
          <div className="px-6 py-6 overflow-y-auto flex-1">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="px-6 py-4 border-t border-white/[0.08] bg-black/40 flex items-center justify-end gap-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Drawer variant (slide in from right)
  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm transition-opacity duration-300">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className={`w-screen ${width} liquid-glass-strong border-l border-white/20 shadow-[-20px_0_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden animate-in slide-in-from-right duration-300`}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/[0.08] flex items-start justify-between bg-black/40">
            <div>
              <h3 className="text-lg font-medium text-white tracking-tight">{title}</h3>
              {subtitle && <p className="text-xs text-white/55 mt-0.5">{subtitle}</p>}
            </div>
            <NeumorphicButton
              variant="secondary"
              size="icon"
              onClick={onClose}
              className="text-white/70 hover:text-white"
            >
              <X className="w-4 h-4" />
            </NeumorphicButton>
          </div>

          {/* Scrollable Content */}
          <div className="px-6 py-6 overflow-y-auto flex-1 space-y-6">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="px-6 py-4 border-t border-white/[0.08] bg-black/40 flex items-center justify-end gap-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
