import React from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';
import { NeumorphicButton } from './NeumorphicButton';

export interface PageHeaderProps {
  breadcrumbs?: string[];
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  breadcrumbs = ['SupplyShield', 'Workspace'],
  title,
  subtitle,
  actions,
  onRefresh,
  isRefreshing = false,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/[0.06]">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-[11px] font-tech font-bold uppercase tracking-wider text-[#CBD5E1] mb-1.5">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb}>
                {idx > 0 && <span className="text-[#0FD3F2]/60">/</span>}
                <span
                  className={
                    idx === breadcrumbs.length - 1
                      ? 'text-white'
                      : 'hover:text-[#0FD3F2] transition-colors'
                  }
                >
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-white">
            {title}
          </h1>
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-tech font-bold uppercase tracking-wider bg-primary/10 border border-primary/30 text-primary shadow-[0_0_12px_rgba(15,211,242,0.25)]">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Risk Intelligence</span>
          </div>
        </div>

        {subtitle && (
          <p className="text-sm text-[#CBD5E1] font-sans font-medium mt-1 max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        {onRefresh && (
          <NeumorphicButton
            variant="raised"
            size="sm"
            onClick={onRefresh}
            isLoading={isRefreshing}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />}
            title="Refresh analytics and telemetry"
          >
            Refresh
          </NeumorphicButton>
        )}
        {actions}
      </div>
    </div>
  );
};
