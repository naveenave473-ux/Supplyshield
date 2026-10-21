import React, { useState, useMemo } from 'react';
import {
  Search,
  Truck,
  AlertTriangle,
  Send,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/common/PageHeader';
import { GlassPanel } from '../components/common/GlassPanel';
import { GlassTable, Column } from '../components/common/GlassTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { InsetInput } from '../components/common/InsetInput';
import { NeumorphicButton } from '../components/common/NeumorphicButton';
import { ModalDrawer } from '../components/common/ModalDrawer';
import { mockPurchaseOrders } from '../data/mockData';
import { PurchaseOrder, POStatus } from '../types';

export const PurchaseOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | POStatus>('all');
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [sortColumn, setSortColumn] = useState<string>('orderDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filteredOrders = useMemo(() => {
    return mockPurchaseOrders
      .filter((po) => {
        const matchesSearch =
          po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          po.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          po.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          po.itemCode.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
          statusFilter === 'all' ? true : po.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const aVal = (a as unknown as Record<string, unknown>)[sortColumn];
        const bVal = (b as unknown as Record<string, unknown>)[sortColumn];

        if (typeof aVal === 'string') {
          return sortDirection === 'asc'
            ? (aVal as string).localeCompare(bVal as string)
            : (bVal as string).localeCompare(aVal as string);
        }
        if (typeof aVal === 'number') {
          return sortDirection === 'asc'
            ? (aVal as number) - (bVal as number)
            : (bVal as number) - (aVal as number);
        }
        return 0;
      });
  }, [searchQuery, statusFilter, sortColumn, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (colKey: string) => {
    if (sortColumn === colKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(colKey);
      setSortDirection('asc');
    }
  };

  const statusTabs: Array<{ id: 'all' | POStatus; label: string; count: number }> = [
    { id: 'all', label: 'All Orders', count: mockPurchaseOrders.length },
    {
      id: 'critical',
      label: 'Critical',
      count: mockPurchaseOrders.filter((p) => p.status === 'critical').length,
    },
    {
      id: 'delayed',
      label: 'Delayed',
      count: mockPurchaseOrders.filter((p) => p.status === 'delayed').length,
    },
    {
      id: 'on_track',
      label: 'On Track',
      count: mockPurchaseOrders.filter((p) => p.status === 'on_track').length,
    },
    {
      id: 'received',
      label: 'Received',
      count: mockPurchaseOrders.filter((p) => p.status === 'received').length,
    },
  ];

  const columns: Column<PurchaseOrder>[] = [
    {
      key: 'poNumber',
      header: 'PO Number / Item',
      sortable: true,
      render: (po) => (
        <div>
          <span className="font-mono font-bold text-xs text-white group-hover:text-primary transition-colors block">
            {po.poNumber}
          </span>
          <span className="text-xs text-[#BEC7D5] truncate max-w-[200px] block font-medium">
            {po.itemName}
          </span>
          <span className="text-[10px] text-[#BEC7D5]/70 font-mono">{po.itemCode}</span>
        </div>
      ),
    },
    {
      key: 'supplierName',
      header: 'Supplier',
      sortable: true,
      render: (po) => (
        <span className="text-xs text-white font-medium block">{po.supplierName}</span>
      ),
    },
    {
      key: 'quantity',
      header: 'Quantity',
      sortable: true,
      render: (po) => (
        <span className="font-mono text-xs text-white">
          {po.quantity.toLocaleString()} <span className="text-[#BEC7D5]/70">{po.unit}</span>
        </span>
      ),
    },
    {
      key: 'totalValue',
      header: 'Value ($)',
      sortable: true,
      render: (po) => (
        <span className="font-mono text-xs font-semibold text-white">
          ${po.totalValue.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'revisedDeliveryDate',
      header: 'Dock ETA',
      sortable: true,
      render: (po) => {
        const isDelayed = po.status === 'delayed' || po.status === 'critical';
        return (
          <div className="font-mono text-xs">
            <span className={isDelayed ? 'text-[#921CC0] font-bold' : 'text-[#B7F000]'}>
              {po.revisedDeliveryDate}
            </span>
            {isDelayed && (
              <span className="text-[10px] text-[#BEC7D5]/60 block line-through">
                {po.expectedDeliveryDate}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: 'deliveryProgress',
      header: 'Fulfillment',
      render: (po) => (
        <div className="space-y-1 min-w-[90px]">
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-white">{po.deliveryProgress}%</span>
          </div>
          <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                po.status === 'critical'
                  ? 'bg-[#921CC0] shadow-[0_0_8px_rgba(146,28,192,0.8)]'
                  : po.status === 'delayed'
                  ? 'bg-[#F59E0B]'
                  : 'bg-[#B7F000] shadow-[0_0_8px_rgba(183,240,0,0.6)]'
              }`}
              style={{ width: `${po.deliveryProgress}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (po) => <StatusBadge status={po.status} size="sm" />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={['SupplyShield', 'Procurement Orders']}
        title="Purchase Orders Intelligence"
        subtitle="Real-time tracking of active shipments, delivery deviations, and carrier milestone telemetries."
      />

      {/* Filter and Search Bar */}
      <GlassPanel className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Segmented Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl neu-segmented-container overflow-x-auto w-full md:w-auto">
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setStatusFilter(tab.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'neu-raised text-primary bg-[#171665] border border-primary/30 shadow-sm'
                  : 'text-[#BEC7D5] hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 text-white font-mono">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="w-full md:w-80">
          <InsetInput
            placeholder="Filter by PO, item, or supplier..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            onClear={() => setSearchQuery('')}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
      </GlassPanel>

      {/* Orders Table */}
      <div className="space-y-4">
        <GlassTable
          columns={columns}
          data={paginatedOrders}
          keyExtractor={(po) => po.id}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          onRowClick={(po) => setSelectedPO(po)}
          emptyMessage="No purchase orders match your filter criteria."
        />

        {/* Pagination Bar */}
        <div className="flex items-center justify-between px-2 text-xs text-[#BEC7D5]">
          <span>
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, filteredOrders.length)} of{' '}
            {filteredOrders.length} orders
          </span>

          <div className="flex items-center gap-2">
            <NeumorphicButton
              variant="raised"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Previous
            </NeumorphicButton>
            <span className="font-mono text-white px-2">
              Page {currentPage} of {totalPages}
            </span>
            <NeumorphicButton
              variant="raised"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </NeumorphicButton>
          </div>
        </div>
      </div>

      {/* Order Detail Drawer */}
      <ModalDrawer
        isOpen={!!selectedPO}
        onClose={() => setSelectedPO(null)}
        title={selectedPO?.poNumber || 'Purchase Order Details'}
        subtitle={`Supplier: ${selectedPO?.supplierName} • Destination: ${selectedPO?.destinationFacility}`}
        width="max-w-2xl"
        footer={
          <>
            <NeumorphicButton
              variant="ghost"
              size="md"
              onClick={() => setSelectedPO(null)}
            >
              Close
            </NeumorphicButton>
            <NeumorphicButton
              variant="primary"
              size="md"
              leftIcon={<Send className="w-4 h-4" />}
              onClick={() => {
                if (selectedPO) {
                  navigate(`/communications?supplier=${encodeURIComponent(selectedPO.supplierName)}&po=${selectedPO.poNumber}`);
                }
              }}
            >
              Expedite In Communications
            </NeumorphicButton>
          </>
        }
      >
        {selectedPO && (
          <div className="space-y-6">
            {/* Status & Risk Alert Banner */}
            <div
              className={`p-4 rounded-2xl border flex items-start gap-3 ${
                selectedPO.status === 'critical'
                  ? 'bg-[#921CC0]/20 border-[#921CC0]/40 text-[#921CC0]'
                  : selectedPO.status === 'delayed'
                  ? 'bg-[#F59E0B]/15 border-[#F59E0B]/35 text-[#FBBF24]'
                  : 'bg-[#B7F000]/15 border-[#B7F000]/35 text-[#B7F000]'
              }`}
            >
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2 font-bold text-sm">
                  <span>Status:</span>
                  <StatusBadge status={selectedPO.status} size="sm" />
                </div>
                {selectedPO.delayReason ? (
                  <p className="text-xs mt-1 text-white leading-relaxed">
                    <strong>Identified Delay Root Cause:</strong> {selectedPO.delayReason}
                  </p>
                ) : (
                  <p className="text-xs mt-1 text-white">
                    All transit waypoints are progressing according to SLA schedule.
                  </p>
                )}
              </div>
            </div>

            {/* Grid of Key Specifications */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl neu-inset">
                <span className="text-[11px] text-[#BEC7D5] uppercase tracking-wider block">
                  Material Item
                </span>
                <span className="font-bold text-sm text-white mt-1 block">
                  {selectedPO.itemName}
                </span>
                <span className="text-xs font-mono text-[#BEC7D5]/70">{selectedPO.itemCode}</span>
              </div>

              <div className="p-3.5 rounded-xl neu-inset">
                <span className="text-[11px] text-[#BEC7D5] uppercase tracking-wider block">
                  Total Order Value
                </span>
                <span className="font-bold text-base font-mono text-white mt-1 block">
                  ${selectedPO.totalValue.toLocaleString()}
                </span>
                <span className="text-xs text-[#BEC7D5]">
                  {selectedPO.quantity.toLocaleString()} {selectedPO.unit} @ ${selectedPO.unitPrice}/{selectedPO.unit}
                </span>
              </div>

              <div className="p-3.5 rounded-xl neu-inset">
                <span className="text-[11px] text-[#BEC7D5] uppercase tracking-wider block">
                  Original Dock Date
                </span>
                <span className="font-mono text-sm text-white mt-1 block">
                  {selectedPO.expectedDeliveryDate}
                </span>
              </div>

              <div className="p-3.5 rounded-xl neu-inset">
                <span className="text-[11px] text-[#BEC7D5] uppercase tracking-wider block">
                  Revised Expected Dock
                </span>
                <span className="font-mono text-sm text-[#921CC0] font-bold mt-1 block">
                  {selectedPO.revisedDeliveryDate}
                </span>
              </div>
            </div>

            {/* Carrier & Tracking Logistics Section */}
            <div className="p-4 rounded-2xl glass-card space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-primary" />
                Freight Carrier Telemetry
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#BEC7D5] block">Freight Carrier</span>
                  <span className="font-medium text-white">{selectedPO.carrier}</span>
                </div>
                <div>
                  <span className="text-[#BEC7D5] block">Tracking Waybill #</span>
                  <span className="font-mono text-primary font-bold">{selectedPO.trackingNumber}</span>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#BEC7D5]">Transit Milestone Completion</span>
                  <span className="font-mono text-white">{selectedPO.deliveryProgress}%</span>
                </div>
                <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500 shadow-[0_0_8px_rgba(45,226,230,0.6)]"
                    style={{ width: `${selectedPO.deliveryProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* AI Recommendation Shortcut */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-secondary/20 to-primary/10 border border-secondary/35 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-secondary" />
                <div>
                  <h5 className="text-xs font-bold text-white">AI Alternate Sourcing Available</h5>
                  <p className="text-[11px] text-[#BEC7D5]">
                    Mitigate delivery gap with pre-screened alternative vendor.
                  </p>
                </div>
              </div>
              <NeumorphicButton
                variant="raised"
                size="sm"
                onClick={() => navigate('/recommendations')}
              >
                View Alternate
              </NeumorphicButton>
            </div>
          </div>
        )}
      </ModalDrawer>
    </div>
  );
};
