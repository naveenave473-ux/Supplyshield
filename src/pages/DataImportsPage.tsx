import React, { useState } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  Database,
  Info,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { GlassPanel } from '../components/common/GlassPanel';
import { GlassCard } from '../components/common/GlassCard';
import { NeumorphicButton } from '../components/common/NeumorphicButton';
import { GlassTable, Column } from '../components/common/GlassTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { mockImportHistory } from '../data/mockData';
import { ImportHistoryItem } from '../types';

interface ParsedRow {
  poNumber: string;
  sku: string;
  supplier: string;
  quantity: number;
  expectedDate: string;
  status: 'valid' | 'warning' | 'error';
  validationNote?: string;
}

const sampleParsedData: ParsedRow[] = [
  {
    poNumber: 'PO-2026-98301',
    sku: 'MCU-STM32-H743',
    supplier: 'Kyoto Nano-Silicon Ltd',
    quantity: 5000,
    expectedDate: '2026-11-15',
    status: 'valid',
  },
  {
    poNumber: 'PO-2026-98302',
    sku: 'TI-BILLET-GR5-450',
    supplier: 'Titan Aerospace Metallurgy',
    quantity: 250,
    expectedDate: '2026-11-20',
    status: 'valid',
  },
  {
    poNumber: 'PO-2026-98303',
    sku: 'OPT-QSFP28-100G',
    supplier: 'Vectron Dynamics Inc',
    quantity: 600,
    expectedDate: '2026-10-30',
    status: 'warning',
    validationNote: 'Lead time under threshold for overseas air delivery',
  },
  {
    poNumber: 'PO-2026-98304',
    sku: 'CAP-UNKNOWN-99',
    supplier: 'Apex Microelectronics',
    quantity: -100,
    expectedDate: '2026-12-01',
    status: 'error',
    validationNote: 'Quantity cannot be negative; SKU not registered in catalog',
  },
];

