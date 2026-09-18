import { useState } from 'react';
import { laptops } from '@/data/demoData';
import type { Laptop, CompatibilityResult } from '@/types';
import { analyzeRAMCompatibility, analyzeSSDCompatibility, translateInterface } from '@/utils/compatibilityEngine';
import { Play, AlertTriangle, CheckCircle2, XCircle, HelpCircle, ArrowRight, Repeat } from 'lucide-react';

type ComponentCategory = 'RAM' | 'SSD';

interface CheckDisplay {
  layer: string;
  status: string;
  score: number;
  bar: string;
  colorClass: string;
}

function statusToDisplay(status: string): { colorClass: string; bar: string; label: string } {
  switch (status) {
    case 'PASS':
      return { colorClass: 'text-[#00ff9d]', bar: 'bg-[#00ff9d]', label: 'PASS' };
    case 'FAIL':
      return { colorClass: 'text-[#ff4757]', bar: 'bg-[#ff4757]', label: 'FAIL' };
    case 'REVIEW':
      return { colorClass: 'text-[#ffd93d]', bar: 'bg-[#ffd93d]', label: 'REVIEW' };
    default:
      return { colorClass: 'text-[#4a5a7a]', bar: 'bg-[#4a5a7a]', label: 'UNKNOWN' };
  }
}

function overallToDisplay(overall: string) {
  switch (overall) {
    case 'COMPATIBLE':
      return { icon: CheckCircle2, color: 'text-[#00ff9d]', bg: 'bg-[#00ff9d]/10', border: 'border-[#00ff9d]/30', label: 'COMPATIBLE' };
    case 'INCOMPATIBLE':
      return { icon: XCircle, color: 'text-[#ff4757]', bg: 'bg-[#ff4757]/10', border: 'border-[#ff4757]/30', label: 'INCOMPATIBLE' };
    default:
      return { icon: AlertTriangle, color: 'text-[#ffd93d]', bg: 'bg-[#ffd93d]/10', border: 'border-[#ffd93d]/30', label: 'INSUFFICIENT INFORMATION' };
  }
}

