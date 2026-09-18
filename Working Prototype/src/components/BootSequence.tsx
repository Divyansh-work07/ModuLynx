import { useState, useEffect } from 'react';

interface BootSequenceProps {
  onComplete: () => void;
}

const bootLines = [
  { text: 'INITIALIZING MODULYNX...', delay: 0 },
  { text: 'LOADING HARDWARE DATABASE...', delay: 400 },
  { text: 'CALIBRATING COMPATIBILITY ENGINE...', delay: 800 },
  { text: 'MOUNTING 3D RENDERING SUBSYSTEM...', delay: 1200 },
  { text: 'SYSTEM ONLINE', delay: 1600 },
];

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timers = bootLines.map((line, i) =>
      setTimeout(() => setVisibleLines(i + 1), line.delay)
    );
    const completeTimer = setTimeout(() => {
      setDone(true);
      setTimeout(onComplete, 500);
    }, 2200);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 bg-[#060912] flex items-center justify-center transition-opacity duration-500 ${done ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute inset-0 bg-grid" style={{
        backgroundImage: 'linear-gradient(rgba(0,180,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,255,0.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />
      <div className="relative w-full max-w-2xl px-8">
        <div className="mb-12 text-center">
          <div className="font-display text-5xl font-black tracking-[0.15em] text-[#00b4ff] mb-2" style={{ textShadow: '0 0 30px rgba(0,180,255,0.5)' }}>
            MODULYNX
          </div>
          <div className="font-display text-sm tracking-[0.3em] text-[#ff8c42]">
            EXPLORE • MATCH • UPGRADE
          </div>
        </div>
        <div className="space-y-3 font-mono text-sm">
          {bootLines.slice(0, visibleLines).map((line, i) => (
            <div
              key={i}
              className="boot-line flex items-center gap-3"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <span className="status-dot bg-[#00ff9d]" style={{ boxShadow: '0 0 8px #00ff9d' }} />
              <span className="text-[#8a9bb8]">{line.text}</span>
              {i === visibleLines - 1 && i < bootLines.length - 1 && (
                <span className="text-[#00b4ff] animate-pulse">_</span>
              )}
              {i === bootLines.length - 1 && visibleLines === bootLines.length && (
                <span className="text-[#00ff9d] font-bold ml-auto">[OK]</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
