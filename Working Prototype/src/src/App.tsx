import { useMemo, useState } from "react";
import {
  Box, Cpu, Database, GraduationCap, Search, Settings, ShieldCheck,
  Wrench, ScanLine, Bell, Command, ChevronRight, Power
} from "lucide-react";
import ExplorePage from "./pages/ExplorePage";
import CompatibilityPage from "./pages/CompatibilityPage";
import UpgradePage from "./pages/UpgradePage";
import LearnPage from "./pages/LearnPage";
import ScannerPage from "./pages/ScannerPage";
import { laptops } from "./data/demoData";

type Page = "EXPLORE" | "COMPATIBILITY" | "UPGRADE" | "LEARN" | "SCANNER";

const nav: { id: Page; label: string; icon: typeof Box }[] = [
  { id: "EXPLORE", label: "EXPLORE", icon: Box },
  { id: "COMPATIBILITY", label: "COMPATIBILITY", icon: ShieldCheck },
  { id: "UPGRADE", label: "UPGRADE", icon: Wrench },
  { id: "LEARN", label: "LEARN", icon: GraduationCap },
  { id: "SCANNER", label: "SCANNER", icon: ScanLine },
];

export default function App() {
  const [page, setPage] = useState<Page>("EXPLORE");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [boot, setBoot] = useState(true);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return laptops.filter((l) =>
      `${l.brand} ${l.model} ${l.family}`.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [query]);

  if (boot) {
    return (
      <div className="boot-screen" onClick={() => setBoot(false)}>
        <div className="boot-grid" />
        <div className="boot-core">
          <div className="boot-ring" />
          <div className="boot-logo">M</div>
          <div className="boot-title">MODULYNX</div>
          <div className="boot-sub">HARDWARE INTELLIGENCE SYSTEM</div>
          <div className="boot-progress"><span /></div>
          <div className="boot-status">INITIALIZING 3D CORE • COMPATIBILITY ENGINE • DATABASE</div>
          <button className="boot-enter">ENTER SYSTEM <ChevronRight size={14}/></button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand-button" onClick={() => setPage("EXPLORE")} aria-label="ModuLynx home">
          <span className="brand-mark">M</span>
          <span className="brand-copy">
            <strong>MODULYNX</strong>
            <small>EXPLORE · MATCH · UPGRADE</small>
          </span>
        </button>

        <nav className="main-nav">
          {nav.map(({ id, label, icon: Icon }) => (
            <button key={id} className={`nav-item ${page === id ? "active" : ""}`} onClick={() => setPage(id)}>
              <Icon size={15}/><span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="top-actions">
          <div className="online"><span/> SYSTEM ONLINE</div>
          <button className="icon-btn" onClick={() => setSearchOpen((v) => !v)} title="Search"><Search size={17}/></button>
          <button className="icon-btn" title="Notifications"><Bell size={17}/><i/></button>
          <button className="icon-btn" title="Settings"><Settings size={17}/></button>
        </div>
      </header>

      {searchOpen && (
        <div className="global-search glass-panel">
          <div className="search-line">
            <Search size={17}/>
            <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search laptop models, components, interfaces..." />
            <kbd><Command size={11}/> K</kbd>
          </div>
          {results.length > 0 && (
            <div className="search-results">
              {results.map((l) => (
                <button key={l.id} onClick={() => { setPage("EXPLORE"); setSearchOpen(false); setQuery(""); }}>
                  <span><Database size={14}/>{l.brand} {l.model}</span>
                  <small>{l.family} · {l.ramType} · PCIe Gen {l.pcieGen}</small>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <main className="app-main">
        {page === "EXPLORE" && <ExplorePage onNavigate={setPage}/>}
        {page === "COMPATIBILITY" && <CompatibilityPage/>}
        {page === "UPGRADE" && <UpgradePage/>}
        {page === "LEARN" && <LearnPage/>}
        {page === "SCANNER" && <ScannerPage/>}
      </main>

      <footer className="app-footer">
        <span>MODULYNX <b>///</b> HARDWARE INTELLIGENCE</span>
        <span>DEMO DATA · VERIFY MANUFACTURER SPECS BEFORE PURCHASE</span>
        <span className="footer-online"><span/> CORE ONLINE <Power size={12}/></span>
      </footer>
    </div>
  );
}
