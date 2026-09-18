import { useState } from 'react';
import { laptops } from '@/data/demoData';
import type { Laptop, Brand } from '@/types';
import { ChevronDown, Cpu, MemoryStick, HardDrive, Battery, Fan, Monitor, CircuitBoard } from 'lucide-react';

interface LoadoutPanelProps {
  selectedLaptop: Laptop | null;
  onSelectLaptop: (laptop: Laptop) => void;
}

const brands: Brand[] = ['ASUS', 'Lenovo', 'HP', 'Dell'];

const specIcons: Record<string, typeof Cpu> = {
  cpu: Cpu,
  ram: MemoryStick,
  storage: HardDrive,
  battery: Battery,
  cooling: Fan,
  display: Monitor,
  gpu: CircuitBoard,
};

export function LoadoutPanel({ selectedLaptop, onSelectLaptop }: LoadoutPanelProps) {
  const [brandOpen, setBrandOpen] = useState(true);
  const [modelOpen, setModelOpen] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  const filteredLaptops = selectedBrand
    ? laptops.filter((l) => l.brand === selectedBrand)
    : laptops;

  return (
    <div className="hud-panel corner-brackets h-full flex flex-col">
      <div className="px-4 py-3 border-b border-[#00b4ff]/10 flex items-center justify-between">
        <div>
          <div className="section-label">PANEL 01</div>
          <h2 className="font-display text-sm tracking-[0.15em] text-[#00b4ff]">LAPTOP LOADOUT</h2>
        </div>
        <span className="badge badge-demo">DEMO DATA</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Brand selector */}
        <div>
          <button
            onClick={() => setBrandOpen(!brandOpen)}
            className="w-full flex items-center justify-between text-left group"
          >
            <span className="section-label">SELECT BRAND</span>
            <ChevronDown size={14} className={`text-[#4a5a7a] transition-transform ${brandOpen ? 'rotate-180' : ''}`} />
          </button>
          {brandOpen && (
            <div className="grid grid-cols-2 gap-2 mt-3">
              <button
                onClick={() => setSelectedBrand(null)}
                className={`px-3 py-2 text-sm font-display tracking-wider rounded transition-all ${
                  selectedBrand === null
                    ? 'bg-[#00b4ff]/15 text-[#00b4ff] border border-[#00b4ff]/40'
                    : 'text-[#8a9bb8] border border-[#00b4ff]/10 hover:border-[#00b4ff]/30'
                }`}
              >
                ALL
              </button>
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`px-3 py-2 text-sm font-display tracking-wider rounded transition-all ${
                    selectedBrand === brand
                      ? 'bg-[#00b4ff]/15 text-[#00b4ff] border border-[#00b4ff]/40'
                      : 'text-[#8a9bb8] border border-[#00b4ff]/10 hover:border-[#00b4ff]/30'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Model list */}
        <div>
          <button
            onClick={() => setModelOpen(!modelOpen)}
            className="w-full flex items-center justify-between text-left group"
          >
            <span className="section-label">SELECT MODEL</span>
            <ChevronDown size={14} className={`text-[#4a5a7a] transition-transform ${modelOpen ? 'rotate-180' : ''}`} />
          </button>
          {modelOpen && (
            <div className="space-y-2 mt-3">
              {filteredLaptops.map((laptop) => (
                <button
                  key={laptop.id}
                  onClick={() => onSelectLaptop(laptop)}
                  className={`w-full text-left p-3 rounded transition-all card-hover ${
                    selectedLaptop?.id === laptop.id
                      ? 'bg-[#00b4ff]/10 border border-[#00b4ff]/40'
                      : 'bg-[#0a1020] border border-[#00b4ff]/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-display text-xs tracking-wider text-[#ff8c42]">{laptop.brand}</span>
                    <span className="font-mono text-[0.6rem] text-[#4a5a7a]">{laptop.ramType}</span>
                  </div>
                  <div className="text-sm text-[#e8f0ff] font-medium">{laptop.model}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Specs display */}
        {selectedLaptop && (
          <div className="animate-slide-up">
            <div className="section-label mb-2">SPECIFICATIONS</div>
            <div className="hud-panel p-3 space-y-1">
              {Object.entries(selectedLaptop.specs).map(([key, value]) => {
                const Icon = specIcons[key] || Cpu;
                return (
                  <div key={key} className="data-row">
                    <span className="label flex items-center gap-2">
                      <Icon size={12} className="text-[#00b4ff]" />
                      {key.toUpperCase()}
                    </span>
                    <span className="value text-xs">{value}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="hud-panel p-2 text-center">
                <div className="section-label">RAM SLOTS</div>
                <div className="font-display text-lg text-[#00b4ff]">{selectedLaptop.ramSlots}</div>
              </div>
              <div className="hud-panel p-2 text-center">
                <div className="section-label">PCIe GEN</div>
                <div className="font-display text-lg text-[#00b4ff]">Gen {selectedLaptop.pcieGen}</div>
              </div>
              <div className="hud-panel p-2 text-center">
                <div className="section-label">MAX RAM</div>
                <div className="font-display text-lg text-[#00b4ff]">{selectedLaptop.ramMaxCapacityGB}GB</div>
              </div>
              <div className="hud-panel p-2 text-center">
                <div className="section-label">SSD SLOTS</div>
                <div className="font-display text-lg text-[#00b4ff]">{selectedLaptop.ssdSlots.length}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
