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
          <span className="font-mono font-medium text-xs text-white group-hover:text-white transition-colors block">
            {po.poNumber}
          </span>
          <span className="text-xs text-white/70 truncate max-w-[200px] block font-normal">
            {po.itemName}
          </span>
          <span className="text-[10px] text-white/40 font-mono">{po.itemCode}</span>
        </div>
      ),
    },
    {
      key: 'supplierName',
      header: 'Supplier',
      sortable: true,
      render: (po) => (
        <span className="text-xs text-white font-normal block">{po.supplierName}</span>
      ),
    },
    {
      key: 'quantity',
      header: 'Quantity',
      sortable: true,
      render: (po) => (
        <span className="font-mono text-xs text-white">
          {po.quantity.toLocaleString()} <span className="text-white/50">{po.unit}</span>
        </span>
      ),
    },
    {
      key: 'totalValue',
      header: 'Value ($)',
      sortable: true,
      render: (po) => (
        <span className="font-mono text-xs font-medium text-white">
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
            <span className={isDelayed ? (po.status === 'critical' ? 'text-[#921CC0] font-medium' : 'text-[#007CB8] font-medium') : 'text-[#0FD3F2]'}>
              {po.revisedDeliveryDate}
            </span>
            {isDelayed && (
              <span className="text-[10px] text-white/40 block line-through">
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
            <span className="text-white/80">{po.deliveryProgress}%</span>
          </div>
          <div className="h-1.5 w-full bg-black/60 rounded-full overflow-hidden border border-white/10">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                po.status === 'critical'
                  ? 'bg-[#921CC0] shadow-[0_0_8px_rgba(146,28,192,0.6)]'
                  : po.status === 'delayed'
                  ? 'bg-[#007CB8] shadow-[0_0_8px_rgba(0,124,184,0.6)]'
                  : 'bg-[#0FD3F2] shadow-[0_0_8px_rgba(15,211,242,0.6)]'
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
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
      <PageHeader
        breadcrumbs={['SupplyShield', 'Procurement Orders']}
        title="Purchase Orders Intelligence"
        subtitle="Real-time tracking of active shipments, delivery deviations, and carrier milestone telemetries."
      />

      {/* Filter and Search Bar */}
      <GlassPanel className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Segmented Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10 overflow-x-auto w-full md:w-auto">
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setStatusFilter(tab.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-gradient-to-r from-[#0FD3F2] to-[#007CB8] text-[#06040A] font-bold shadow-[0_2px_12px_rgba(15,211,242,0.4)]'
                  : 'text-white/65 hover:text-[#0FD3F2]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                statusFilter === tab.id ? 'bg-black/20 text-[#06040A]' : 'bg-white/10 text-white/70'
              }`}>
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
        <div className="flex items-center justify-between px-2 text-xs text-white/60">
          <span>
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, filteredOrders.length)} of{' '}
            {filteredOrders.length} orders
          </span>

          <div className="flex items-center gap-2">
            <NeumorphicButton
              variant="secondary"
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
              variant="secondary"
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
                  ? 'bg-[#FF6B6B]/10 border-[#FF6B6B]/30 text-[#FF6B6B]'
                  : selectedPO.status === 'delayed'
                  ? 'bg-[#E5A53D]/10 border-[#E5A53D]/30 text-[#E5A53D]'
                  : 'bg-[#3DD598]/10 border-[#3DD598]/30 text-[#3DD598]'
              }`}
            >
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2 font-medium text-sm text-white">
                  <span>Status:</span>
                  <StatusBadge status={selectedPO.status} size="sm" />
                </div>
                {selectedPO.delayReason ? (
                  <p className="text-xs mt-1 text-white/90 leading-relaxed">
                    <strong>Identified Delay Root Cause:</strong> {selectedPO.delayReason}
                  </p>
                ) : (
                  <p className="text-xs mt-1 text-white/80">
                    All transit waypoints are progressing according to SLA schedule.
                  </p>
                )}
              </div>
            </div>

            {/* Grid of Key Specifications */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
                <span className="text-[11px] text-white/50 uppercase tracking-wider block">
                  Material Item
                </span>
                <span className="font-medium text-sm text-white mt-1 block">
                  {selectedPO.itemName}
                </span>
                <span className="text-xs font-mono text-white/40">{selectedPO.itemCode}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
                <span className="text-[11px] text-white/50 uppercase tracking-wider block">
                  Total Order Value
                </span>
                <span className="font-medium text-base font-mono text-white mt-1 block">
                  ${selectedPO.totalValue.toLocaleString()}
                </span>
                <span className="text-xs text-white/60">
                  {selectedPO.quantity.toLocaleString()} {selectedPO.unit} @ ${selectedPO.unitPrice}/{selectedPO.unit}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
                <span className="text-[11px] text-white/50 uppercase tracking-wider block">
                  Original Dock Date
                </span>
                <span className="font-mono text-sm text-white mt-1 block">
                  {selectedPO.expectedDeliveryDate}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
                <span className="text-[11px] text-white/50 uppercase tracking-wider block">
                  Revised Expected Dock
                </span>
                <span className={`font-mono text-sm font-medium mt-1 block ${
                  selectedPO.status === 'critical' ? 'text-[#FF6B6B]' : selectedPO.status === 'delayed' ? 'text-[#E5A53D]' : 'text-white'
                }`}>
                  {selectedPO.revisedDeliveryDate}
                </span>
              </div>
            </div>

            {/* Carrier & Tracking Logistics Section */}
            <div className="p-4 rounded-2xl liquid-glass space-y-3">
              <h4 className="text-xs font-medium uppercase tracking-wider text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-white/80" />
                Freight Carrier Telemetry
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-white/50 block">Freight Carrier</span>
                  <span className="font-medium text-white">{selectedPO.carrier}</span>
                </div>
                <div>
                  <span className="text-white/50 block">Tracking Waybill #</span>
                  <span className="font-mono text-white font-medium">{selectedPO.trackingNumber}</span>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-white/60">Transit Milestone Completion</span>
                  <span className="font-mono text-white">{selectedPO.deliveryProgress}%</span>
                </div>
                <div className="h-2 w-full bg-black/60 rounded-full overflow-hidden border border-white/10">
                  <div
                    className="h-full rounded-full bg-white transition-all duration-500 shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                    style={{ width: `${selectedPO.deliveryProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* AI Recommendation Shortcut */}
            <div className="p-4 rounded-2xl liquid-glass border border-white/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-white/80" />
                <div>
                  <h5 className="text-xs font-medium text-white">AI Alternate Sourcing Available</h5>
                  <p className="text-[11px] text-white/60">
                    Mitigate delivery gap with pre-screened alternative vendor.
                  </p>
                </div>
              </div>
              <NeumorphicButton
                variant="primary"
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
