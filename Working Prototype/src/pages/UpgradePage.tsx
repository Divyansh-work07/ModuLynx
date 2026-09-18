import { useState } from 'react';
import { upgradeCards } from '@/data/demoData';
import type { UpgradeCard } from '@/types';
import { Wrench, AlertTriangle, CheckCircle2, XCircle, HelpCircle, ChevronRight, X, Wrench as WrenchIcon } from 'lucide-react';

const difficultyColor: Record<string, string> = {
  EASY: 'text-[#00ff9d] border-[#00ff9d]/30 bg-[#00ff9d]/10',
  MEDIUM: 'text-[#ffd93d] border-[#ffd93d]/30 bg-[#ffd93d]/10',
  HARD: 'text-[#ff4757] border-[#ff4757]/30 bg-[#ff4757]/10',
};

const compatIcon: Record<string, typeof CheckCircle2> = {
  COMPATIBLE: CheckCircle2,
  INCOMPATIBLE: XCircle,
  INSUFFICIENT_INFORMATION: HelpCircle,
};

const compatColor: Record<string, string> = {
  COMPATIBLE: 'text-[#00ff9d]',
  INCOMPATIBLE: 'text-[#ff4757]',
  INSUFFICIENT_INFORMATION: 'text-[#ffd93d]',
};

const installationSteps: Record<string, string[]> = {
  RAM: [
    'Shut down the laptop completely.',
    'Disconnect the power adapter and all peripherals.',
    'Open the bottom cover carefully using a Phillips screwdriver.',
    'Locate the SO-DIMM slot(s) on the motherboard.',
    'Release the existing module by pushing the metal clips outward.',
    'Align the new module with the slot — the notch position indicates correct orientation.',
    'Insert at a 30-degree angle and press down until the clips lock.',
    'Close the chassis and reattach the bottom cover.',
    'Boot the laptop and verify the new capacity in BIOS or the operating system.',
  ],
  SSD: [
    'Shut down the laptop and disconnect power.',
    'Open the bottom cover.',
    'Locate the M.2 SSD slot.',
    'Remove the retaining screw from the existing SSD.',
    'Pull the existing SSD out at a 30-degree angle.',
    'Insert the new SSD at the same angle.',
    'Secure with the retaining screw.',
    'If replacing the boot drive, clone the OS or perform a fresh install.',
    'Close the chassis and verify in BIOS that the SSD is detected.',
  ],
  'Wi-Fi': [
    'Shut down and disconnect power.',
    'Open the bottom cover.',
    'Locate the Wi-Fi M.2 card (smaller than SSD M.2).',
    'Carefully disconnect the antenna cables (note their positions).',
    'Remove the retaining screw and pull out the card.',
    'Insert the new Wi-Fi card.',
    'Reconnect antenna cables to the correct connectors.',
    'Secure with the screw and close the chassis.',
    'Install drivers in the operating system.',
  ],
  Cooling: [
    'Shut down and disconnect power.',
    'Open the bottom cover.',
    'Disconnect the fan connectors from the motherboard.',
    'Remove heatsink screws in the numbered order indicated on the heatsink.',
    'Carefully lift the cooling assembly.',
    'Clean old thermal paste from CPU/GPU dies with isopropyl alcohol.',
    'Apply new thermal paste or phase-change pad.',
    'Reinstall the cooling assembly, tightening screws in reverse order.',
    'Reconnect fans and close the chassis.',
  ],
  Battery: [
    'Shut down and disconnect power.',
    'Open the bottom cover.',
    'Disconnect the battery connector from the motherboard.',
    'Remove the battery retaining screws.',
    'Carefully lift the battery out (do not puncture or bend).',
    'Insert the new battery and secure with screws.',
    'Reconnect the battery connector.',
    'Close the chassis.',
    'Charge fully before first use.',
  ],
  Display: [
    'Shut down and disconnect power.',
    'Remove the bezel around the display (use plastic tools).',
    'Disconnect the eDP cable and backlight cable.',
    'Remove display panel retaining screws.',
    'Carefully lift out the old panel.',
    'Install the new panel and connect cables.',
    'Secure with screws and reattach the bezel.',
    'Boot and verify display functionality.',
  ],
};

