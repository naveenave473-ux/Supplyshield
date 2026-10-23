import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Factory,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Line,
} from 'recharts';
import { PageHeader } from '../components/common/PageHeader';
import { GlassTable, Column } from '../components/common/GlassTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { InsetInput } from '../components/common/InsetInput';
import { NeumorphicButton } from '../components/common/NeumorphicButton';
import { ChartPanel, CustomChartTooltip } from '../components/common/ChartPanel';
import { ModalDrawer } from '../components/common/ModalDrawer';
import { mockMaterialRisks, inventoryCoverageDemandData } from '../data/mockData';
import { MaterialRisk } from '../types';

export const InventoryRisksPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<'all' | 'critical' | 'warning' | 'healthy'>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialRisk | null>(null);

  const filteredMaterials = mockMaterialRisks.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.primarySupplier.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity =
      selectedSeverity === 'all'
        ? true
        : selectedSeverity === 'critical'
        ? m.daysOfCoverage < 7
        : selectedSeverity === 'warning'
        ? m.daysOfCoverage >= 7 && m.daysOfCoverage <= 14
        : m.daysOfCoverage > 14;

    return matchesSearch && matchesSeverity;
  });

  const columns: Column<MaterialRisk>[] = [
    {
      key: 'sku',
      header: 'Component / SKU',
      sortable: true,
      render: (m) => (
        <div>
          <span className="font-mono font-medium text-xs text-white group-hover:text-white transition-colors block">
            {m.sku}
          </span>
          <span className="text-xs text-white/70 truncate max-w-[200px] block font-normal">
            {m.name}
          </span>
          <span className="text-[10px] text-white/40">{m.category}</span>
        </div>
      ),
    },
    {
      key: 'daysOfCoverage',
      header: 'Days of Coverage',
      sortable: true,
      render: (m) => {
        const isCritical = m.daysOfCoverage < 7;
        const isWarning = m.daysOfCoverage >= 7 && m.daysOfCoverage <= 14;
        return (
          <div className="space-y-1 min-w-[120px]">
            <div className="flex justify-between text-xs font-mono">
              <span
                className={`font-medium ${
                  isCritical
                    ? 'text-palette-magenta font-bold'
                    : isWarning
                    ? 'text-palette-cerulean'
                    : 'text-palette-cyan'
                }`}
              >
                {m.daysOfCoverage} days
              </span>
              <span className="text-[10px] text-white/50">Burn: {m.dailyBurnRate}/d</span>
            </div>
            <div className="h-1.5 w-full bg-black/60 rounded-full overflow-hidden border border-white/10">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isCritical
                    ? 'bg-gradient-to-r from-palette-royal to-palette-magenta shadow-[0_0_8px_rgba(146,28,192,0.6)]'
                    : isWarning
                    ? 'bg-gradient-to-r from-palette-cobalt to-palette-cerulean'
                    : 'bg-gradient-to-r from-palette-cerulean to-palette-cyan shadow-[0_0_8px_rgba(15,211,242,0.6)]'
                }`}
                style={{ width: `${Math.min(100, (m.daysOfCoverage / 30) * 100)}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: 'currentStock',
      header: 'Current Stock',
      sortable: true,
      render: (m) => (
        <div>
          <span className="font-mono text-xs font-medium text-white block">
            {m.currentStock.toLocaleString()} {m.unit}
          </span>
          <span className="text-[10px] text-white/40 font-mono">
            Min: {m.minRequiredStock.toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      key: 'replenishmentStatus',
      header: 'Replenishment',
      render: (m) => <StatusBadge status={m.replenishmentStatus} size="sm" />,
    },
    {
      key: 'primarySupplier',
      header: 'Primary Supplier',
      render: (m) => (
        <span className="text-xs text-white/70 truncate max-w-[150px] block">
          {m.primarySupplier}
        </span>
      ),
    },
    {
      key: 'alternateSuppliersAvailable',
      header: 'Alternatives',
      align: 'center',
      render: (m) => (
        <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-white/[0.08] text-white/90 border border-white/10">
          {m.alternateSuppliersAvailable} AVL
        </span>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      align: 'right',
      render: (m) => (
        <NeumorphicButton
          variant="secondary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedMaterial(m);
          }}
        >
          Inspect
        </NeumorphicButton>
      ),
    },
  ];

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
      <PageHeader
        breadcrumbs={['SupplyShield', 'Inventory Health']}
        title="Inventory Shortage & Coverage Telemetry"
        subtitle="Automated burn rate tracking, safety buffer erosion warnings, and factory downtime risk modeling."
      />

      {/* Severity Filter Cards in Liquid Glass */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setSelectedSeverity(selectedSeverity === 'critical' ? 'all' : 'critical')}
          className={`liquid-glass p-5 rounded-2xl cursor-pointer transition-all border ${
            selectedSeverity === 'critical'
              ? 'border-palette-magenta shadow-glow-violet bg-palette-royal/15'
              : 'border-white/10 hover:border-palette-magenta/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-palette-magenta uppercase tracking-wider">
              Critical Shortage (&lt; 7 Days)
            </span>
            <span className="font-mono text-lg font-bold text-palette-magenta">
              {mockMaterialRisks.filter((m) => m.daysOfCoverage < 7).length}
            </span>
          </div>
          <p className="text-xs text-white/60 mt-1">Immediate line stoppage risk</p>
        </div>

        <div
          onClick={() => setSelectedSeverity(selectedSeverity === 'warning' ? 'all' : 'warning')}
          className={`liquid-glass p-5 rounded-2xl cursor-pointer transition-all border ${
            selectedSeverity === 'warning'
              ? 'border-palette-cerulean shadow-[0_0_20px_rgba(0,124,184,0.35)] bg-palette-cobalt/15'
              : 'border-white/10 hover:border-palette-cerulean/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-palette-cerulean uppercase tracking-wider">
              Buffer Warning (7–14 Days)
            </span>
            <span className="font-mono text-lg font-bold text-palette-cerulean">
              {mockMaterialRisks.filter((m) => m.daysOfCoverage >= 7 && m.daysOfCoverage <= 14).length}
            </span>
          </div>
          <p className="text-xs text-white/60 mt-1">Accelerated burn or delayed POs</p>
        </div>

        <div
          onClick={() => setSelectedSeverity(selectedSeverity === 'healthy' ? 'all' : 'healthy')}
          className={`liquid-glass p-5 rounded-2xl cursor-pointer transition-all border ${
            selectedSeverity === 'healthy'
              ? 'border-palette-cyan shadow-glow-cyan bg-palette-indigo/15'
              : 'border-white/10 hover:border-palette-cyan/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-palette-cyan uppercase tracking-wider">
              Healthy Stock (&gt; 14 Days)
            </span>
            <span className="font-mono text-lg font-bold text-palette-cyan">
              {mockMaterialRisks.filter((m) => m.daysOfCoverage > 14).length}
            </span>
          </div>
          <p className="text-xs text-white/60 mt-1">Optimal manufacturing buffer</p>
        </div>
      </div>

      {/* Projection Chart */}
      <ChartPanel
        title="Plant Alpha Aggregate Inventory Depletion vs Demand"
        subtitle="Forward 30-day projection with automated consumption variance"
      >
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={inventoryCoverageDemandData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="invGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0FD3F2" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#0FD3F2" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,211,242,0.08)" />
            <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
            <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
            <Tooltip content={<CustomChartTooltip valueSuffix=" units" />} />
            <Area
              type="monotone"
              dataKey="currentStock"
              name="Factory On-Hand Stock"
              stroke="#0FD3F2"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#invGrad)"
            />
            <Line
              type="monotone"
              dataKey="projectedDemand"
              name="Planned Consumption"
              stroke="#007CB8"
              strokeWidth={2}
              dot={{ fill: '#007CB8', r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="safetyThreshold"
              name="Minimum Safe Threshold"
              stroke="#921CC0"
              strokeDasharray="4 4"
              strokeWidth={1.5}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartPanel>

      {/* Search Input Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-80">
          <InsetInput
            placeholder="Search component by SKU or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <span className="text-xs text-white/50 font-mono">
          Showing {filteredMaterials.length} monitored SKUs
        </span>
      </div>

      {/* Materials Table */}
      <GlassTable
        columns={columns}
        data={filteredMaterials}
        keyExtractor={(m) => m.id}
        onRowClick={(m) => setSelectedMaterial(m)}
        emptyMessage="No material components match your filter criteria."
      />

      {/* Material Detail Drawer */}
      <ModalDrawer
        isOpen={!!selectedMaterial}
        onClose={() => setSelectedMaterial(null)}
        title={selectedMaterial?.name || 'Material Details'}
        subtitle={`SKU: ${selectedMaterial?.sku} • Category: ${selectedMaterial?.category}`}
        width="max-w-2xl"
        footer={
          <>
            <NeumorphicButton
              variant="ghost"
              size="md"
              onClick={() => setSelectedMaterial(null)}
            >
              Close
            </NeumorphicButton>
            <NeumorphicButton
              variant="primary"
              size="md"
              leftIcon={<Sparkles className="w-4 h-4" />}
              onClick={() => navigate('/recommendations')}
            >
              Find Alternative Supplier
            </NeumorphicButton>
          </>
        }
      >
        {selectedMaterial && (
          <div className="space-y-6">
            {/* Risk Assessment Box */}
            <div className="p-4 rounded-2xl liquid-glass border border-white/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-white/60">
                  AI Risk Exposure Score
                </span>
                <span className="font-mono text-base font-medium text-white">
                  {selectedMaterial.riskScore} / 100
                </span>
              </div>
              <div className="h-2 w-full bg-black/60 rounded-full overflow-hidden border border-white/10">
                <div
                  className={`h-full rounded-full ${
                    selectedMaterial.riskScore > 80
                      ? 'bg-gradient-to-r from-palette-royal to-palette-magenta shadow-[0_0_10px_rgba(146,28,192,0.6)]'
                      : selectedMaterial.riskScore > 50
                      ? 'bg-gradient-to-r from-palette-cobalt to-palette-cerulean'
                      : 'bg-gradient-to-r from-palette-cerulean to-palette-cyan shadow-[0_0_10px_rgba(15,211,242,0.6)]'
                  }`}
                  style={{ width: `${selectedMaterial.riskScore}%` }}
                />
              </div>
              <p className="text-xs text-white/65 leading-relaxed">
                Calculated using daily consumption burn rate ({selectedMaterial.dailyBurnRate} {selectedMaterial.unit}/day), supplier lead time ({selectedMaterial.leadTimeDays} days), and cross-strait transit deviations.
              </p>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
                <span className="text-[11px] text-white/50 block font-mono">Current On-Hand</span>
                <span className="font-mono font-medium text-sm text-palette-cyan mt-1 block">
                  {selectedMaterial.currentStock.toLocaleString()} {selectedMaterial.unit}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
                <span className="text-[11px] text-white/50 block font-mono">Daily Burn Rate</span>
                <span className="font-mono font-medium text-sm text-white mt-1 block">
                  {selectedMaterial.dailyBurnRate} {selectedMaterial.unit} / day
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
                <span className="text-[11px] text-white/50 block font-mono">Days of Coverage</span>
                <span className={`font-mono font-bold text-sm mt-1 block ${
                  selectedMaterial.daysOfCoverage < 7 ? 'text-palette-magenta' : selectedMaterial.daysOfCoverage <= 14 ? 'text-palette-cerulean' : 'text-palette-cyan'
                }`}>
                  {selectedMaterial.daysOfCoverage} Days
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
                <span className="text-[11px] text-white/50 block font-mono">Unit Cost</span>
                <span className="font-mono font-medium text-sm text-white mt-1 block">
                  ${selectedMaterial.unitCost.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Impacted Production Lines */}
            <div className="p-4 rounded-2xl liquid-glass space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-white flex items-center gap-2">
                <Factory className="w-4 h-4 text-white/70" />
                Impacted Manufacturing Cells
              </h4>
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedMaterial.impactedProductionLines.map((line) => (
                  <span
                    key={line}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-white/[0.08] border border-white/10 text-white"
                  >
                    {line}
                  </span>
                ))}
              </div>
            </div>

            {/* Sourcing Info */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
              <span className="text-[11px] text-white/50 block font-mono">Current Primary Supplier</span>
              <p className="font-medium text-sm text-white">{selectedMaterial.primarySupplier}</p>
              <p className="text-xs text-white/60">
                {selectedMaterial.alternateSuppliersAvailable} pre-qualified alternates available in AVL network.
              </p>
            </div>
          </div>
        )}
      </ModalDrawer>
    </div>
  );
};
