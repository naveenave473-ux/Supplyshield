import React, { useState } from 'react';
import {
  Building,
  Bell,
  Eye,
  Database,
  Save,
  CheckCircle2,
  Sliders,
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
        subtitle="Configure risk exposure thresholds, ERP synchronization rules, and observe real-time database connection statuses."
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
        <div className="p-4 rounded-2xl bg-[#B7F000]/15 border border-[#B7F000]/35 text-[#B7F000] flex items-center justify-between text-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">
              Preferences successfully updated and applied across all modules.
            </span>
          </div>
          <button
            onClick={() => setSavedBanner(false)}
            className="text-white hover:text-white/80 font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Honest Backend & Architecture Health Indicator */}
      <GlassPanel className="p-6 border border-primary/25 bg-[#0f1b33]/70">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="neu-icon-container p-3.5 rounded-2xl bg-[#122240] text-primary border border-primary/30 flex-shrink-0">
              <Database className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Integration Topology Status
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#0FD3F2]/15 text-[#0FD3F2] border border-[#0FD3F2]/30">
                  Phase 1: Frontend Client
                </span>
              </div>
              <h3 className="text-base font-bold text-white">
                Client-Side Engine Active • Pending MongoDB Gateway Link
              </h3>
              <p className="text-xs text-[#BEC7D5] mt-1 max-w-2xl leading-relaxed">
                All business intelligence, analytics charts, and data filters are operating deterministically in memory. Permanent database persistence via MongoDB and WebSocket feeds are scheduled for Phase 2.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 min-w-[240px] text-xs">
            <div className="p-2.5 rounded-xl neu-inset">
              <span className="text-[#BEC7D5] block text-[10px]">REST API Gateway</span>
              <span className="font-mono text-primary font-bold">Client Mock Mode</span>
            </div>
            <div className="p-2.5 rounded-xl neu-inset">
              <span className="text-[#BEC7D5] block text-[10px]">MongoDB Atlas</span>
              <span className="font-mono text-[#F59E0B] font-bold">Pending Integration</span>
            </div>
          </div>
        </div>
      </GlassPanel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company & Facility Profile */}
        <GlassPanel className="p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-primary" />
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
              <label className="text-xs font-medium text-[#BEC7D5] uppercase tracking-wider block">
                Primary ERP Source System
              </label>
              <select
                value={primaryERP}
                onChange={(e) => setPrimaryERP(e.target.value)}
                className="w-full rounded-xl neu-inset px-3.5 py-2.5 text-xs text-white bg-[#1D0445] border border-[#4C128A]/40 focus:outline-none focus:border-primary"
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
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#F59E0B]" />
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
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-secondary" />
            Alerts & Escalations
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl neu-inset">
              <div>
                <p className="text-xs font-bold text-white">Emergency Shortage Alerts</p>
                <p className="text-[11px] text-[#BEC7D5]">
                  Broadcast immediate alerts when stock buffer drops below {criticalDaysThreshold} days
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifyCriticalShortage}
                onChange={(e) => setNotifyCriticalShortage(e.target.checked)}
                className="w-4 h-4 accent-primary rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl neu-inset">
              <div>
                <p className="text-xs font-bold text-white">Purchase Order Delay Notifications</p>
                <p className="text-[11px] text-[#BEC7D5]">
                  Notify when freight carrier ETA deviates by more than 48 hours
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifyPoDelay}
                onChange={(e) => setNotifyPoDelay(e.target.checked)}
                className="w-4 h-4 accent-primary rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl neu-inset">
              <div>
                <p className="text-xs font-bold text-white">Daily Executive Digest</p>
                <p className="text-[11px] text-[#BEC7D5]">
                  Send aggregated risk summary to Dr. Rostova at 07:00 EST
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifyDailyDigest}
                onChange={(e) => setNotifyDailyDigest(e.target.checked)}
                className="w-4 h-4 accent-primary rounded cursor-pointer"
              />
            </div>
          </div>
        </GlassPanel>

        {/* Appearance & Lighting */}
        <GlassPanel className="p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Eye className="w-4 h-4 text-primary" />
            Appearance & Visual Experience
          </h3>

          <div className="space-y-3">
            {/* Active 7-Color Design Palette Swatches */}
            <div className="p-3.5 rounded-xl neu-inset space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white font-tech">Active Design Palette: Electric Luminescence</p>
                  <p className="text-[11px] text-[#CBD5E1]">
                    Curated 7-color aesthetic applied across 3D scenes, glass panels, and data telemetry
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#0FD3F2]/15 text-[#0FD3F2] border border-[#0FD3F2]/30">
                  ACTIVE
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-1">
                <div className="p-2 rounded-lg bg-black/40 border border-white/10 text-center">
                  <div className="w-full h-5 rounded bg-[#921CC0] mb-1.5 shadow-[0_0_10px_rgba(146,28,192,0.4)]" />
                  <span className="text-[10px] font-bold text-white block">Electric Violet</span>
                  <span className="text-[9px] font-mono text-[#921CC0] block">#921CC0</span>
                </div>
                <div className="p-2 rounded-lg bg-black/40 border border-white/10 text-center">
                  <div className="w-full h-5 rounded bg-[#4C128A] mb-1.5 shadow-[0_0_10px_rgba(76,18,138,0.4)]" />
                  <span className="text-[10px] font-bold text-white block">Royal Violet</span>
                  <span className="text-[9px] font-mono text-[#4C128A] block">#4C128A</span>
                </div>
                <div className="p-2 rounded-lg bg-black/40 border border-white/10 text-center">
                  <div className="w-full h-5 rounded bg-[#171665] mb-1.5 border border-white/20" />
                  <span className="text-[10px] font-bold text-white block">Midnight Indigo</span>
                  <span className="text-[9px] font-mono text-[#CBD5E1] block">#171665</span>
                </div>
                <div className="p-2 rounded-lg bg-black/40 border border-white/10 text-center">
                  <div className="w-full h-5 rounded bg-[#1D0445] mb-1.5 border border-white/20" />
                  <span className="text-[10px] font-bold text-white block">Midnight Void</span>
                  <span className="text-[9px] font-mono text-[#CBD5E1] block">#1D0445</span>
                </div>
                <div className="p-2 rounded-lg bg-black/40 border border-white/10 text-center">
                  <div className="w-full h-5 rounded bg-[#082495] mb-1.5 shadow-[0_0_10px_rgba(8,36,149,0.4)]" />
                  <span className="text-[10px] font-bold text-white block">Cobalt Blue</span>
                  <span className="text-[9px] font-mono text-[#0FD3F2] block">#082495</span>
                </div>
                <div className="p-2 rounded-lg bg-black/40 border border-white/10 text-center">
                  <div className="w-full h-5 rounded bg-[#007CB8] mb-1.5 shadow-[0_0_10px_rgba(0,124,184,0.4)]" />
                  <span className="text-[10px] font-bold text-white block">Ocean Cerulean</span>
                  <span className="text-[9px] font-mono text-[#0FD3F2] block">#007CB8</span>
                </div>
                <div className="p-2 rounded-lg bg-black/40 border border-white/10 text-center">
                  <div className="w-full h-5 rounded bg-[#0FD3F2] mb-1.5 shadow-[0_0_10px_rgba(15,211,242,0.4)]" />
                  <span className="text-[10px] font-bold text-white block">Neon Cyan</span>
                  <span className="text-[9px] font-mono text-[#0FD3F2] block">#0FD3F2</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl neu-inset">
              <div>
                <p className="text-xs font-bold text-white">Interface Theme Mode</p>
                <p className="text-[11px] text-[#BEC7D5]">
                  Switch between deep space obsidian and frosted ceramic light
                </p>
              </div>
              <ThemeToggle variant="pill" />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl neu-inset">
              <div>
                <p className="text-xs font-bold text-white">Ambient Radial Lighting Glows</p>
                <p className="text-[11px] text-[#BEC7D5]">
                  Enable subtle Electric Cyan, Neon Magenta, and Lime Signal ambient light cones behind glass panels
                </p>
              </div>
              <input
                type="checkbox"
                checked={ambientGlow}
                onChange={(e) => setAmbientGlow(e.target.checked)}
                className="w-4 h-4 accent-primary rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl neu-inset">
              <div>
                <p className="text-xs font-bold text-white">Interactive Micro-Animations</p>
                <p className="text-[11px] text-[#BEC7D5]">
                  Smooth hover elevations, radar telemetry pulses, and drawer slide transitions
                </p>
              </div>
              <input
                type="checkbox"
                checked={microAnimations}
                onChange={(e) => setMicroAnimations(e.target.checked)}
                className="w-4 h-4 accent-primary rounded cursor-pointer"
              />
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};