function AnalysisDisplay({ result }: { result: CompatibilityResult }) {
  const overall = overallToDisplay(result.overall);
  const OverallIcon = overall.icon;

  return (
    <div className="animate-fade-in space-y-4">
      {/* Layer analysis */}
      <div className="hud-panel p-4">
        <div className="section-label mb-3">COMPATIBILITY ANALYSIS</div>
        <div className="space-y-3">
          {result.checks.map((check, i) => {
            const display = statusToDisplay(check.status);
            const filledBlocks = Math.round(check.score / 100 * 12);
            const bar = '█'.repeat(filledBlocks) + '░'.repeat(12 - filledBlocks);
            return (
              <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs text-[#8a9bb8] tracking-wider">{check.layer}</span>
                  <span className={`font-mono text-xs font-bold ${display.colorClass}`}>{display.label}</span>
                </div>
                <div className="font-mono text-xs text-[#4a5a7a] mb-1">{bar}</div>
                <div className="space-y-0.5">
                  {check.details.map((d, j) => (
                    <div key={j} className={`text-xs ${d.startsWith('✓') ? 'text-[#00ff9d]' : d.startsWith('✗') ? 'text-[#ff4757]' : 'text-[#ffd93d]'}`}>
                      {d}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Overall result */}
      <div className={`hud-panel p-4 border ${overall.border} ${overall.bg}`}>
        <div className="flex items-center gap-3 mb-2">
          <OverallIcon size={24} className={overall.color} />
          <div>
            <div className="section-label">RESULT</div>
            <div className={`font-display text-lg tracking-wider ${overall.color}`}>{overall.label}</div>
          </div>
        </div>
        <p className="text-sm text-[#8a9bb8]">{result.summary}</p>
      </div>
    </div>
  );
}

export function CompatibilityPage() {
  const [selectedLaptop, setSelectedLaptop] = useState<Laptop | null>(laptops[1]);
  const [category, setCategory] = useState<ComponentCategory>('RAM');
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // RAM state
  const [ramCurrentGen, setRamCurrentGen] = useState<'DDR4' | 'DDR5'>('DDR5');
  const [ramCurrentCap, setRamCurrentCap] = useState(8);
  const [ramCurrentSpeed, setRamCurrentSpeed] = useState(4800);
  const [ramUpgradeGen, setRamUpgradeGen] = useState<'DDR4' | 'DDR5'>('DDR5');
  const [ramUpgradeCap, setRamUpgradeCap] = useState(16);
  const [ramUpgradeSpeed, setRamUpgradeSpeed] = useState(4800);

  // SSD state
  const [ssdCurrentFF, setSsdCurrentFF] = useState('2280');
  const [ssdCurrentIf, setSsdCurrentIf] = useState<'NVMe' | 'SATA'>('NVMe');
  const [ssdCurrentGen, setSsdCurrentGen] = useState(4);
  const [ssdUpgradeFF, setSsdUpgradeFF] = useState('2280');
  const [ssdUpgradeIf, setSsdUpgradeIf] = useState<'NVMe' | 'SATA'>('NVMe');
  const [ssdUpgradeGen, setSsdUpgradeGen] = useState(4);

  // Translator state
  const [source, setSource] = useState('M.2 2230 NVMe');
  const [target, setTarget] = useState('M.2 2280 NVMe');
  const [translationResult, setTranslationResult] = useState<ReturnType<typeof translateInterface> | null>(null);

  const runAnalysis = () => {
    if (!selectedLaptop) return;
    setAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      if (category === 'RAM') {
        setResult(
          analyzeRAMCompatibility(selectedLaptop, {
            currentGen: ramCurrentGen,
            currentCapacity: ramCurrentCap,
            currentSpeed: ramCurrentSpeed,
            upgradeGen: ramUpgradeGen,
            upgradeCapacity: ramUpgradeCap,
            upgradeSpeed: ramUpgradeSpeed,
          })
        );
      } else {
        setResult(
          analyzeSSDCompatibility(selectedLaptop, {
            currentFormFactor: ssdCurrentFF,
            currentInterface: ssdCurrentIf,
            currentPcieGen: ssdCurrentGen,
            upgradeFormFactor: ssdUpgradeFF,
            upgradeInterface: ssdUpgradeIf,
            upgradePcieGen: ssdUpgradeGen,
          })
        );
      }
      setAnalyzing(false);
    }, 1200);
  };

  const runTranslation = () => {
    setTranslationResult(translateInterface(source, target));
  };

  const translationColor: Record<string, string> = {
    DIRECT_COMPATIBILITY: 'text-[#00ff9d]',
    ADAPTER_MAY_BE_REQUIRED: 'text-[#ffd93d]',
    CONVERTER_MAY_BE_REQUIRED: 'text-[#ff8c42]',
    NOT_RECOMMENDED: 'text-[#ff4757]',
    INSUFFICIENT_INFORMATION: 'text-[#4a5a7a]',
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="hud-panel hud-panel-glow p-6">
        <div className="section-label mb-1">MODULE 02</div>
        <h1 className="font-display text-2xl lg:text-3xl font-black tracking-tight text-[#00b4ff] mb-2">COMPATIBILITY CENTER</h1>
        <p className="text-[#8a9bb8] max-w-2xl">
          Multi-layer compatibility analysis. The engine evaluates physical, thermal, power, protocol, and firmware constraints — not just component names.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Configuration */}
        <div className="space-y-4">
          <div className="hud-panel corner-brackets p-4">
            <div className="section-label mb-3">SELECT LAPTOP</div>
            <select
              value={selectedLaptop?.id || ''}
              onChange={(e) => setSelectedLaptop(laptops.find((l) => l.id === e.target.value) || null)}
              className="w-full bg-[#0a1020] border border-[#00b4ff]/20 text-[#e8f0ff] px-3 py-2 rounded font-body text-sm outline-none focus:border-[#00b4ff]/50"
            >
              {laptops.map((l) => (
                <option key={l.id} value={l.id}>{l.brand} {l.model} — DEMO</option>
              ))}
            </select>
            {selectedLaptop && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="text-center p-2 bg-[#0a1020] rounded">
                  <div className="section-label">RAM</div>
                  <div className="text-xs text-[#00b4ff] font-medium">{selectedLaptop.ramType}</div>
                </div>
                <div className="text-center p-2 bg-[#0a1020] rounded">
                  <div className="section-label">PCIe</div>
                  <div className="text-xs text-[#00b4ff] font-medium">Gen {selectedLaptop.pcieGen}</div>
                </div>
                <div className="text-center p-2 bg-[#0a1020] rounded">
                  <div className="section-label">SSD</div>
                  <div className="text-xs text-[#00b4ff] font-medium">M.2 {selectedLaptop.ssdFormFactors.join('/')}</div>
                </div>
              </div>
            )}
          </div>

          <div className="hud-panel corner-brackets p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="section-label">COMPONENT TYPE</div>
              <div className="flex gap-1">
                <button
                  onClick={() => setCategory('RAM')}
                  className={`px-3 py-1 text-xs font-display tracking-wider rounded transition-all ${category === 'RAM' ? 'bg-[#00b4ff]/15 text-[#00b4ff] border border-[#00b4ff]/40' : 'text-[#4a5a7a] border border-[#00b4ff]/10'}`}
                >RAM</button>
                <button
                  onClick={() => setCategory('SSD')}
                  className={`px-3 py-1 text-xs font-display tracking-wider rounded transition-all ${category === 'SSD' ? 'bg-[#00b4ff]/15 text-[#00b4ff] border border-[#00b4ff]/40' : 'text-[#4a5a7a] border border-[#00b4ff]/10'}`}
                >SSD</button>
              </div>
            </div>

            {category === 'RAM' ? (
              <div className="space-y-3">
                <div>
                  <div className="section-label mb-2">CURRENT COMPONENT</div>
                  <div className="grid grid-cols-3 gap-2">
                    <select value={ramCurrentGen} onChange={(e) => setRamCurrentGen(e.target.value as 'DDR4' | 'DDR5')} className="bg-[#0a1020] border border-[#00b4ff]/20 text-[#e8f0ff] px-2 py-1.5 rounded text-xs outline-none">
                      <option value="DDR4">DDR4</option>
                      <option value="DDR5">DDR5</option>
                    </select>
                    <select value={ramCurrentCap} onChange={(e) => setRamCurrentCap(Number(e.target.value))} className="bg-[#0a1020] border border-[#00b4ff]/20 text-[#e8f0ff] px-2 py-1.5 rounded text-xs outline-none">
                      <option value={4}>4GB</option>
                      <option value={8}>8GB</option>
                      <option value={16}>16GB</option>
                      <option value={32}>32GB</option>
                    </select>
                    <select value={ramCurrentSpeed} onChange={(e) => setRamCurrentSpeed(Number(e.target.value))} className="bg-[#0a1020] border border-[#00b4ff]/20 text-[#e8f0ff] px-2 py-1.5 rounded text-xs outline-none">
                      <option value={3200}>3200MHz</option>
                      <option value={4800}>4800MHz</option>
                      <option value={5600}>5600MHz</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-center">
                  <ArrowRight size={20} className="text-[#ff8c42] rotate-90" />
                </div>
                <div>
                  <div className="section-label mb-2">UPGRADE COMPONENT</div>
                  <div className="grid grid-cols-3 gap-2">
                    <select value={ramUpgradeGen} onChange={(e) => setRamUpgradeGen(e.target.value as 'DDR4' | 'DDR5')} className="bg-[#0a1020] border border-[#00b4ff]/20 text-[#e8f0ff] px-2 py-1.5 rounded text-xs outline-none">
                      <option value="DDR4">DDR4</option>
                      <option value="DDR5">DDR5</option>
                    </select>
                    <select value={ramUpgradeCap} onChange={(e) => setRamUpgradeCap(Number(e.target.value))} className="bg-[#0a1020] border border-[#00b4ff]/20 text-[#e8f0ff] px-2 py-1.5 rounded text-xs outline-none">
                      <option value={4}>4GB</option>
                      <option value={8}>8GB</option>
                      <option value={16}>16GB</option>
                      <option value={32}>32GB</option>
                      <option value={64}>64GB</option>
                    </select>
                    <select value={ramUpgradeSpeed} onChange={(e) => setRamUpgradeSpeed(Number(e.target.value))} className="bg-[#0a1020] border border-[#00b4ff]/20 text-[#e8f0ff] px-2 py-1.5 rounded text-xs outline-none">
                      <option value={3200}>3200MHz</option>
                      <option value={4800}>4800MHz</option>
                      <option value={5600}>5600MHz</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <div className="section-label mb-2">CURRENT COMPONENT</div>
                  <div className="grid grid-cols-3 gap-2">
                    <select value={ssdCurrentFF} onChange={(e) => setSsdCurrentFF(e.target.value)} className="bg-[#0a1020] border border-[#00b4ff]/20 text-[#e8f0ff] px-2 py-1.5 rounded text-xs outline-none">
                      <option value="2230">M.2 2230</option>
                      <option value="2242">M.2 2242</option>
                      <option value="2280">M.2 2280</option>
                    </select>
                    <select value={ssdCurrentIf} onChange={(e) => setSsdCurrentIf(e.target.value as 'NVMe' | 'SATA')} className="bg-[#0a1020] border border-[#00b4ff]/20 text-[#e8f0ff] px-2 py-1.5 rounded text-xs outline-none">
                      <option value="NVMe">NVMe</option>
                      <option value="SATA">SATA</option>
                    </select>
                    <select value={ssdCurrentGen} onChange={(e) => setSsdCurrentGen(Number(e.target.value))} className="bg-[#0a1020] border border-[#00b4ff]/20 text-[#e8f0ff] px-2 py-1.5 rounded text-xs outline-none">
                      <option value={3}>Gen 3</option>
                      <option value={4}>Gen 4</option>
                      <option value={5}>Gen 5</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-center">
                  <ArrowRight size={20} className="text-[#ff8c42] rotate-90" />
                </div>
                <div>
                  <div className="section-label mb-2">UPGRADE COMPONENT</div>
                  <div className="grid grid-cols-3 gap-2">
                    <select value={ssdUpgradeFF} onChange={(e) => setSsdUpgradeFF(e.target.value)} className="bg-[#0a1020] border border-[#00b4ff]/20 text-[#e8f0ff] px-2 py-1.5 rounded text-xs outline-none">
                      <option value="2230">M.2 2230</option>
                      <option value="2242">M.2 2242</option>
                      <option value="2280">M.2 2280</option>
                    </select>
                    <select value={ssdUpgradeIf} onChange={(e) => setSsdUpgradeIf(e.target.value as 'NVMe' | 'SATA')} className="bg-[#0a1020] border border-[#00b4ff]/20 text-[#e8f0ff] px-2 py-1.5 rounded text-xs outline-none">
                      <option value="NVMe">NVMe</option>
                      <option value="SATA">SATA</option>
                    </select>
                    <select value={ssdUpgradeGen} onChange={(e) => setSsdUpgradeGen(Number(e.target.value))} className="bg-[#0a1020] border border-[#00b4ff]/20 text-[#e8f0ff] px-2 py-1.5 rounded text-xs outline-none">
                      <option value={3}>Gen 3</option>
                      <option value={4}>Gen 4</option>
                      <option value={5}>Gen 5</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <button onClick={runAnalysis} disabled={!selectedLaptop || analyzing} className="hud-btn w-full mt-4 flex items-center justify-center gap-2 disabled:opacity-50">
              {analyzing ? (
                <>
                  <span className="animate-pulse">ANALYZING...</span>
                </>
              ) : (
                <>
                  <Play size={14} /> RUN ANALYSIS
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Results */}
        <div>
          {analyzing && (
            <div className="hud-panel p-8 flex flex-col items-center justify-center min-h-[300px]">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 border-2 border-[#00b4ff]/20 rounded-full" />
                <div className="absolute inset-0 border-2 border-transparent border-t-[#00b4ff] rounded-full animate-spin" />
              </div>
              <div className="font-display text-sm text-[#00b4ff] tracking-wider animate-pulse">RUNNING ANALYSIS</div>
              <div className="text-xs text-[#4a5a7a] mt-2 font-mono">EVALUATING 5 LAYERS...</div>
            </div>
          )}
          {!analyzing && result && <AnalysisDisplay result={result} />}
          {!analyzing && !result && (
            <div className="hud-panel p-8 flex flex-col items-center justify-center min-h-[300px]">
              <HelpCircle size={32} className="text-[#4a5a7a] mb-3" />
              <div className="font-display text-sm text-[#8a9bb8] tracking-wider text-center">AWAITING ANALYSIS</div>
              <div className="text-xs text-[#4a5a7a] mt-2 text-center">Select components and run analysis to see results</div>
            </div>
          )}
        </div>
      </div>

      {/* Compatibility Translator */}
      <div className="hud-panel corner-brackets p-5">
        <div className="flex items-center gap-2 mb-1">
          <Repeat size={18} className="text-[#ff8c42]" />
          <h2 className="font-display text-lg tracking-wider text-[#ff8c42]">COMPATIBILITY TRANSLATOR</h2>
        </div>
        <p className="text-sm text-[#8a9bb8] mb-4">Determine if an adapter, converter, or enclosure is needed between two interfaces.</p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto] gap-3 items-end">
          <div>
            <div className="section-label mb-2">SOURCE COMPONENT</div>
            <input value={source} onChange={(e) => setSource(e.target.value)} className="w-full bg-[#0a1020] border border-[#00b4ff]/20 text-[#e8f0ff] px-3 py-2 rounded text-sm outline-none focus:border-[#00b4ff]/50 font-mono" placeholder="e.g. M.2 2230 NVMe" />
          </div>
          <ArrowRight size={20} className="text-[#ff8c42] hidden lg:block" />
          <div>
            <div className="section-label mb-2">TARGET INTERFACE</div>
            <input value={target} onChange={(e) => setTarget(e.target.value)} className="w-full bg-[#0a1020] border border-[#00b4ff]/20 text-[#e8f0ff] px-3 py-2 rounded text-sm outline-none focus:border-[#00b4ff]/50 font-mono" placeholder="e.g. M.2 2280 NVMe" />
          </div>
          <button onClick={runTranslation} className="hud-btn hud-btn-orange flex items-center gap-2">
            <Play size={14} /> TRANSLATE
          </button>
        </div>

        {translationResult && (
          <div className="mt-4 animate-fade-in">
            <div className="hud-panel p-4">
              <div className="section-label mb-2">TRANSLATION RESULT</div>
              <div className={`font-display text-lg tracking-wider mb-2 ${translationColor[translationResult.result]}`}>
                {translationResult.result.replace(/_/g, ' ')}
              </div>
              <p className="text-sm text-[#e8f0ff] mb-3">{translationResult.message}</p>
              <div className="space-y-1">
                {translationResult.details.map((d, i) => (
                  <div key={i} className="text-xs text-[#8a9bb8] flex items-start gap-2">
                    <span className="text-[#ff8c42]">›</span> {d}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="section-label">TRY:</span>
          {['M.2 2230 → M.2 2280', 'DDR4 → DDR5', 'NVMe → SATA', 'USB-C → HDMI', 'USB-C → DisplayPort'].map((preset) => {
            const [s, t] = preset.split(' → ');
            return (
              <button
                key={preset}
                onClick={() => { setSource(s); setTarget(t); }}
                className="text-[0.65rem] font-mono text-[#4a5a7a] px-2 py-1 bg-[#0a1020] border border-[#00b4ff]/10 rounded hover:border-[#00b4ff]/30 hover:text-[#00b4ff] transition-all"
              >
                {preset}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
