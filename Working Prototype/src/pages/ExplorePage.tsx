import { useState, lazy, Suspense } from 'react';
import { LoadoutPanel } from '@/components/LoadoutPanel';
import { ScannerPanel } from '@/components/ScannerPanel';
import { laptops } from '@/data/demoData';
import type { Laptop } from '@/types';
import { Layers, RotateCcw, Maximize2, Info, ArrowRight } from 'lucide-react';
import type { Page } from '@/components/TopNav';

const LaptopViewer = lazy(() => import('@/three/LaptopViewer').then((m) => ({ default: m.LaptopViewer })));

interface ExplorePageProps {
  onNavigate: (page: Page) => void;
}

const componentInfoMap: Record<string, { title: string; description: string }> = {
  ram: { title: 'RAM MODULE', description: 'SO-DIMM memory module. DDR4 or DDR5 generation determines compatibility. Check the notch position and slot type.' },
  ssd: { title: 'SSD STORAGE', description: 'M.2 NVMe or SATA storage. Form factor (2230/2242/2280) must match the slot. PCIe generation affects speed.' },
  battery: { title: 'BATTERY PACK', description: 'Lithium-ion/polymer battery. Voltage and connector must match exactly. Manufacturer-specific form factor.' },
  cooling: { title: 'COOLING SYSTEM', description: 'Fans and heat pipes. Model-specific assembly. Thermal paste can be replaced for maintenance.' },
  motherboard: { title: 'MOTHERBOARD', description: 'Main circuit board. Determines all compatible components. Proprietary design — not upgradeable.' },
  display: { title: 'DISPLAY PANEL', description: 'LCD/OLED screen. eDP connector and pinout must match. Panel replacement requires exact match.' },
  keyboard: { title: 'KEYBOARD', description: 'Input module. Layout and connector vary by model. Some are integrated into the top chassis.' },
  topChassis: { title: 'TOP CHASSIS', description: 'Upper housing. Contains display and keyboard assembly. Model-specific.' },
  bottomChassis: { title: 'BOTTOM CHASSIS', description: 'Lower housing. Contains motherboard, battery, and cooling. Model-specific.' },
};

