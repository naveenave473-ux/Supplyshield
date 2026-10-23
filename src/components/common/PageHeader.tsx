import React from 'react';
import { RefreshCw, Activity } from 'lucide-react';
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
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/[0.08] page-header-root">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1.5 page-header-breadcrumbs">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb}>
                {idx > 0 && <span className="text-white/40">/</span>}
                <span
                  className={
                    idx === breadcrumbs.length - 1
                      ? 'text-palette-cyan font-semibold'
                      : 'hover:text-white transition-colors'
                  }
                >
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-white page-header-title">
            {title}
          </h1>
          <div className="section-badge hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-palette-void/70 border border-palette-cyan/40 text-palette-cyan shadow-glow-cyan/20 backdrop-blur-md">
            <Activity className="w-3 h-3 text-palette-cyan animate-pulse" />
            <span>OPERATIONAL TELEMETRY</span>
          </div>
        </div>

        {subtitle && (
          <p className="text-sm text-white/80 mt-1 max-w-3xl leading-relaxed page-header-subtitle">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        {onRefresh && (
          <NeumorphicButton
            variant="secondary"
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
