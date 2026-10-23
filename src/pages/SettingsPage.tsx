import React, { useState } from 'react';
import {
  Building,
  Bell,
  Eye,
  Database,
  Save,
  CheckCircle2,
  Sliders,
  Layers,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { GlassPanel } from '../components/common/GlassPanel';
import { InsetInput } from '../components/common/InsetInput';
import { NeumorphicButton } from '../components/common/NeumorphicButton';
import { ThemeToggle } from '../components/common/ThemeToggle';

export const SettingsPage: React.FC = () => {
  const [savedBanner, setSavedBanner] = useState(false);

  // Form states
  const [companyName, setCompanyName] = useState('Nexus Dynamics Advanced Manufacturing');
  const [facilityName, setFacilityName] = useState('Detroit Assembly Plant Alpha');
  const [primaryERP, setPrimaryERP] = useState('SAP S/4HANA (Cloud Edition)');
  const [criticalDaysThreshold, setCriticalDaysThreshold] = useState('7');
  const [warningDaysThreshold, setWarningDaysThreshold] = useState('14');

  // Toggle states
  const [notifyCriticalShortage, setNotifyCriticalShortage] = useState(true);
  const [notifyPoDelay, setNotifyPoDelay] = useState(true);
  const [notifyDailyDigest, setNotifyDailyDigest] = useState(false);
  const [ambientGlow, setAmbientGlow] = useState(true);
  const [microAnimations, setMicroAnimations] = useState(true);

  const handleSaveSettings = () => {
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 4000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={['SupplyShield', 'System Preferences']}
        title="Workspace Configuration & Connectivity"
        subtitle="Configure risk exposure thresholds, ERP synchronization rules, and inspect monochromatic design tokens."
        actions={
          <NeumorphicButton
            variant="primary"
            size="md"
            onClick={handleSaveSettings}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Preferences
          </NeumorphicButton>
        }
      />

      {savedBanner && (
        <div className="p-4 rounded-2xl liquid-glass border border-white/20 text-white flex items-center justify-between text-xs animate-in fade-in duration-200 shadow-xl">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-risk-low flex-shrink-0" />
            <span className="font-medium">
              Preferences successfully updated and applied across all modules.
            </span>
          </div>
          <button
            onClick={() => setSavedBanner(false)}
            className="text-white/70 hover:text-white font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Backend & Architecture Health Indicator */}
      <GlassPanel className="p-6 border border-palette-cyan/20 bg-palette-indigo/10 shadow-glow-cyan/5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-palette-indigo/30 text-palette-cyan border border-palette-cyan/30 flex-shrink-0">
              <Database className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-palette-cyan">
                  Integration Topology Status
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-palette-magenta/20 text-palette-magenta border border-palette-magenta/30 font-semibold">
                  Phase 1: Frontend Client
                </span>
              </div>
              <h3 className="text-base font-semibold text-white">
                Client-Side Engine Active • Local Telemetry Cache
              </h3>
              <p className="text-xs text-white/60 mt-1 max-w-2xl leading-relaxed">
                All business intelligence, analytics charts, and 3D network nodes operate deterministically in memory. Enterprise ERP gateway connectors synchronize via local storage and state hooks.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 min-w-[240px] text-xs">
            <div className="p-2.5 rounded-xl bg-palette-void/60 border border-white/10">
              <span className="text-white/50 block text-[10px]">REST API Gateway</span>
              <span className="font-mono text-white font-semibold">Client Staging</span>
            </div>
            <div className="p-2.5 rounded-xl bg-palette-void/60 border border-palette-cyan/30">
              <span className="text-white/50 block text-[10px]">ERP Integration</span>
              <span className="font-mono text-palette-cyan font-semibold">Active & Synced</span>
            </div>
          </div>
        </div>
      </GlassPanel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company & Facility Profile */}
        <GlassPanel className="p-6 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-white/70" />
            Manufacturing Facility Profile
          </h3>

          <div className="space-y-4">
            <InsetInput
              label="Enterprise Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />

            <InsetInput
              label="Primary Manufacturing Facility"
              value={facilityName}
              onChange={(e) => setFacilityName(e.target.value)}
            />

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/60 uppercase tracking-wider block">
                Primary ERP Source System
              </label>
              <select
                value={primaryERP}
                onChange={(e) => setPrimaryERP(e.target.value)}
                className="w-full rounded-xl px-3.5 py-2.5 text-xs text-white bg-[#0B0B0B] border border-white/15 focus:outline-none focus:border-white/40"
              >
                <option value="SAP S/4HANA (Cloud Edition)">SAP S/4HANA (Cloud Edition)</option>
                <option value="Oracle NetSuite Enterprise ERP">Oracle NetSuite Enterprise ERP</option>
                <option value="Microsoft Dynamics 365 Supply Chain">Microsoft Dynamics 365 Supply Chain</option>
                <option value="Siemens Teamcenter PLM">Siemens Teamcenter PLM</option>
              </select>
            </div>
          </div>
        </GlassPanel>

        {/* Risk Thresholds Engine */}
        <GlassPanel className="p-6 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-white/70" />
            AI Risk Detection Thresholds
          </h3>

          <div className="space-y-4">
            <InsetInput
              label="Critical Shortage Threshold (Days of Coverage)"
              type="number"
              value={criticalDaysThreshold}
              onChange={(e) => setCriticalDaysThreshold(e.target.value)}
              helperText="Materials falling below this coverage trigger emergency notifications."
            />

            <InsetInput
              label="Warning Buffer Threshold (Days of Coverage)"
              type="number"
              value={warningDaysThreshold}
              onChange={(e) => setWarningDaysThreshold(e.target.value)}
              helperText="Schedules recommendation scan for alternate sourcing options."
            />
          </div>
        </GlassPanel>

        {/* Notification Preferences */}
        <GlassPanel className="p-6 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-white/70" />
            Alerts & Escalations
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10">
              <div>
                <p className="text-xs font-semibold text-white">Emergency Shortage Alerts</p>
                <p className="text-[11px] text-white/60">
                  Broadcast immediate alerts when stock buffer drops below {criticalDaysThreshold} days
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifyCriticalShortage}
                onChange={(e) => setNotifyCriticalShortage(e.target.checked)}
                className="w-4 h-4 accent-white rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10">
              <div>
                <p className="text-xs font-semibold text-white">Purchase Order Delay Notifications</p>
                <p className="text-[11px] text-white/60">
                  Notify when freight carrier ETA deviates by more than 48 hours
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifyPoDelay}
                onChange={(e) => setNotifyPoDelay(e.target.checked)}
                className="w-4 h-4 accent-white rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10">
              <div>
                <p className="text-xs font-semibold text-white">Daily Executive Digest</p>
                <p className="text-[11px] text-white/60">
                  Send aggregated risk summary to Dr. Rostova at 07:00 EST
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifyDailyDigest}
                onChange={(e) => setNotifyDailyDigest(e.target.checked)}
                className="w-4 h-4 accent-white rounded cursor-pointer"
              />
            </div>
          </div>
        </GlassPanel>

        {/* Appearance & Lighting */}
        <GlassPanel className="p-6 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Eye className="w-4 h-4 text-white/70" />
            Appearance & Visual Experience
          </h3>

          <div className="space-y-3">
            {/* Design Tokens Palette Swatches */}
            <div className="p-4 rounded-xl bg-palette-void/50 border border-palette-cyan/25 space-y-3 shadow-glow-cyan/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-palette-cyan flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-palette-cyan" />
                    Feather Chromatic Color System (7 Swatches)
                  </p>
                  <p className="text-[11px] text-white/60">
                    Dual-pole iridescent spectrum bridging Electric Magenta (#921CC0) and Electric Neon Cyan (#0FD3F2)
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-gradient-to-r from-palette-cyan via-palette-cerulean to-palette-magenta text-white shadow-glow-cyan">
                  ACTIVE
                </span>
              </div>

              {/* Feather Spectrum Ribbon */}
              <div className="h-3 w-full rounded-full bg-gradient-to-r from-[#921CC0] via-[#4C128A] via-[#171665] via-[#1D0445] via-[#082495] via-[#007CB8] to-[#0FD3F2] shadow-glow-feather" />

              {/* 7 Individual Swatch Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-1">
                <div className="p-2 rounded-lg bg-black/60 border border-white/10 hover:border-[#921CC0] transition-colors text-center">
                  <div className="w-full h-6 rounded bg-[#921CC0] mb-1.5 shadow-[0_0_10px_rgba(146,28,192,0.5)]" />
                  <span className="text-[10px] font-semibold text-white block">1. Magenta</span>
                  <span className="text-[9px] font-mono text-palette-magenta block">#921CC0</span>
                </div>
                <div className="p-2 rounded-lg bg-black/60 border border-white/10 hover:border-[#4C128A] transition-colors text-center">
                  <div className="w-full h-6 rounded bg-[#4C128A] mb-1.5" />
                  <span className="text-[10px] font-semibold text-white block">2. Royal Violet</span>
                  <span className="text-[9px] font-mono text-white/60 block">#4C128A</span>
                </div>
                <div className="p-2 rounded-lg bg-black/60 border border-white/10 hover:border-[#171665] transition-colors text-center">
                  <div className="w-full h-6 rounded bg-[#171665] mb-1.5 border border-white/10" />
                  <span className="text-[10px] font-semibold text-white block">3. Indigo</span>
                  <span className="text-[9px] font-mono text-white/60 block">#171665</span>
                </div>
                <div className="p-2 rounded-lg bg-black/60 border border-white/10 hover:border-[#1D0445] transition-colors text-center">
                  <div className="w-full h-6 rounded bg-[#1D0445] mb-1.5 border border-white/10" />
                  <span className="text-[10px] font-semibold text-white block">4. Midnight Void</span>
                  <span className="text-[9px] font-mono text-white/60 block">#1D0445</span>
                </div>
                <div className="p-2 rounded-lg bg-black/60 border border-white/10 hover:border-[#082495] transition-colors text-center">
                  <div className="w-full h-6 rounded bg-[#082495] mb-1.5" />
                  <span className="text-[10px] font-semibold text-white block">5. Cobalt</span>
                  <span className="text-[9px] font-mono text-white/60 block">#082495</span>
                </div>
                <div className="p-2 rounded-lg bg-black/60 border border-white/10 hover:border-[#007CB8] transition-colors text-center">
                  <div className="w-full h-6 rounded bg-[#007CB8] mb-1.5 shadow-[0_0_10px_rgba(0,124,184,0.4)]" />
                  <span className="text-[10px] font-semibold text-white block">6. Cerulean</span>
                  <span className="text-[9px] font-mono text-palette-cerulean block">#007CB8</span>
                </div>
                <div className="p-2 rounded-lg bg-black/60 border border-white/10 hover:border-[#0FD3F2] transition-colors text-center">
                  <div className="w-full h-6 rounded bg-[#0FD3F2] mb-1.5 shadow-[0_0_12px_rgba(15,211,242,0.6)]" />
                  <span className="text-[10px] font-semibold text-white block">7. Neon Cyan</span>
                  <span className="text-[9px] font-mono text-palette-cyan block font-bold">#0FD3F2</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10">
              <div>
                <p className="text-xs font-semibold text-white">Interface Theme Mode</p>
                <p className="text-[11px] text-white/60">
                  Switch between deep space obsidian and frosted ceramic light
                </p>
              </div>
              <ThemeToggle variant="pill" />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10">
              <div>
                <p className="text-xs font-semibold text-white">Specular Surface Sheen</p>
                <p className="text-[11px] text-white/60">
                  Dual-edge iridescent gradient borders mirroring feather color coordinates
                </p>
              </div>
              <input
                type="checkbox"
                checked={ambientGlow}
                onChange={(e) => setAmbientGlow(e.target.checked)}
                className="w-4 h-4 accent-[#0FD3F2] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10">
              <div>
                <p className="text-xs font-semibold text-white">Interactive Micro-Animations</p>
                <p className="text-[11px] text-white/60">
                  Smooth hover elevations, radar telemetry pulses, and drawer slide transitions
                </p>
              </div>
              <input
                type="checkbox"
                checked={microAnimations}
                onChange={(e) => setMicroAnimations(e.target.checked)}
                className="w-4 h-4 accent-[#0FD3F2] rounded cursor-pointer"
              />
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};
