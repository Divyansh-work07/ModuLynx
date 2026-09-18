import { useState } from 'react';
import { BootSequence } from '@/components/BootSequence';
import { TopNav, type Page } from '@/components/TopNav';
import { ExplorePage } from '@/pages/ExplorePage';
import { CompatibilityPage } from '@/pages/CompatibilityPage';
import { UpgradePage } from '@/pages/UpgradePage';
import { LearnPage } from '@/pages/LearnPage';
import { ScannerPage } from '@/pages/ScannerPage';

function App() {
  const [booted, setBooted] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('explore');

  return (
    <div className="min-h-screen relative">
      {!booted && <BootSequence onComplete={() => setBooted(true)} />}

      <div className="relative z-10">
        <TopNav currentPage={currentPage} onNavigate={setCurrentPage} />

        <main className="max-w-[1600px] mx-auto px-4 lg:px-6 py-4 lg:py-6">
          {currentPage === 'explore' && <ExplorePage onNavigate={setCurrentPage} />}
          {currentPage === 'compatibility' && <CompatibilityPage />}
          {currentPage === 'upgrade' && <UpgradePage />}
          {currentPage === 'learn' && <LearnPage />}
          {currentPage === 'scanner' && <ScannerPage />}
        </main>

        <footer className="max-w-[1600px] mx-auto px-4 lg:px-6 py-4 mt-4">
          <div className="hud-panel p-4 flex flex-col md:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="font-display text-xs tracking-[0.15em] text-[#4a5a7a]">MODULYNX</span>
              <span className="text-[#4a5a7a]">|</span>
              <span className="text-xs text-[#4a5a7a]">Explore. Match. Upgrade.</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="badge badge-demo">DEMO BUILD</span>
              <span className="text-xs text-[#4a5a7a] font-mono">v0.1.0</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