function UpgradeDetail({ card, onClose }: { card: UpgradeCard; onClose: () => void }) {
  const CompatIcon = compatIcon[card.compatibility];
  const steps = installationSteps[card.category] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="hud-panel hud-panel-glow w-full max-w-2xl max-h-[85vh] overflow-y-auto p-5 animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="section-label">UPGRADE DETAILS</div>
            <h2 className="font-display text-xl tracking-wider text-[#00b4ff]">{card.category} UPGRADE</h2>
          </div>
          <button onClick={onClose} className="text-[#4a5a7a] hover:text-[#00b4ff]">
            <X size={20} />
          </button>
        </div>

        {/* Current → Proposed */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center mb-5">
          <div className="hud-panel p-3 text-center">
            <div className="section-label mb-1">CURRENT</div>
            <div className="text-sm text-[#8a9bb8]">{card.current}</div>
          </div>
          <ChevronRight size={20} className="text-[#ff8c42]" />
          <div className="hud-panel p-3 text-center border-[#00b4ff]/30">
            <div className="section-label mb-1">PROPOSED</div>
            <div className="text-sm text-[#00b4ff]">{card.proposed}</div>
          </div>
        </div>

        {/* Compatibility + Benefit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
          <div className="hud-panel p-3">
            <div className="section-label mb-2">COMPATIBILITY</div>
            <div className={`flex items-center gap-2 ${compatColor[card.compatibility]}`}>
              <CompatIcon size={18} />
              <span className="font-display text-sm tracking-wider">{card.compatibility.replace(/_/g, ' ')}</span>
            </div>
          </div>
          <div className="hud-panel p-3">
            <div className="section-label mb-2">DIFFICULTY</div>
            <span className={`badge border ${difficultyColor[card.difficulty]}`}>{card.difficulty}</span>
          </div>
        </div>

        <div className="hud-panel p-3 mb-5">
          <div className="section-label mb-2">EXPECTED BENEFIT</div>
          <p className="text-sm text-[#e8f0ff]">{card.benefit}</p>
        </div>

        {/* Warnings */}
        <div className="hud-panel p-3 mb-5 border-[#ff8c42]/20">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-[#ff8c42]" />
            <span className="font-display text-xs tracking-wider text-[#ff8c42]">WARNINGS</span>
          </div>
          <ul className="space-y-1">
            {card.warnings.map((w, i) => (
              <li key={i} className="text-xs text-[#8a9bb8] flex items-start gap-2">
                <span className="text-[#ff8c42]">›</span> {w}
              </li>
            ))}
          </ul>
        </div>

        {/* Tools */}
        <div className="hud-panel p-3 mb-5">
          <div className="flex items-center gap-2 mb-2">
            <WrenchIcon size={16} className="text-[#00b4ff]" />
            <span className="font-display text-xs tracking-wider text-[#00b4ff]">REQUIRED TOOLS</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {card.tools.map((t, i) => (
              <span key={i} className="badge badge-info">{t}</span>
            ))}
          </div>
        </div>

        {/* Verify */}
        <div className="hud-panel p-3 mb-5">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle size={16} className="text-[#ffd93d]" />
            <span className="font-display text-xs tracking-wider text-[#ffd93d]">THINGS TO VERIFY</span>
          </div>
          <ul className="space-y-1">
            {card.verify.map((v, i) => (
              <li key={i} className="text-xs text-[#8a9bb8] flex items-start gap-2">
                <span className="text-[#ffd93d]">›</span> {v}
              </li>
            ))}
          </ul>
        </div>

        {/* Installation guide */}
        {steps.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Wrench size={16} className="text-[#00ff9d]" />
              <span className="font-display text-sm tracking-wider text-[#00ff9d]">INSTALLATION GUIDE</span>
            </div>
            <div className="space-y-2">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-3 animate-slide-up" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="flex-shrink-0 w-8 h-8 rounded bg-[#00ff9d]/10 border border-[#00ff9d]/30 flex items-center justify-center font-mono text-xs text-[#00ff9d]">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="flex-1 py-1.5 text-sm text-[#e8f0ff]">{step}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-[#ff8c42]/10 border border-[#ff8c42]/30 rounded">
              <p className="text-xs text-[#ff8c42]">
                WARNING: Model-specific service procedures may differ. Always consult the manufacturer's service manual for your exact laptop model before opening the chassis.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function UpgradePage() {
  const [selectedCard, setSelectedCard] = useState<UpgradeCard | null>(null);

  return (
    <div className="space-y-4">
      <div className="hud-panel hud-panel-glow p-6">
        <div className="section-label mb-1">MODULE 03</div>
        <h1 className="font-display text-2xl lg:text-3xl font-black tracking-tight text-[#00b4ff] mb-2">UPGRADE CENTER</h1>
        <p className="text-[#8a9bb8] max-w-2xl">
          Browse upgrade paths with compatibility analysis, expected benefits, installation difficulty, and step-by-step guides.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {upgradeCards.map((card, i) => {
          const CompatIcon = compatIcon[card.compatibility];
          return (
            <div
              key={card.id}
              onClick={() => setSelectedCard(card)}
              className="hud-panel corner-brackets p-4 card-hover animate-slide-up cursor-pointer"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-sm tracking-wider text-[#00b4ff]">{card.category}</h3>
                <span className={`badge border ${difficultyColor[card.difficulty]}`}>{card.difficulty}</span>
              </div>

              <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center mb-3">
                <div className="text-center p-2 bg-[#0a1020] rounded">
                  <div className="section-label mb-1">CURRENT</div>
                  <div className="text-xs text-[#8a9bb8]">{card.current}</div>
                </div>
                <ChevronRight size={16} className="text-[#ff8c42]" />
                <div className="text-center p-2 bg-[#0a1020] rounded border border-[#00b4ff]/20">
                  <div className="section-label mb-1">PROPOSED</div>
                  <div className="text-xs text-[#00b4ff]">{card.proposed}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <CompatIcon size={14} className={compatColor[card.compatibility]} />
                <span className={`text-xs font-display tracking-wider ${compatColor[card.compatibility]}`}>
                  {card.compatibility.replace(/_/g, ' ')}
                </span>
              </div>

              <p className="text-xs text-[#8a9bb8] leading-relaxed">{card.benefit}</p>

              <div className="mt-3 pt-3 border-t border-[#00b4ff]/10 flex items-center justify-between">
                <span className="text-[0.6rem] font-mono text-[#4a5a7a]">{card.warnings.length} WARNINGS</span>
                <span className="text-[0.6rem] font-mono text-[#00b4ff]">VIEW DETAILS →</span>
              </div>
            </div>
          );
        })}
      </div>

      {selectedCard && <UpgradeDetail card={selectedCard} onClose={() => setSelectedCard(null)} />}
    </div>
  );
}
