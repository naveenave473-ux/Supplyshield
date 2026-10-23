import React, { useState } from 'react';
import {
  Search,
  LayoutGrid,
  List,
  MapPin,
  Send,
  Building2,
  ShieldAlert,
  Clock,
  DollarSign,
  Award,
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
          <span className="font-semibold text-xs text-white group-hover:text-white transition-colors block">
            {s.name}
          </span>
          <span className="text-[11px] text-white/60">{s.category}</span>
          <span className="text-[10px] text-white/40 block font-mono">
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
        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-full bg-[#0FD3F2]/10 text-[#0FD3F2] border border-[#0FD3F2]/30">
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
                isLow ? 'text-[#921CC0]' : 'text-[#0FD3F2]'
              }`}
            >
              {s.onTimeDeliveryRate}%
            </span>
            <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  isLow ? 'bg-[#921CC0] shadow-[0_0_8px_rgba(146,28,192,0.5)]' : 'bg-[#0FD3F2] shadow-[0_0_8px_rgba(15,211,242,0.5)]'
                }`}
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
      render: (s) => {
        const isHigh = s.capacityUtilization > 90;
        return (
          <div className="space-y-1 min-w-[90px]">
            <span
              className={`font-mono text-xs font-medium ${
                isHigh ? 'text-[#921CC0]' : 'text-[#007CB8]'
              }`}
            >
              {s.capacityUtilization}%
            </span>
            <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  isHigh ? 'bg-[#921CC0] shadow-[0_0_8px_rgba(146,28,192,0.5)]' : 'bg-[#007CB8] shadow-[0_0_8px_rgba(0,124,184,0.5)]'
                }`}
                style={{ width: `${s.capacityUtilization}%` }}
              />
            </div>
          </div>
        );
      },
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

      {/* Control Bar: Risk Tabs, Search, and View Toggle */}
      <GlassPanel className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Risk Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/10 overflow-x-auto w-full md:w-auto">
          {(['all', 'critical', 'high', 'medium', 'low'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setRiskFilter(lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-150 ${
                riskFilter === lvl
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-white/70 hover:text-white hover:bg-white/[0.04]'
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
              leftIcon={<Search className="w-4 h-4 text-white/40" />}
            />
          </div>

          <div className="flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/10 flex-shrink-0">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'cards'
                  ? 'bg-white text-black font-semibold'
                  : 'text-white/70 hover:text-white'
              }`}
              title="Card view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-black font-semibold'
                  : 'text-white/70 hover:text-white'
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
              className="flex flex-col justify-between group p-6"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="font-semibold text-base text-white group-hover:text-white/90 transition-colors">
                      {supplier.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-white/60 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-white/50 flex-shrink-0" />
                      <span>{supplier.location}, {supplier.country}</span>
                    </div>
                  </div>
                  <StatusBadge status={supplier.riskLevel} size="sm" />
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-white border border-white/10">
                    Tier {supplier.tier}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-white/90 border border-white/10">
                    Rating: {supplier.financialStabilityRating}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-white/60">
                    Lead: {supplier.leadTimeDays}d
                  </span>
                </div>

                {/* Progress Gauges */}
                <div className="space-y-3 mt-5 pt-4 border-t border-white/[0.06]">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/60">On-Time Delivery</span>
                      <span
                        className={`font-mono font-bold ${
                          supplier.onTimeDeliveryRate < 80 ? 'text-risk-critical' : 'text-risk-low'
                        }`}
                      >
                        {supplier.onTimeDeliveryRate}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          supplier.onTimeDeliveryRate < 80 ? 'bg-risk-critical' : 'bg-risk-low'
                        }`}
                        style={{ width: `${supplier.onTimeDeliveryRate}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/60">Capacity Utilization</span>
                      <span className={`font-mono text-xs ${supplier.capacityUtilization > 90 ? 'text-risk-warning font-semibold' : 'text-white'}`}>
                        {supplier.capacityUtilization}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          supplier.capacityUtilization > 90 ? 'bg-risk-warning' : 'bg-white/60'
                        }`}
                        style={{ width: `${supplier.capacityUtilization}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Supported Materials Chips */}
                <div className="mt-4 pt-3 border-t border-white/[0.06]">
                  <span className="text-[10px] text-white/50 uppercase tracking-wider block mb-1.5">
                    Qualified Materials
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {supplier.supportedMaterials.map((mat) => (
                      <span
                        key={mat}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.04] text-white/80 border border-white/10"
                      >
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-white/50 font-mono">
                  Spend: ${(supplier.totalSpend / 1000).toFixed(0)}k
                </span>
                <span className="text-white font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
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
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-white/60 block">Risk Classification</span>
                <div className="mt-1">
                  <StatusBadge status={selectedSupplier.riskLevel} />
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-white/60 block">Financial Rating</span>
                <span className="font-mono text-base font-bold text-white">
                  {selectedSupplier.financialStabilityRating}
                </span>
              </div>
            </div>

            {/* Contact Person Box */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/80 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-white/60" />
                Primary Account Representative
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-white/60 block">Contact Representative</span>
                  <span className="font-medium text-white">{selectedSupplier.contactName}</span>
                </div>
                <div>
                  <span className="text-white/60 block">Direct Sourcing Email</span>
                  <span className="font-mono text-white font-medium">{selectedSupplier.contactEmail}</span>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center gap-1.5 text-white/60 mb-1">
                  <Award className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-medium uppercase tracking-wider">
                    On-Time Delivery Rate
                  </span>
                </div>
                <span className={`font-mono font-bold text-lg block ${selectedSupplier.onTimeDeliveryRate < 80 ? 'text-risk-critical' : 'text-risk-low'}`}>
                  {selectedSupplier.onTimeDeliveryRate}%
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center gap-1.5 text-white/60 mb-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-medium uppercase tracking-wider">
                    Quality Acceptance Score
                  </span>
                </div>
                <span className="font-mono font-bold text-lg text-white block">
                  {selectedSupplier.qualityScore}%
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center gap-1.5 text-white/60 mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-medium uppercase tracking-wider">
                    Average Factory Lead Time
                  </span>
                </div>
                <span className="font-mono font-bold text-lg text-white block">
                  {selectedSupplier.leadTimeDays} Calendar Days
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center gap-1.5 text-white/60 mb-1">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-medium uppercase tracking-wider">
                    Annual Spend Commitment
                  </span>
                </div>
                <span className="font-mono font-bold text-lg text-white block">
                  ${selectedSupplier.totalSpend.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Supported Parts */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
              <span className="text-[11px] font-medium uppercase tracking-wider text-white/80 block">
                Supported Bill of Materials (BOM)
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedSupplier.supportedMaterials.map((mat) => (
                  <span
                    key={mat}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-white/[0.06] text-white border border-white/10"
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
