import React from 'react';
import { LucideIcon } from 'lucide-react';
import { NeumorphicButton } from './NeumorphicButton';

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`glass-card p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto border border-dashed border-white/15 rounded-3xl ${className}`}
    >
      <div className="neu-icon-container p-4 rounded-2xl bg-[#171665] text-primary border border-primary/30 shadow-[0_0_20px_rgba(15,211,242,0.25)] mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-lg font-bold text-white mb-2">{title}</h4>
      <p className="text-sm text-[#BEC7D5] leading-relaxed mb-6 max-w-sm">
        {description}
      </p>
      {actionLabel && onAction && (
        <NeumorphicButton variant="primary" onClick={onAction}>
          {actionLabel}
        </NeumorphicButton>
      )}
    </div>
  );
};
