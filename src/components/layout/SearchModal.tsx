import React, { useState, useEffect } from 'react';
import { Search, FileSpreadsheet, Building2, AlertTriangle, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockPurchaseOrders, mockSuppliers, mockMaterialRisks } from '../../data/mockData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredPOs = query.trim()
    ? mockPurchaseOrders.filter(
        (po) =>
          po.poNumber.toLowerCase().includes(query.toLowerCase()) ||
          po.itemName.toLowerCase().includes(query.toLowerCase()) ||
          po.supplierName.toLowerCase().includes(query.toLowerCase())
      )
    : mockPurchaseOrders.slice(0, 3);

  const filteredMaterials = query.trim()
    ? mockMaterialRisks.filter(
        (m) =>
          m.sku.toLowerCase().includes(query.toLowerCase()) ||
          m.name.toLowerCase().includes(query.toLowerCase())
      )
    : mockMaterialRisks.slice(0, 3);

  const filteredSuppliers = query.trim()
    ? mockSuppliers.filter(
        (s) =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.location.toLowerCase().includes(query.toLowerCase())
      )
    : mockSuppliers.slice(0, 2);

  const selectItem = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-2xl liquid-glass-strong border border-white/20 shadow-[0_30px_80px_rgba(0,0,0,0.95)] overflow-hidden">
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-white/[0.08] bg-black/40">
          <Search className="w-5 h-5 text-white mr-3 flex-shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a PO #, supplier name, SKU, or recommendation keyword..."
            className="w-full bg-transparent text-sm text-white placeholder-white/40 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-white/50 hover:text-white mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[10px] font-mono font-medium px-2 py-0.5 rounded border border-white/10 bg-white/[0.04] text-white/60">
            ESC to close
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {/* Purchase Orders */}
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-white/50 uppercase tracking-wider mb-2">
              <FileSpreadsheet className="w-3.5 h-3.5 text-white/80" />
              <span>Purchase Orders</span>
            </div>
            <div className="space-y-1.5">
              {filteredPOs.length === 0 ? (
                <p className="text-xs text-white/40 px-3 py-1">No matching purchase orders</p>
              ) : (
                filteredPOs.map((po) => (
                  <div
                    key={po.id}
                    onClick={() => selectItem('/purchase-orders')}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.05] cursor-pointer transition-colors group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-medium text-white group-hover:text-white transition-colors">
                          {po.poNumber}
                        </span>
                        <span className="text-xs text-white/70 truncate max-w-[200px]">
                          {po.itemName}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50">
                        {po.supplierName} • ${po.totalValue.toLocaleString()}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Critical Materials */}
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-white/50 uppercase tracking-wider mb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-[#FF6B6B]" />
              <span>Material Inventory Risks</span>
            </div>
            <div className="space-y-1.5">
              {filteredMaterials.map((mat) => (
                <div
                  key={mat.id}
                  onClick={() => selectItem('/inventory-risks')}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.05] cursor-pointer transition-colors group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-medium text-white group-hover:text-white transition-colors">
                        {mat.sku}
                      </span>
                      <span className="text-xs text-white/70 truncate max-w-[200px]">
                        {mat.name}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/50">
                      Stock: {mat.currentStock.toLocaleString()} {mat.unit} • Coverage: {mat.daysOfCoverage} days
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {/* Suppliers */}
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-white/50 uppercase tracking-wider mb-2">
              <Building2 className="w-3.5 h-3.5 text-white/80" />
              <span>Suppliers & Vendors</span>
            </div>
            <div className="space-y-1.5">
              {filteredSuppliers.map((s) => (
                <div
                  key={s.id}
                  onClick={() => selectItem('/suppliers')}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.05] cursor-pointer transition-colors group"
                >
                  <div>
                    <span className="text-xs font-medium text-white group-hover:text-white transition-colors">
                      {s.name}
                    </span>
                    <p className="text-[11px] text-white/50">
                      {s.location}, {s.country} • On-time: {s.onTimeDeliveryRate}% • Lead time: {s.leadTimeDays}d
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-white/[0.08] bg-black/40 flex items-center justify-between text-[11px] text-white/50 font-mono">
          <span>Tip: Press Tab or Enter to select quick links</span>
          <span className="text-white/80">SupplyShield Engine v1.2</span>
        </div>
      </div>
    </div>
  );
};