export function ExplorePage({ onNavigate }: ExplorePageProps) {
  const [selectedLaptop, setSelectedLaptop] = useState<Laptop | null>(laptops[1]);
  const [exploded, setExploded] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  const currentComponentInfo = selectedComponent ? componentInfoMap[selectedComponent] : null;

  return (
    <div className="space-y-4">
      {/* Hero area */}
      <div className="hud-panel hud-panel-glow p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00b4ff]/5 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-3xl">
          <div className="section-label mb-2">MODULYNX COMMAND CENTER</div>
          <h1 className="font-display text-3xl lg:text-5xl font-black tracking-tight text-[#e8f0ff] mb-3" style={{ textShadow: '0 0 30px rgba(0,180,255,0.2)' }}>
            EXPLORE YOUR <span className="text-[#00b4ff]">MACHINE</span>
          </h1>
          <p className="text-[#8a9bb8] text-lg mb-6 max-w-xl">
            Understand every component before you upgrade. Interactive 3D model, compatibility checking, and learning content.
          </p>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => onNavigate('compatibility')} className="hud-btn">
              Check Compatibility
            </button>
            <button onClick={() => onNavigate('upgrade')} className="hud-btn hud-btn-orange">
              Enter Configurator
            </button>
          </div>
        </div>
      </div>

      {/* Three-panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_300px] gap-4 h-[600px] lg:h-[700px]">
        {/* Left: Loadout */}
        <div className="h-[400px] lg:h-auto">
          <LoadoutPanel selectedLaptop={selectedLaptop} onSelectLaptop={setSelectedLaptop} />
        </div>

        {/* Center: 3D Viewer */}
        <div className="hud-panel corner-brackets h-[500px] lg:h-full flex flex-col relative">
          <div className="px-4 py-3 border-b border-[#00b4ff]/10 flex items-center justify-between flex-wrap gap-2">
            <div>
              <div className="section-label">CENTER VIEW</div>
              <h2 className="font-display text-sm tracking-[0.15em] text-[#00b4ff]">3D LAPTOP CORE</h2>
            </div>
            <span className="badge badge-demo">DEMO MODEL</span>
          </div>

          <div className="flex-1 relative bg-gradient-to-b from-[#060912] to-[#0a1020] scanline-overlay">
            <Suspense
              fallback={
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <div className="font-display text-sm text-[#00b4ff] mb-2 animate-pulse">LOADING 3D ENGINE...</div>
                    <div className="text-xs text-[#4a5a7a]">Initializing render pipeline</div>
                  </div>
                </div>
              }
            >
              <LaptopViewer
                exploded={exploded}
                selectedComponent={selectedComponent}
                onSelectComponent={setSelectedComponent}
              />
            </Suspense>

            {/* Component info overlay */}
            {currentComponentInfo && (
              <div className="absolute bottom-4 left-4 right-4 hud-panel hud-panel-glow p-4 animate-slide-up">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="section-label mb-1">SELECTED COMPONENT</div>
                    <h3 className="font-display text-sm tracking-wider text-[#00b4ff] mb-1">{currentComponentInfo.title}</h3>
                    <p className="text-xs text-[#8a9bb8] leading-relaxed">{currentComponentInfo.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedComponent(null)}
                    className="text-[#4a5a7a] hover:text-[#00b4ff] text-xs"
                  >
                    CLEAR
                  </button>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button
                onClick={() => setExploded(!exploded)}
                className={`hud-panel p-2 transition-all ${exploded ? 'bg-[#ff8c42]/15 border-[#ff8c42]/40' : 'hover:bg-[#00b4ff]/10'}`}
                title="Exploded View"
              >
                <Layers size={18} className={exploded ? 'text-[#ff8c42]' : 'text-[#8a9bb8]'} />
              </button>
              <button
                onClick={() => { setExploded(false); setSelectedComponent(null); }}
                className="hud-panel p-2 hover:bg-[#00b4ff]/10 transition-all"
                title="Reset View"
              >
                <RotateCcw size={18} className="text-[#8a9bb8]" />
              </button>
            </div>

            {/* Hint */}
            <div className="absolute top-4 left-4 flex items-center gap-2 text-xs text-[#4a5a7a] font-mono">
              <Info size={12} />
              <span>DRAG TO ROTATE • CLICK COMPONENTS</span>
            </div>
          </div>

          {/* Exploded view layers */}
          {exploded && (
            <div className="px-4 py-3 border-t border-[#00b4ff]/10 animate-fade-in">
              <div className="section-label mb-2">EXPLODED LAYERS</div>
              <div className="flex flex-wrap gap-1.5">
                {['Display', 'Top Chassis', 'Keyboard', 'Motherboard', 'RAM', 'SSD', 'Cooling', 'Battery', 'Bottom Chassis'].map((layer, i) => (
                  <span key={layer} className="text-[0.6rem] font-mono text-[#4a5a7a] px-2 py-0.5 bg-[#0a1020] border border-[#00b4ff]/10 rounded">
                    {String(i + 1).padStart(2, '0')} {layer.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Scanner */}
        <div className="h-[400px] lg:h-auto">
          <ScannerPanel selectedComponent={selectedComponent} onSelectComponent={setSelectedComponent} />
        </div>
      </div>

      {/* Sustainability section */}
      <div className="hud-panel p-5 lg:p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded bg-[#00ff9d]/10 border border-[#00ff9d]/30 flex items-center justify-center">
            <Maximize2 size={18} className="text-[#00ff9d]" />
          </div>
          <div>
            <h3 className="font-display text-sm tracking-wider text-[#00ff9d] mb-2">SUSTAINABILITY</h3>
            <p className="text-sm text-[#8a9bb8] leading-relaxed max-w-3xl">
              Repairing and upgrading laptops extends device lifespan and reduces electronic waste. Upgrading RAM or storage instead of buying a new laptop saves resources and reduces e-waste. MODULYNX encourages informed upgrades over unnecessary replacement.
            </p>
            <button onClick={() => onNavigate('learn')} className="mt-3 flex items-center gap-2 text-xs font-display tracking-wider text-[#00b4ff] hover:text-[#2ed4ff] transition-colors">
              LEARN MORE <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
