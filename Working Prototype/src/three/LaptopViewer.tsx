import { Canvas } from "@react-three/fiber";

import {
  ContactShadows,
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";

import { Suspense } from "react";

import LaptopModel from "./LaptopModel";

interface LaptopViewerProps {
  exploded: boolean;
  xray: boolean;
  selectedPart: string;
}

export default function LaptopViewer({
  exploded,
  xray,
  selectedPart,
}: LaptopViewerProps) {
  return (
    <div className="laptop-viewer">

      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
        }}
      >

        <PerspectiveCamera
          makeDefault
          position={[7, 5, 8]}
          fov={38}
        />

        <ambientLight intensity={0.35} />

        <directionalLight
          position={[5, 8, 5]}
          intensity={2}
          castShadow
        />

        <directionalLight
          position={[-5, 4, -5]}
          intensity={0.7}
        />

        <Suspense fallback={null}>

          <LaptopModel
            exploded={exploded}
            xray={xray}
            selectedPart={selectedPart}
          />

          <Environment
            preset="city"
          />

          <ContactShadows
            position={[0, -0.1, 0]}
            opacity={0.5}
            scale={12}
            blur={2.5}
            far={5}
          />

        </Suspense>

        <OrbitControls
          enablePan
          enableZoom
          enableRotate

          minDistance={5}
          maxDistance={15}

          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
        />

      </Canvas>

      <div className="viewer-grid" />

      <div className="viewer-corner top-left" />
      <div className="viewer-corner top-right" />
      <div className="viewer-corner bottom-left" />
      <div className="viewer-corner bottom-right" />

    </div>
  );
}