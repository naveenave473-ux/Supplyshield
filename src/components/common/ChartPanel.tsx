import React from 'react';

interface ChartPanelProps {
  title: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const ChartPanel: React.FC<ChartPanelProps> = ({
  title,
  subtitle,
  headerAction,
  children,
  className = '',
}) => {
  return (
    <div
      className={`glass-panel p-5 rounded-2xl border border-white/[0.08] flex flex-col justify-between ${className}`}
    >
      <div className="flex items-start justify-between mb-4 gap-4">
        <div>
          <h4 className="text-base font-semibold text-white tracking-tight">
            {title}
          </h4>
          {subtitle && (
            <p className="text-xs text-[#BEC7D5] mt-0.5">{subtitle}</p>
          )}
        </div>
        {headerAction && <div>{headerAction}</div>}
      </div>
      <div className="w-full flex-1 min-h-[260px] relative">
        {children}
      </div>
    </div>
  );
};

export const CustomChartTooltip = ({
  active,
  payload,
  label,
  valuePrefix = '',
  valueSuffix = '',
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number | string; color?: string }>;
  label?: string;
  valuePrefix?: string;
  valueSuffix?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#171665]/95 backdrop-blur-md border border-[#4C128A]/40 rounded-xl p-3 shadow-[0_8px_24px_rgba(0,0,0,0.6)] text-xs z-50">
        {label && <p className="font-semibold text-white mb-2">{label}</p>}
        <div className="space-y-1.5">
          {payload.map((entry, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color || '#0FD3F2' }}
                />
                <span className="text-[#BEC7D5]">{entry.name}:</span>
              </div>
              <span className="font-mono font-medium text-white">
                {valuePrefix}
                {typeof entry.value === 'number'
                  ? entry.value.toLocaleString()
                  : entry.value}
                {valueSuffix}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};
