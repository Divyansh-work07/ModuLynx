import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls, PerspectiveCamera, Float } from "@react-three/drei";
import { Suspense } from "react";
import LaptopModel from "./LaptopModel";

type PartId = "RAM" | "SSD" | "BATTERY" | "COOLING" | "MOTHERBOARD" | "GPU" | "CPU" | null;

interface Props {
  exploded: boolean;
  xray: boolean;
  selectedPart: PartId;
  onSelect: (part: PartId) => void;
}

export default function LaptopViewer(props: Props) {
  return (
    <div className="laptop-viewer">
      <Canvas shadows dpr={[1,1.6]} gl={{ antialias:true, powerPreference:"high-performance" }}>
        <PerspectiveCamera makeDefault position={[7.6,5.4,8.2]} fov={36}/>
        <ambientLight intensity={.28}/>
        <directionalLight castShadow position={[4,8,5]} intensity={2.2} shadow-mapSize={[1024,1024]}/>
        <pointLight position={[-4,3,2]} intensity={1.1} color="#00bfff"/>
        <pointLight position={[4,2,-4]} intensity={.7} color="#ff7b2f"/>
        <Suspense fallback={null}>
          <Float speed={.7} rotationIntensity={.03} floatIntensity={.12}>
            <LaptopModel {...props}/>
          </Float>
          <Environment preset="city"/>
          <ContactShadows position={[0,-.25,0]} scale={12} blur={2.4} opacity={.5} far={6}/>
        </Suspense>
        <OrbitControls enablePan enableZoom enableRotate minDistance={5} maxDistance={14} minPolarAngle={Math.PI/7} maxPolarAngle={Math.PI/2.05}/>
      </Canvas>
      <div className="viewer-hud hud-tl"><span>3D CORE</span><b>ACTIVE</b></div>
      <div className="viewer-hud hud-tr">DRAG / ZOOM / SELECT</div>
      <div className="viewer-hud hud-bl">SIMULATION MODEL · DEMO HARDWARE</div>
      <div className="viewer-hud hud-br">60 FPS TARGET</div>
      <div className="viewer-grid"/>
      <div className="viewer-scanline"/>
      <div className="viewer-corners tl"/><div className="viewer-corners tr"/><div className="viewer-corners bl"/><div className="viewer-corners br"/>
    </div>
  );
}
