import { useState, useRef } from 'react';
import { Upload, Scan, Cpu, CircuitBoard, Zap, AlertTriangle, X, CheckCircle2 } from 'lucide-react';

interface ScanResult {
  boardModel: string;
  ocrResult: string;
  connectors: string[];
  confidence: string;
}

export function ScannerPage() {
  const [image, setImage] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, etc.)');
      return;
    }
    setError(null);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target?.result as string);
    reader.onerror = () => setError('Could not read the image file.');
    reader.readAsDataURL(file);
  };

  const runScan = () => {
    if (!image) return;
    setScanning(true);
    setResult(null);
    setTimeout(() => {
      setScanning(false);
      setResult({
        boardModel: 'Potential: Generic Laptop Motherboard — VERIFY MANUALLY',
        ocrResult: '[DEMO] Detected text regions: CPU_VRM, M.2_SLOT, SO-DIMM_CHA, BIOS_CHIP',
        connectors: [
          'M.2 Slot (upper region)',
          'SO-DIMM Slot A (left)',
          'SO-DIMM Slot B (right)',
          'CPU VRM area (center)',
          'BIOS chip (lower left)',
          'Fan connector (top edge)',
          'Battery connector (right edge)',
        ],
        confidence: 'DEMO ONLY — No actual AI model connected',
      });
    }, 2500);
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setError(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="space-y-4">
      <div className="hud-panel hud-panel-glow p-6">
        <div className="section-label mb-1">MODULE 05</div>
        <h1 className="font-display text-2xl lg:text-3xl font-black tracking-tight text-[#00b4ff] mb-2">AI BOARD IDENTIFICATION</h1>
        <p className="text-[#8a9bb8] max-w-2xl">
          Upload a motherboard image for demo analysis. The interface is structured so a YOLO/OpenCV/OCR backend can be connected later.
        </p>
        <div className="mt-3 flex items-center gap-2">
          <span className="badge badge-demo">DEMO ANALYSIS</span>
          <span className="badge badge-warn">NO AI MODEL CONNECTED</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Upload area */}
        <div className="hud-panel corner-brackets p-5">
          <div className="section-label mb-3">IMAGE INPUT</div>

          {!image ? (
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-[#00b4ff]/20 rounded-lg p-12 text-center cursor-pointer hover:border-[#00b4ff]/50 hover:bg-[#00b4ff]/5 transition-all"
            >
              <Upload size={32} className="text-[#4a5a7a] mx-auto mb-3" />
              <div className="font-display text-sm text-[#8a9bb8] tracking-wider mb-1">UPLOAD MOTHERBOARD IMAGE</div>
              <div className="text-xs text-[#4a5a7a]">Click to select an image file</div>
              <div className="text-xs text-[#4a5a7a] mt-1">PNG, JPG, WEBP</div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative rounded-lg overflow-hidden border border-[#00b4ff]/20 bg-black/40">
                <img src={image} alt="Uploaded motherboard" className="w-full h-64 object-contain" />
                {scanning && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="absolute inset-x-0 h-1 bg-[#00b4ff]/60" style={{ animation: 'scanline 2s linear infinite', boxShadow: '0 0 16px #00b4ff' }} />
                    <div className="font-display text-sm text-[#00b4ff] tracking-wider animate-pulse">SCANNING...</div>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={runScan} disabled={scanning || !image} className="hud-btn flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
                  <Scan size={14} /> {scanning ? 'SCANNING...' : 'RUN SCAN'}
                </button>
                <button onClick={reset} className="hud-btn hud-btn-ghost flex items-center gap-2">
                  <X size={14} /> CLEAR
                </button>
              </div>
            </div>
          )}

          <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />

          {error && (
            <div className="mt-3 p-3 bg-[#ff4757]/10 border border-[#ff4757]/30 rounded flex items-center gap-2">
              <AlertTriangle size={16} className="text-[#ff4757]" />
              <span className="text-xs text-[#ff4757]">{error}</span>
            </div>
          )}

          {/* Architecture note */}
          <div className="mt-4 p-3 bg-[#0a1020] rounded border border-[#00b4ff]/10">
            <div className="section-label mb-1">BACKEND ARCHITECTURE</div>
            <div className="text-xs text-[#4a5a7a] font-mono leading-relaxed">
              <div>1. Image upload → Edge Function</div>
              <div>2. YOLO object detection → connector regions</div>
              <div>3. OCR engine → text labels</div>
              <div>4. Result → structured JSON</div>
            </div>
          </div>
        </div>

        {/* Results area */}
        <div className="hud-panel corner-brackets p-5">
          <div className="section-label mb-3">SCAN RESULTS</div>

          {scanning && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative w-16 h-16 mb-4">
                <Cpu size={48} className="text-[#00b4ff] animate-pulse absolute inset-0 m-auto" />
                <div className="absolute inset-0 border-2 border-[#00b4ff]/20 rounded-full" />
                <div className="absolute inset-0 border-2 border-transparent border-t-[#00b4ff] rounded-full animate-spin" />
              </div>
              <div className="font-display text-sm text-[#00b4ff] tracking-wider animate-pulse">ANALYZING IMAGE</div>
              <div className="text-xs text-[#4a5a7a] mt-2 font-mono">DEMO PROCESSING...</div>
            </div>
          )}

          {!scanning && !result && !error && (
            <div className="flex flex-col items-center justify-center py-16">
              <CircuitBoard size={40} className="text-[#4a5a7a] mb-3" />
              <div className="font-display text-sm text-[#8a9bb8] tracking-wider text-center">AWAITING SCAN</div>
              <div className="text-xs text-[#4a5a7a] mt-2 text-center">Upload an image and run scan</div>
            </div>
          )}

          {result && !scanning && (
            <div className="space-y-3 animate-fade-in">
              <div className="hud-panel p-3 border-[#ff8c42]/20">
                <div className="flex items-center gap-2 mb-1">
                  <CircuitBoard size={14} className="text-[#ff8c42]" />
                  <span className="section-label">BOARD MODEL</span>
                </div>
                <div className="text-sm text-[#e8f0ff]">{result.boardModel}</div>
              </div>

              <div className="hud-panel p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Scan size={14} className="text-[#00b4ff]" />
                  <span className="section-label">OCR RESULT</span>
                </div>
                <div className="text-xs text-[#8a9bb8] font-mono">{result.ocrResult}</div>
              </div>

              <div className="hud-panel p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={14} className="text-[#00ff9d]" />
                  <span className="section-label">DETECTED CONNECTORS</span>
                </div>
                <div className="space-y-1">
                  {result.connectors.map((c, i) => (
                    <div key={i} className="text-xs text-[#8a9bb8] flex items-start gap-2 animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                      <CheckCircle2 size={12} className="text-[#00ff9d] mt-0.5 flex-shrink-0" />
                      {c}
                    </div>
                  ))}
                </div>
              </div>

              <div className="hud-panel p-3 border-[#ffd93d]/20">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle size={14} className="text-[#ffd93d]" />
                  <span className="section-label">CONFIDENCE</span>
                </div>
                <div className="text-xs text-[#ffd93d]">{result.confidence}</div>
              </div>

              <div className="p-3 bg-[#ff8c42]/10 border border-[#ff8c42]/30 rounded">
                <p className="text-xs text-[#ff8c42] leading-relaxed">
                  This is a DEMO result. No actual AI computer vision model is running. Results are simulated to demonstrate the interface. A YOLO/OpenCV/OCR backend can be connected in the future.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