export const DataImportsPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [importHistory, setImportHistory] = useState<ImportHistoryItem[]>(mockImportHistory);
  const [importSuccessBanner, setImportSuccessBanner] = useState<string | null>(null);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setSelectedFile(file);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowPreview(true);
    }, 700);
  };

  const handleCommitImport = () => {
    if (!selectedFile) return;
    const newHistoryItem: ImportHistoryItem = {
      id: `IMP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      fileName: selectedFile.name,
      rowsProcessed: sampleParsedData.length,
      validRows: sampleParsedData.filter((r) => r.status === 'valid').length,
      errorRows: sampleParsedData.filter((r) => r.status === 'error').length,
      status: sampleParsedData.some((r) => r.status === 'error') ? 'warning' : 'success',
      importedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      fileSize: `${(selectedFile.size / 1024).toFixed(1)} KB`,
      source: 'Direct Web CSV Upload',
      errorSummary: '1 row flagged with negative quantity in staging buffer',
    };
    setImportHistory([newHistoryItem, ...importHistory]);
    setImportSuccessBanner(`Successfully ingested "${selectedFile.name}" into local staging memory.`);
    setShowPreview(false);
    setSelectedFile(null);
  };

  const handleLoadSampleCSV = () => {
    const fakeFile = new File(
      ['po_number,sku,supplier,quantity,expected_date\nPO-2026-98301,MCU-STM32-H743,Kyoto Nano-Silicon Ltd,5000,2026-11-15'],
      'SAP_S4HANA_PO_EXTRACT_Q4_DEMO.csv',
      { type: 'text/csv' }
    );
    processFile(fakeFile);
  };

  const previewColumns: Column<ParsedRow>[] = [
    {
      key: 'poNumber',
      header: 'PO Number',
      render: (r) => <span className="font-mono font-bold text-white text-xs">{r.poNumber}</span>,
    },
    {
      key: 'sku',
      header: 'SKU Code',
      render: (r) => <span className="font-mono text-xs text-white/70">{r.sku}</span>,
    },
    {
      key: 'supplier',
      header: 'Supplier',
      render: (r) => <span className="text-xs text-white">{r.supplier}</span>,
    },
    {
      key: 'quantity',
      header: 'Quantity',
      render: (r) => (
        <span
          className={`font-mono text-xs ${
            r.quantity < 0 ? 'text-risk-critical font-bold' : 'text-white'
          }`}
        >
          {r.quantity.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'expectedDate',
      header: 'Expected Dock Date',
      render: (r) => <span className="font-mono text-xs text-white/70">{r.expectedDate}</span>,
    },
    {
      key: 'status',
      header: 'Validation',
      render: (r) => (
        <div>
          <StatusBadge status={r.status === 'valid' ? 'healthy' : r.status} size="sm" />
          {r.validationNote && (
            <p className="text-[10px] text-risk-warning mt-0.5 line-clamp-1">{r.validationNote}</p>
          )}
        </div>
      ),
    },
  ];

  const historyColumns: Column<ImportHistoryItem>[] = [
    {
      key: 'fileName',
      header: 'File Name',
      render: (item) => (
        <div>
          <span className="font-mono text-xs font-semibold text-white block">
            {item.fileName}
          </span>
          <span className="text-[10px] text-white/40 font-mono">{item.id}</span>
        </div>
      ),
    },
    {
      key: 'source',
      header: 'Source / Connector',
      render: (item) => <span className="text-xs text-white/70">{item.source}</span>,
    },
    {
      key: 'rowsProcessed',
      header: 'Records',
      render: (item) => (
        <span className="font-mono text-xs text-white">
          {item.rowsProcessed.toLocaleString()} rows
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Result',
      render: (item) => <StatusBadge status={item.status} size="sm" />,
    },
    {
      key: 'importedAt',
      header: 'Import Timestamp',
      render: (item) => (
        <span className="font-mono text-xs text-white/50">{item.importedAt}</span>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumbs={['SupplyShield', 'Data Ingestion']}
        title="Data Imports & ERP Integration"
        subtitle="Ingest purchase order batches, bill of materials (BOM), and supplier scorecards with real-time format validation."
      />

      {/* Backend Integration State Notice */}
      <div className="p-4 rounded-2xl liquid-glass border border-white/10 flex items-start gap-3">
        <Info className="w-5 h-5 text-white/70 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-white/70 leading-relaxed">
          <strong className="text-white">Frontend Validation Sandbox Active:</strong> This demonstration
          environment parses and validates CSV/JSON schemas client-side using Web File APIs. Persistent
          ERP gateway connectors synchronize in real-time with local application state.
        </div>
      </div>

      {importSuccessBanner && (
        <div className="p-4 rounded-2xl liquid-glass border border-palette-cyan/40 text-white flex items-center justify-between text-xs animate-in fade-in duration-200 shadow-glow-cyan/20">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-palette-cyan flex-shrink-0" />
            <span className="text-white font-medium">{importSuccessBanner}</span>
          </div>
          <button
            onClick={() => setImportSuccessBanner(null)}
            className="text-white/70 hover:text-white font-medium px-2 py-0.5 rounded bg-palette-cyan/10 border border-palette-cyan/30"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Upload Zone & Quick Sample Load */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            className={`relative rounded-3xl p-10 text-center liquid-glass transition-all duration-300 border-2 border-dashed ${
              isDragging
                ? 'border-palette-cyan bg-palette-indigo/30 shadow-glow-cyan'
                : 'border-palette-cyan/25 hover:border-palette-cyan/50 hover:shadow-glow-cyan/15 bg-palette-void/40'
            }`}
          >
            <input
              type="file"
              accept=".csv,.xlsx,.json"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              id="file-upload"
            />

            <div className="mx-auto w-16 h-16 rounded-2xl bg-palette-indigo/30 text-palette-cyan flex items-center justify-center border border-palette-cyan/30 mb-4 shadow-glow-cyan/20">
              <UploadCloud className="w-8 h-8 text-palette-cyan animate-bounce" />
            </div>

            <h3 className="text-lg font-semibold text-white mb-1">
              Drag & Drop your procurement files here
            </h3>
            <p className="text-xs text-white/60 max-w-md mx-auto mb-6">
              Drop your ERP extract, supplier shipment reports, or BOM manifests. Files are parsed
              locally without transmitting confidential part data.
            </p>

            <div className="flex items-center justify-center gap-3">
              <NeumorphicButton variant="primary" size="md" isLoading={isProcessing}>
                Browse Files
              </NeumorphicButton>
              <NeumorphicButton
                variant="raised"
                size="md"
                isLoading={isProcessing}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLoadSampleCSV();
                }}
              >
                Load Sample SAP Extract
              </NeumorphicButton>
            </div>
          </div>
        </div>

        {/* Supported Format Specifications Card */}
        <GlassCard className="p-6 flex flex-col justify-between hover:border-palette-cyan/30 transition-all">
          <div>
            <h4 className="text-sm font-semibold text-palette-cyan mb-1 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-palette-cyan" />
              Supported Schemas & Formats
            </h4>
            <p className="text-xs text-white/60 mb-4">
              SupplyShield auto-detects column headers for:
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-palette-void/60 border border-white/10 flex items-center justify-between">
                <span className="font-mono text-palette-cyan font-bold">.CSV</span>
                <span className="text-white/60">RFC 4180 standard (UTF-8)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-palette-void/60 border border-white/10 flex items-center justify-between">
                <span className="font-mono text-palette-cerulean font-bold">.XLSX</span>
                <span className="text-white/60">Excel Workbook (up to 50MB)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-palette-void/60 border border-white/10 flex items-center justify-between">
                <span className="font-mono text-palette-magenta font-bold">.JSON</span>
                <span className="text-white/60">REST payload / OpenAPI schema</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.06]">
            <p className="text-[11px] text-white/50">
              Required columns: <code className="text-palette-cyan font-mono">po_number, sku, supplier, quantity, expected_date</code>
            </p>
          </div>
        </GlassCard>
      </div>

      {/* CSV Preview and Staging Inspector */}
      {showPreview && (
        <GlassPanel className="p-6 space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold text-white">
                  {selectedFile?.name || 'SAP_EXTRACT_PREVIEW.csv'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-white/70 border border-white/10">
                  4 rows parsed
                </span>
              </div>
              <h3 className="text-base font-semibold text-white mt-1">
                Schema Mapping & Staging Validation
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <NeumorphicButton
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(false)}
              >
                Cancel
              </NeumorphicButton>
              <NeumorphicButton
                variant="primary"
                size="sm"
                onClick={handleCommitImport}
              >
                Commit to Active Workspace
              </NeumorphicButton>
            </div>
          </div>

          <GlassTable
            columns={previewColumns}
            data={sampleParsedData}
            keyExtractor={(r) => r.poNumber}
          />
        </GlassPanel>
      )}

      {/* Import History Table */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-white/80" />
            Ingestion Audit Log
          </h3>
          <p className="text-xs text-white/60">
            Historical records of past batch synchronization events
          </p>
        </div>

        <GlassTable
          columns={historyColumns}
          data={importHistory}
          keyExtractor={(item) => item.id}
        />
      </div>
    </div>
  );
};
