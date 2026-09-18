import { useState } from 'react';
import { componentDetails } from '@/data/demoData';
import type { ComponentType } from '@/types';
import { MemoryStick, HardDrive, CircuitBoard, Battery, Fan, Usb, ChevronRight, X } from 'lucide-react';

interface ScannerPanelProps {
  selectedComponent: string | null;
  onSelectComponent: (component: string | null) => void;
}

const componentIcons: Record<string, typeof MemoryStick> = {
  RAM: MemoryStick,
  STORAGE: HardDrive,
  MOTHERBOARD: CircuitBoard,
  BATTERY: Battery,
  COOLING: Fan,
  PORTS: Usb,
};

const componentOrder: ComponentType[] = ['RAM', 'STORAGE', 'MOTHERBOARD', 'BATTERY', 'COOLING', 'PORTS'];

export function ScannerPanel({ selectedComponent, onSelectComponent }: ScannerPanelProps) {
  const [detailType, setDetailType] = useState<ComponentType | null>(null);
  const detail = componentDetails.find((c) => c.type === detailType);

  const handleSelect = (type: ComponentType) => {
    onSelectComponent(type);
    setDetailType(type);
  };

  return (
    <div className="hud-panel corner-brackets h-full flex flex-col">
      <div className="px-4 py-3 border-b border-[#00b4ff]/10 flex items-center justify-between">
        <div>
          <div className="section-label">PANEL 02</div>
          <h2 className="font-display text-sm tracking-[0.15em] text-[#00b4ff]">COMPONENT SCANNER</h2>
        </div>
        <span className="status-dot bg-[#00ff9d] pulse-dot" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {componentOrder.map((type) => {
          const info = componentDetails.find((c) => c.type === type)!;
          const Icon = componentIcons[type] || MemoryStick;
          const isActive = selectedComponent === type;

          return (
            <div
              key={type}
              onClick={() => handleSelect(type)}
              className={`p-3 rounded cursor-pointer transition-all card-hover ${
                isActive
                  ? 'bg-[#00b4ff]/10 border border-[#00b4ff]/40'
                  : 'bg-[#0a1020] border border-[#00b4ff]/10'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon size={16} className={isActive ? 'text-[#00b4ff]' : 'text-[#8a9bb8]'} />
                  <span className="font-display text-xs tracking-wider text-[#e8f0ff]">{info.title}</span>
                </div>
                <ChevronRight size={14} className={`text-[#4a5a7a] transition-transform ${isActive ? 'rotate-90' : ''}`} />
              </div>
              <div className="text-[0.65rem] font-mono text-[#4a5a7a] uppercase tracking-wider">{info.category}</div>
              {isActive && (
                <div className="mt-3 pt-3 border-t border-[#00b4ff]/20 animate-fade-in">
                  <div className="space-y-1 mb-3">
                    {Object.entries(info.details).map(([key, value]) => (
                      <div key={key} className="data-row">
                        <span className="label">{key}</span>
                        <span className="value text-xs">{value}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-[#8a9bb8] leading-relaxed">{info.description}</p>
                </div>
              )}
            </div>
          );
        })}

        {/* Detail modal */}
        {detail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setDetailType(null)}>
            <div className="hud-panel hud-panel-glow w-full max-w-md p-5" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-sm tracking-wider text-[#00b4ff]">{detail.title}</h3>
                <button onClick={() => setDetailType(null)} className="text-[#4a5a7a] hover:text-[#00b4ff]">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-1 mb-4">
                {Object.entries(detail.details).map(([key, value]) => (
                  <div key={key} className="data-row">
                    <span className="label">{key}</span>
                    <span className="value text-xs">{value}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-[#8a9bb8] leading-relaxed">{detail.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
