import { Suspense, useState, Component, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { LaptopModel } from './LaptopModel';

interface LaptopViewerProps {
  exploded: boolean;
  selectedComponent: string | null;
  onSelectComponent: (component: string | null) => void;
}

function FallbackVisual() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <div className="font-display text-sm text-[#00b4ff] mb-2">3D ENGINE OFFLINE</div>
        <div className="text-xs text-[#4a5a7a]">Fallback visual mode</div>
        <div className="mt-4 w-32 h-20 mx-auto border border-[#00b4ff]/30 rounded bg-[#0a1020] flex items-center justify-center">
          <div className="text-[#4a5a7a] text-xs font-mono">[ LAPTOP ]</div>
        </div>
      </div>
    </div>
  );
}

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return <FallbackVisual />;
    return this.props.children;
  }
}

export function LaptopViewer({ exploded, selectedComponent, onSelectComponent }: LaptopViewerProps) {
  return (
    <ErrorBoundary>
      <Canvas
        camera={{ position: [0, 1.5, 6], fov: 45 }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#00b4ff" />
        <pointLight position={[-5, 3, -5]} intensity={0.5} color="#ff8c42" />
        <pointLight position={[0, -3, 3]} intensity={0.3} color="#00b4ff" />
        <directionalLight position={[0, 5, 2]} intensity={0.4} />

        <Suspense fallback={null}>
          <LaptopModel
            exploded={exploded}
            selectedComponent={selectedComponent}
            onSelectComponent={onSelectComponent}
          />
          <Grid
            position={[0, -1.8, 0]}
            args={[10, 10]}
            cellSize={0.5}
            cellColor="#0a1a2a"
            sectionSize={2}
            sectionColor="#0a2a4a"
            fadeDistance={8}
            fadeStrength={1}
            infiniteGrid={false}
          />
        </Suspense>

        <OrbitControls
          enablePan={false}
          minDistance={3}
          maxDistance={10}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.8}
          autoRotate={!exploded}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </ErrorBoundary>
  );
}
