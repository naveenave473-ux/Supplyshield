import React, { useState, useEffect } from 'react';
import {
  MessageSquareShare,
  Copy,
  Check,
  Send,
  Building2,
  FileText,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../components/common/PageHeader';
import { GlassPanel } from '../components/common/GlassPanel';
import { NeumorphicButton } from '../components/common/NeumorphicButton';
import { StatusBadge } from '../components/common/StatusBadge';
import { mockSuppliers, mockCommunicationTemplates, mockPurchaseOrders } from '../data/mockData';
import { MessageLog } from '../types';

export const CommunicationsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialSupplier = searchParams.get('supplier') || 'Kyoto Nano-Silicon Ltd';
  const initialPO = searchParams.get('po') || 'PO-2026-98214';

  const [selectedSupplierName, setSelectedSupplierName] = useState(initialSupplier);
  const [selectedTemplateId, setSelectedTemplateId] = useState('TMPL-01');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [copied, setCopied] = useState(false);
  const [sendSuccess, setSendSuccess] = useState<string | null>(null);
  const [sentHistory, setSentHistory] = useState<MessageLog[]>([
    {
      id: 'MSG-8821',
      recipientSupplier: 'Titan Aerospace Metallurgy',
      recipientEmail: 'i.schneider@titan-metallurgy.de',
      subject: 'URGENT: Expedite Delivery Request for PO-2026-98203',
      body: 'Automated notice generated for Titanium Billets port congestion recovery.',
      templateType: 'Expedite Request',
      timestamp: 'Today at 10:24 AM',
      status: 'sent',
    },
    {
      id: 'MSG-8819',
      recipientSupplier: 'Apex Microelectronics Inc',
      recipientEmail: 'wl.chen@apex-microelectronics.tw',
      subject: 'Supply Disruption Notice & Sourcing Contingency - MLCC',
      body: 'Notice regarding customs clearance delay and AML alternative review.',
      templateType: 'Risk Warning',
      timestamp: 'Yesterday at 4:15 PM',
      status: 'sent',
    },
  ]);

  const activeSupplier =
    mockSuppliers.find((s) => s.name.toLowerCase().includes(selectedSupplierName.toLowerCase())) ||
    mockSuppliers[0];

  const activePO =
    mockPurchaseOrders.find((p) => p.poNumber === initialPO) ||
    mockPurchaseOrders[0];

  // Populate template with dynamic tags
  useEffect(() => {
    const tmpl = mockCommunicationTemplates.find((t) => t.id === selectedTemplateId);
    if (tmpl) {
      const compiledSubject = tmpl.subject
        .replace('{PO_NUMBER}', activePO.poNumber)
        .replace('{ITEM_NAME}', activePO.itemName)
        .replace('{SUPPLIER_NAME}', activeSupplier.name);

      const compiledBody = tmpl.body
        .replace(/{SUPPLIER_CONTACT}/g, activeSupplier.contactName)
        .replace(/{SUPPLIER_NAME}/g, activeSupplier.name)
        .replace(/{PO_NUMBER}/g, activePO.poNumber)
        .replace(/{ITEM_NAME}/g, activePO.itemName)
        .replace(/{QUANTITY}/g, activePO.quantity.toLocaleString())
        .replace(/{UNIT}/g, activePO.unit)
        .replace(/{EXPECTED_DATE}/g, activePO.expectedDeliveryDate)
        .replace(/{REVISED_DATE}/g, activePO.revisedDeliveryDate)
        .replace(/{DESTINATION_FACILITY}/g, activePO.destinationFacility)
        .replace(/{DAYS_COVERAGE}/g, '4.6')
        .replace(/{TOTAL_VALUE}/g, `$${activePO.totalValue.toLocaleString()}`)
        .replace(/{SKU}/g, activePO.itemCode);

      setSubject(compiledSubject);
      setBody(compiledBody);
    }
  }, [selectedTemplateId, activeSupplier, activePO]);

  const handleCopyToClipboard = async () => {
    const fullText = `To: ${activeSupplier.contactEmail}\nSubject: ${subject}\n\n${body}`;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSendMessage = () => {
    const newLog: MessageLog = {
      id: `MSG-${Math.floor(1000 + Math.random() * 9000)}`,
      recipientSupplier: activeSupplier.name,
      recipientEmail: activeSupplier.contactEmail,
      subject,
      body,
      templateType:
        mockCommunicationTemplates.find((t) => t.id === selectedTemplateId)?.title || 'Custom',
      timestamp: 'Just now',
      status: 'sent',
    };
    setSentHistory([newLog, ...sentHistory]);
    setSendSuccess(`Transmission dispatched to ${activeSupplier.contactEmail} (Simulated Dispatch).`);
    setTimeout(() => setSendSuccess(null), 5000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={['SupplyShield', 'Supplier Engagement']}
        title="Supplier Communications & Escalation Hub"
        subtitle="Generate legally binding expediting requests, risk escalation notices, and spot buy RFQs with automated factory telemetry context."
      />

      {sendSuccess && (
        <div className="p-4 rounded-2xl liquid-glass border border-palette-cyan/40 text-white flex items-center justify-between text-xs animate-in fade-in duration-200 shadow-glow-cyan/20">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-palette-cyan flex-shrink-0" />
            <span className="font-medium">{sendSuccess}</span>
          </div>
          <button
            onClick={() => setSendSuccess(null)}
            className="text-white/70 hover:text-white font-medium px-2 py-0.5 rounded bg-palette-cyan/10 border border-palette-cyan/30"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Composer & Template Selector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Template Selector & Supplier Destination Card */}
        <div className="space-y-5">
          {/* Destination Supplier Select */}
          <GlassPanel className="p-5 space-y-3 hover:border-palette-cyan/30 transition-all">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-palette-cyan flex items-center gap-2">
              <Building2 className="w-4 h-4 text-palette-cyan" />
              Recipient Vendor
            </h4>

            <div>
              <label className="text-[11px] text-white/60 block mb-1">Select Supplier</label>
              <select
                value={selectedSupplierName}
                onChange={(e) => setSelectedSupplierName(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-xs text-white bg-[#0B0B0B] border border-white/15 focus:outline-none focus:border-palette-cyan/50 focus:shadow-glow-cyan/20"
              >
                {mockSuppliers.map((s) => (
                  <option key={s.id} value={s.name} className="bg-[#0B0B0B] text-white">
                    {s.name} ({s.location})
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3.5 rounded-xl bg-palette-indigo/15 border border-white/10 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-white/60">Contact Person:</span>
                <span className="text-palette-cyan font-medium">{activeSupplier.contactName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Direct Email:</span>
                <span className="text-palette-cerulean font-mono truncate max-w-[160px]">
                  {activeSupplier.contactEmail}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Risk Status:</span>
                <StatusBadge status={activeSupplier.riskLevel} size="sm" />
              </div>
            </div>
          </GlassPanel>

          {/* Sourcing Templates */}
          <GlassPanel className="p-5 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-palette-cyan flex items-center gap-2">
              <FileText className="w-4 h-4 text-palette-cyan" />
              Escalation Templates
            </h4>

            <div className="space-y-2">
              {mockCommunicationTemplates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplateId(t.id)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all duration-150 ${
                    selectedTemplateId === t.id
                      ? 'border-palette-cyan/50 text-white bg-gradient-to-r from-palette-void/70 to-palette-indigo/50 shadow-glow-cyan/20'
                      : 'border-white/[0.06] text-white/70 hover:text-white hover:border-palette-cyan/20 hover:bg-white/[0.03]'
                  }`}
                >
                  <p className={`font-semibold ${selectedTemplateId === t.id ? 'text-palette-cyan' : 'text-white'}`}>{t.title}</p>
                  <p className="text-[10px] text-white/50 mt-0.5 line-clamp-1">{t.subject}</p>
                </button>
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* Right: Rich Message Composer */}
        <div className="lg:col-span-2">
          <GlassPanel className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <MessageSquareShare className="w-4 h-4 text-palette-cyan" />
                  Official Procurement Transmission
                </h3>
                <p className="text-xs text-white/60">
                  Fields populated with real-time inventory telemetry & contract references
                </p>
              </div>

              <div className="flex items-center gap-2">
                <NeumorphicButton
                  variant={copied ? 'inset' : 'raised'}
                  size="sm"
                  onClick={handleCopyToClipboard}
                  leftIcon={copied ? <Check className="w-3.5 h-3.5 text-palette-cyan" /> : <Copy className="w-3.5 h-3.5 text-white/70" />}
                >
                  {copied ? 'Copied' : 'Copy Message'}
                </NeumorphicButton>

                <NeumorphicButton
                  variant="primary"
                  size="sm"
                  onClick={handleSendMessage}
                  leftIcon={<Send className="w-3.5 h-3.5" />}
                >
                  Send Transmission
                </NeumorphicButton>
              </div>
            </div>

            {/* Subject Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/60 uppercase tracking-wider block">
                Subject Line
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-xl px-4 py-2.5 text-sm text-white bg-white/[0.03] border border-white/15 focus:outline-none focus:border-palette-cyan/60 focus:shadow-glow-cyan/20 transition-all font-medium"
              />
            </div>

            {/* Body Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/60 uppercase tracking-wider block">
                Message Body
              </label>
              <textarea
                rows={12}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full rounded-2xl p-4 text-xs font-mono text-white bg-white/[0.03] border border-white/15 focus:outline-none focus:border-palette-cyan/60 focus:shadow-glow-cyan/20 leading-relaxed resize-y transition-all"
              />
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-white/50">
              <span>Dynamic placeholders: <code className="text-palette-cyan font-mono">{`{PO_NUMBER}, {ITEM_NAME}, {QUANTITY}`}</code></span>
              <span className="font-mono text-palette-cyan">{body.length} characters</span>
            </div>
          </GlassPanel>
        </div>
      </div>

      {/* Outbox / Transmission Log */}
      <GlassPanel className="p-6 space-y-4">
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-palette-cyan" />
          Recent Outbound Escalations & Transmissions
        </h3>

        <div className="divide-y divide-white/[0.06]">
          {sentHistory.map((item) => (
            <div key={item.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-white/[0.02] px-2 rounded-xl transition-colors">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-palette-cyan">{item.id}</span>
                  <span className="text-white font-medium">{item.recipientSupplier}</span>
                  <span className="text-white/50">({item.recipientEmail})</span>
                </div>
                <p className="text-white font-medium mt-1">{item.subject}</p>
                <p className="text-white/60 text-[11px] mt-0.5 line-clamp-1">{item.body}</p>
              </div>

              <div className="flex items-center gap-3 sm:text-right flex-shrink-0">
                <span className="text-[11px] text-white/50 font-mono">{item.timestamp}</span>
                <StatusBadge status="on_track" label="Dispatched" size="sm" />
              </div>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
};
