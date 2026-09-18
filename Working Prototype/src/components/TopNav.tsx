import { useState, useRef, useEffect } from 'react';
import { Search, Bell, HelpCircle, Settings, X } from 'lucide-react';
import { searchAll, type SearchResult } from '@/utils/search';

export type Page = 'explore' | 'compatibility' | 'upgrade' | 'learn' | 'scanner';

interface TopNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { id: Page; label: string }[] = [
  { id: 'explore', label: 'EXPLORE' },
  { id: 'compatibility', label: 'COMPATIBILITY' },
  { id: 'upgrade', label: 'UPGRADE' },
  { id: 'learn', label: 'LEARN' },
  { id: 'scanner', label: 'SCANNER' },
];

export function TopNav({ currentPage, onNavigate }: TopNavProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setResults(searchAll(searchQuery));
  }, [searchQuery]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const resultTypeColor: Record<string, string> = {
    laptop: 'text-[#00b4ff]',
    component: 'text-[#ff8c42]',
    learn: 'text-[#00ff9d]',
    upgrade: 'text-[#ffd93d]',
  };

  return (
    <>
      <header className="sticky top-0 z-40 hud-panel hud-panel-glow rounded-none border-l-0 border-r-0 border-t-0">
        <div className="flex items-center justify-between px-4 lg:px-6 py-3">
          {/* Left: Logo */}
          <div className="flex flex-col">
            <button
              onClick={() => onNavigate('explore')}
              className="font-display text-xl lg:text-2xl font-black tracking-[0.15em] text-[#00b4ff] hover:text-[#2ed4ff] transition-colors text-left"
              style={{ textShadow: '0 0 20px rgba(0,180,255,0.4)' }}
            >
              MODULYNX
            </button>
            <div className="font-display text-[0.6rem] lg:text-xs tracking-[0.25em] text-[#ff8c42] mt-0.5">
              EXPLORE • MATCH • UPGRADE
            </div>
          </div>

          {/* Center: Nav + Status */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`font-display text-xs tracking-[0.15em] px-3 lg:px-4 py-2 transition-all relative group ${
                  currentPage === item.id
                    ? 'text-[#00b4ff]'
                    : 'text-[#4a5a7a] hover:text-[#8a9bb8]'
                }`}
              >
                {item.label}
                {currentPage === item.id && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#00b4ff]" style={{ boxShadow: '0 0 8px #00b4ff' }} />
                )}
              </button>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2 ml-4">
            <span className="status-dot bg-[#00ff9d] pulse-dot" />
            <span className="font-mono text-xs text-[#00ff9d] tracking-wider">SYSTEM ONLINE</span>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#8a9bb8] hover:text-[#00b4ff] hover:bg-[#00b4ff]/10 rounded transition-all"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="p-2 text-[#8a9bb8] hover:text-[#00b4ff] hover:bg-[#00b4ff]/10 rounded transition-all relative"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#ff8c42] rounded-full" />
            </button>
            <button
              onClick={() => setHelpOpen(!helpOpen)}
              className="p-2 text-[#8a9bb8] hover:text-[#00b4ff] hover:bg-[#00b4ff]/10 rounded transition-all"
              aria-label="Help"
            >
              <HelpCircle size={18} />
            </button>
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="p-2 text-[#8a9bb8] hover:text-[#00b4ff] hover:bg-[#00b4ff]/10 rounded transition-all"
              aria-label="Settings"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <nav className="md:hidden flex items-center justify-around px-2 py-1 border-t border-[#00b4ff]/10">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`font-display text-[0.6rem] tracking-[0.1em] px-2 py-1.5 transition-all ${
                currentPage === item.id ? 'text-[#00b4ff]' : 'text-[#4a5a7a]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm" onClick={() => setSearchOpen(false)}>
          <div className="hud-panel hud-panel-glow w-full max-w-2xl p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <Search size={20} className="text-[#00b4ff]" />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search laptops, components, topics..."
                className="flex-1 bg-transparent border-none outline-none text-[#e8f0ff] font-body text-lg placeholder-[#4a5a7a]"
              />
              <button onClick={() => setSearchOpen(false)} className="text-[#4a5a7a] hover:text-[#00b4ff]">
                <X size={20} />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {results.length === 0 && searchQuery && (
                <div className="text-[#4a5a7a] text-sm py-4 text-center">No results found</div>
              )}
              {results.length === 0 && !searchQuery && (
                <div className="text-[#4a5a7a] text-sm py-4 text-center">Type to search demo data...</div>
              )}
              {results.map((r, i) => (
                <div
                  key={i}
                  className="data-row card-hover px-2 py-2 rounded cursor-pointer"
                  onClick={() => {
                    setSearchOpen(false);
                    if (r.type === 'learn') onNavigate('learn');
                    else if (r.type === 'upgrade') onNavigate('upgrade');
                    else if (r.type === 'laptop') onNavigate('explore');
                    else onNavigate('compatibility');
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className={`font-mono text-[0.6rem] uppercase ${resultTypeColor[r.type]}`}>{r.type}</span>
                    <div>
                      <div className="text-[#e8f0ff] font-medium">{r.title}</div>
                      <div className="text-[#4a5a7a] text-xs">{r.subtitle}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Notifications panel */}
      {notifOpen && (
        <div className="fixed top-16 right-4 z-50 hud-panel hud-panel-glow w-72 p-4 animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <span className="font-display text-xs tracking-wider text-[#00b4ff]">NOTIFICATIONS</span>
            <button onClick={() => setNotifOpen(false)} className="text-[#4a5a7a] hover:text-[#00b4ff]">
              <X size={16} />
            </button>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-[#8a9bb8] p-2 border-l-2 border-[#00ff9d]">
              <div className="font-medium text-[#e8f0ff]">Database loaded</div>
              <div className="text-[#4a5a7a]">10 demo laptops available</div>
            </div>
            <div className="text-xs text-[#8a9bb8] p-2 border-l-2 border-[#ff8c42]">
              <div className="font-medium text-[#e8f0ff]">Demo data notice</div>
              <div className="text-[#4a5a7a]">All specs are sample data — verify manually</div>
            </div>
          </div>
        </div>
      )}

      {/* Help panel */}
      {helpOpen && (
        <div className="fixed top-16 right-4 z-50 hud-panel hud-panel-glow w-80 p-4 animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <span className="font-display text-xs tracking-wider text-[#00b4ff]">HELP</span>
            <button onClick={() => setHelpOpen(false)} className="text-[#4a5a7a] hover:text-[#00b4ff]">
              <X size={16} />
            </button>
          </div>
          <div className="space-y-3 text-sm text-[#8a9bb8]">
            <p><span className="text-[#00b4ff] font-medium">EXPLORE</span> — View 3D laptop model and component details</p>
            <p><span className="text-[#00b4ff] font-medium">COMPATIBILITY</span> — Check if an upgrade component works with your laptop</p>
            <p><span className="text-[#00b4ff] font-medium">UPGRADE</span> — Browse upgrade paths and installation guides</p>
            <p><span className="text-[#00b4ff] font-medium">LEARN</span> — Understand laptop hardware components</p>
            <p><span className="text-[#00b4ff] font-medium">SCANNER</span> — Demo motherboard identification interface</p>
            <div className="mt-4 p-2 bg-[#ff8c42]/10 border border-[#ff8c42]/30 rounded text-xs text-[#ff8c42]">
              All data is DEMO. Always verify with manufacturer specifications.
            </div>
          </div>
        </div>
      )}

      {/* Settings panel */}
      {settingsOpen && (
        <div className="fixed top-16 right-4 z-50 hud-panel hud-panel-glow w-72 p-4 animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <span className="font-display text-xs tracking-wider text-[#00b4ff]">SETTINGS</span>
            <button onClick={() => setSettingsOpen(false)} className="text-[#4a5a7a] hover:text-[#00b4ff]">
              <X size={16} />
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#8a9bb8]">3D Auto-rotate</span>
              <span className="badge badge-pass">ON</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#8a9bb8]">Scanline FX</span>
              <span className="badge badge-pass">ON</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#8a9bb8]">Demo Data Mode</span>
              <span className="badge badge-demo">ACTIVE</span>
            </div>
            <div className="pt-2 border-t border-[#00b4ff]/10 text-xs text-[#4a5a7a]">
              Settings are display-only in this demo build.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
