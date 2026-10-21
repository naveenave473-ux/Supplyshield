import React, { useState } from 'react';
import {
  Search,
  LayoutGrid,
  List,
  MapPin,
  Send,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/common/PageHeader';
import { GlassPanel } from '../components/common/GlassPanel';
import { GlassCard } from '../components/common/GlassCard';
import { GlassTable, Column } from '../components/common/GlassTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { InsetInput } from '../components/common/InsetInput';
import { NeumorphicButton } from '../components/common/NeumorphicButton';
import { ModalDrawer } from '../components/common/ModalDrawer';
import { mockSuppliers } from '../data/mockData';
import { Supplier, RiskLevel } from '../types';

export const SuppliersPage: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | RiskLevel>('all');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const filteredSuppliers = mockSuppliers.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.supportedMaterials.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRisk = riskFilter === 'all' ? true : s.riskLevel === riskFilter;

    return matchesSearch && matchesRisk;
  });

  const columns: Column<Supplier>[] = [
    {
      key: 'name',
      header: 'Supplier / Category',
      sortable: true,
      render: (s) => (
        <div>
          <span className="font-bold text-xs text-white group-hover:text-primary transition-colors block">
            {s.name}
          </span>
          <span className="text-[11px] text-[#BEC7D5]">{s.category}</span>
          <span className="text-[10px] text-[#BEC7D5]/70 block font-mono">
            {s.location}, {s.country}
          </span>
        </div>
      ),
    },
    {
      key: 'tier',
      header: 'Tier',
      sortable: true,
      render: (s) => (
        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-full bg-white/[0.06] text-white">
          Tier {s.tier}
        </span>
      ),
    },
    {
      key: 'onTimeDeliveryRate',
      header: 'On-Time SLA',
      sortable: true,
      render: (s) => {
        const isLow = s.onTimeDeliveryRate < 80;
        return (
          <div className="space-y-1 min-w-[90px]">
            <span
              className={`font-mono text-xs font-bold ${
                isLow ? 'text-[#921CC0]' : 'text-[#B7F000]'
              }`}
            >
              {s.onTimeDeliveryRate}%
            </span>
            <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${isLow ? 'bg-[#921CC0] shadow-[0_0_8px_rgba(146,28,192,0.8)]' : 'bg-[#B7F000] shadow-[0_0_8px_rgba(183,240,0,0.6)]'}`}
                style={{ width: `${s.onTimeDeliveryRate}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: 'capacityUtilization',
      header: 'Capacity Load',
      sortable: true,
      render: (s) => (
        <span className="font-mono text-xs text-white">
          {s.capacityUtilization}%
        </span>
      ),
    },
    {
      key: 'leadTimeDays',
      header: 'Lead Time',
      sortable: true,
      render: (s) => (
        <span className="font-mono text-xs text-white">
          {s.leadTimeDays} days
        </span>
      ),
    },
    {
      key: 'riskLevel',
      header: 'Risk Level',
      sortable: true,
      render: (s) => <StatusBadge status={s.riskLevel} size="sm" />,
    },
    {
      key: 'action',
      header: 'Action',
      align: 'right',
      render: (s) => (
        <NeumorphicButton
          variant="raised"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedSupplier(s);
          }}
        >
          Profile
        </NeumorphicButton>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={['SupplyShield', 'Vendor Network']}
        title="Supplier Portfolio & Performance Audit"
        subtitle="Tier-1 and Tier-2 vendor intelligence with capacity utilization, SLA delivery fulfillment, and geopolitical exposure."
      />

      {/* Control Bar: Search, Risk Tabs, and View Toggle */}
      <GlassPanel className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Risk Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl neu-segmented-container overflow-x-auto w-full md:w-auto">
          {(['all', 'critical', 'high', 'medium', 'low'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setRiskFilter(lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-150 ${
                riskFilter === lvl
                  ? 'neu-raised text-primary bg-[#1D0445] border border-primary/30 shadow-sm'
                  : 'text-[#CBD5E1] hover:text-white'
              }`}
            >
              {lvl === 'all' ? 'All Vendors' : `${lvl} Risk`}
            </button>
          ))}
        </div>

        {/* Search & Toggle */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-full md:w-72">
            <InsetInput
              placeholder="Filter by vendor, material, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="flex items-center p-1 rounded-xl neu-segmented-container flex-shrink-0">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'cards'
                  ? 'neu-raised text-primary bg-[#1D0445]'
                  : 'text-[#CBD5E1] hover:text-white'
              }`}
              title="Card view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'neu-raised text-primary bg-[#1D0445]'
                  : 'text-[#CBD5E1] hover:text-white'
              }`}
              title="Table view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </GlassPanel>

      {/* Content Rendering: Cards or Table */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSuppliers.map((supplier) => (
            <GlassCard
              key={supplier.id}
              interactive
              onClick={() => setSelectedSupplier(supplier)}
              className="flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="font-bold text-base text-white hover:text-primary transition-colors">
                      {supplier.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#CBD5E1] mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <span>{supplier.location}, {supplier.country}</span>
                    </div>
                  </div>
                  <StatusBadge status={supplier.riskLevel} size="sm" />
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-white">
                    Tier {supplier.tier}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                    Rating: {supplier.financialStabilityRating}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-[#CBD5E1]">
                    Lead: {supplier.leadTimeDays}d
                  </span>
                </div>

                {/* Progress Gauges */}
                <div className="space-y-2.5 mt-5 pt-4 border-t border-white/[0.06]">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#CBD5E1]">On-Time Delivery</span>
                      <span
                        className={`font-mono font-bold ${
                          supplier.onTimeDeliveryRate < 80 ? 'text-[#921CC0]' : 'text-[#0FD3F2]'
                        }`}
                      >
                        {supplier.onTimeDeliveryRate}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          supplier.onTimeDeliveryRate < 80 ? 'bg-[#921CC0] shadow-[0_0_8px_rgba(146,28,192,0.8)]' : 'bg-[#0FD3F2] shadow-[0_0_8px_rgba(15,211,242,0.6)]'
                        }`}
                        style={{ width: `${supplier.onTimeDeliveryRate}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#CBD5E1]">Capacity Utilization</span>
                      <span className="font-mono text-white">{supplier.capacityUtilization}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          supplier.capacityUtilization > 90 ? 'bg-[#921CC0]' : 'bg-[#007CB8]'
                        }`}
                        style={{ width: `${supplier.capacityUtilization}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Supported Materials Chips */}
                <div className="mt-4 pt-3 border-t border-white/[0.06]">
                  <span className="text-[10px] text-[#BEC7D5]/70 uppercase tracking-wider block mb-1.5">
                    Qualified Materials
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {supplier.supportedMaterials.map((mat) => (
                      <span
                        key={mat}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.04] text-[#BEC7D5] border border-white/[0.06]"
                      >
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-[#BEC7D5]/70 font-mono">
                  Spend: ${(supplier.totalSpend / 1000).toFixed(0)}k
                </span>
                <span className="text-primary hover:text-white font-medium flex items-center gap-1">
                  Inspect Profile &rarr;
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <GlassTable
          columns={columns}
          data={filteredSuppliers}
          keyExtractor={(s) => s.id}
          onRowClick={(s) => setSelectedSupplier(s)}
        />
      )}

      {/* Supplier Profile Drawer */}
      <ModalDrawer
        isOpen={!!selectedSupplier}
        onClose={() => setSelectedSupplier(null)}
        title={selectedSupplier?.name || 'Supplier Profile'}
        subtitle={`Vendor Code: ${selectedSupplier?.code} • Location: ${selectedSupplier?.location}, ${selectedSupplier?.country}`}
        width="max-w-2xl"
        footer={
          <>
            <NeumorphicButton
              variant="ghost"
              size="md"
              onClick={() => setSelectedSupplier(null)}
            >
              Close
            </NeumorphicButton>
            <NeumorphicButton
              variant="primary"
              size="md"
              leftIcon={<Send className="w-4 h-4" />}
              onClick={() => {
                if (selectedSupplier) {
                  navigate(`/communications?supplier=${encodeURIComponent(selectedSupplier.name)}`);
                }
              }}
            >
              Compose Communication
            </NeumorphicButton>
          </>
        }
      >
        {selectedSupplier && (
          <div className="space-y-6">
            {/* Risk Overview Card */}
            <div className="p-4 rounded-2xl neu-raised border border-white/[0.08] flex items-center justify-between">
              <div>
                <span className="text-xs text-[#BEC7D5] block">Risk Classification</span>
                <div className="mt-1">
                  <StatusBadge status={selectedSupplier.riskLevel} />
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#BEC7D5] block">Financial Rating</span>
                <span className="font-mono text-base font-bold text-white">
                  {selectedSupplier.financialStabilityRating}
                </span>
              </div>
            </div>

            {/* Contact Person Box */}
            <div className="p-4 rounded-2xl glass-card space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Primary Account Representative
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#BEC7D5] block">Contact Representative</span>
                  <span className="font-medium text-white">{selectedSupplier.contactName}</span>
                </div>
                <div>
                  <span className="text-[#BEC7D5] block">Direct Sourcing Email</span>
                  <span className="font-mono text-primary font-medium">{selectedSupplier.contactEmail}</span>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl neu-inset border border-white/10">
                <span className="text-[11px] font-tech font-bold uppercase tracking-wider text-[#CBD5E1] block">
                  On-Time Delivery Rate
                </span>
                <span className="font-mono font-black text-base text-white mt-1 block">
                  {selectedSupplier.onTimeDeliveryRate}%
                </span>
              </div>

              <div className="p-4 rounded-xl neu-inset border border-white/10">
                <span className="text-[11px] font-tech font-bold uppercase tracking-wider text-[#CBD5E1] block">
                  Quality Acceptance Score
                </span>
                <span className="font-mono font-black text-base text-[#0FD3F2] mt-1 block">
                  {selectedSupplier.qualityScore}%
                </span>
              </div>

              <div className="p-4 rounded-xl neu-inset border border-white/10">
                <span className="text-[11px] font-tech font-bold uppercase tracking-wider text-[#CBD5E1] block">
                  Average Factory Lead Time
                </span>
                <span className="font-mono font-black text-base text-[#0FD3F2] mt-1 block">
                  {selectedSupplier.leadTimeDays} Calendar Days
                </span>
              </div>

              <div className="p-4 rounded-xl neu-inset border border-white/10">
                <span className="text-[11px] font-tech font-bold uppercase tracking-wider text-[#CBD5E1] block">
                  Annual Spend Commitment
                </span>
                <span className="font-mono font-black text-base text-white mt-1 block">
                  ${selectedSupplier.totalSpend.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Supported Parts */}
            <div className="p-4 rounded-2xl neu-inset border border-white/10 space-y-2.5">
              <span className="text-[11px] font-tech font-bold uppercase tracking-wider text-white block">
                Supported Bill of Materials (BOM)
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedSupplier.supportedMaterials.map((mat) => (
                  <span
                    key={mat}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#1D0445] text-[#F1F5F9] border border-white/15 shadow-sm"
                  >
                    {mat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </ModalDrawer>
    </div>
  );
};
