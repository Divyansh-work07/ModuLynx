import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LaptopModelProps {
  exploded: boolean;
  selectedComponent: string | null;
  onSelectComponent: (component: string | null) => void;
}

const componentColors: Record<string, string> = {
  display: '#1a2a4a',
  topChassis: '#1a1a2e',
  keyboard: '#0a0a14',
  motherboard: '#0d2818',
  ram: '#2a1a0a',
  ssd: '#1a0a2a',
  cooling: '#0a1a2a',
  battery: '#2a2a0a',
  bottomChassis: '#15151f',
};

const componentLabels: Record<string, string> = {
  display: 'DISPLAY',
  topChassis: 'TOP CHASSIS',
  keyboard: 'KEYBOARD',
  motherboard: 'MOTHERBOARD',
  ram: 'RAM',
  ssd: 'SSD',
  cooling: 'COOLING',
  battery: 'BATTERY',
  bottomChassis: 'BOTTOM CHASSIS',
};

function ComponentMesh({
  component,
  position,
  rotation,
  scale,
  color,
  exploded,
  explodeOffset,
  selected,
  onClick,
  emissive = false,
}: {
  component: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale: [number, number, number];
  color: string;
  exploded: boolean;
  explodeOffset: [number, number, number];
  selected: boolean;
  onClick: () => void;
  emissive?: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const targetPos = useMemo(() => {
    const pos = new THREE.Vector3(...position);
    if (exploded) {
      pos.add(new THREE.Vector3(...explodeOffset));
    }
    return pos;
  }, [position, exploded, explodeOffset]);

  useFrame(() => {
    if (ref.current) {
      ref.current.position.lerp(targetPos, 0.08);
      const mat = ref.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        const targetEmissive = selected ? 0.5 : emissive ? 0.15 : 0.05;
        mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, targetEmissive, 0.1);
      }
    }
  });

  return (
    <mesh
      ref={ref}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={color}
        emissive={selected ? '#00b4ff' : color}
        emissiveIntensity={0.05}
        metalness={0.7}
        roughness={0.3}
        transparent
        opacity={selected ? 0.95 : 0.85}
      />
    </mesh>
  );
}

export function LaptopModel({ exploded, selectedComponent, onSelectComponent }: LaptopModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current && !exploded) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
    }
  });

  const components = [
    {
      component: 'display',
      label: componentLabels.display,
      position: [0, 0.15, -1.6] as [number, number, number],
      scale: [2.6, 1.7, 0.08] as [number, number, number],
      color: componentColors.display,
      explodeOffset: [0, 0, -2.5] as [number, number, number],
      emissive: true,
    },
    {
      component: 'topChassis',
      label: componentLabels.topChassis,
      position: [0, 0.15, -0.6] as [number, number, number],
      scale: [2.6, 1.7, 0.12] as [number, number, number],
      color: componentColors.topChassis,
      explodeOffset: [0, 0.5, -1.5] as [number, number, number],
    },
    {
      component: 'keyboard',
      label: componentLabels.keyboard,
      position: [0, 0.15, 0.1] as [number, number, number],
      scale: [2.2, 1.2, 0.06] as [number, number, number],
      color: componentColors.keyboard,
      explodeOffset: [0, 0.5, -0.5] as [number, number, number],
      emissive: true,
    },
    {
      component: 'motherboard',
      label: componentLabels.motherboard,
      position: [0, 0.15, 0.5] as [number, number, number],
      scale: [2.2, 1.4, 0.1] as [number, number, number],
      color: componentColors.motherboard,
      explodeOffset: [0, -0.5, 0.5] as [number, number, number],
      emissive: true,
    },
    {
      component: 'ram',
      label: componentLabels.ram,
      position: [-0.7, 0.15, 0.6] as [number, number, number],
      scale: [0.25, 0.9, 0.05] as [number, number, number],
      color: componentColors.ram,
      explodeOffset: [0, -1.5, 0.5] as [number, number, number],
      emissive: true,
    },
    {
      component: 'ssd',
      label: componentLabels.ssd,
      position: [0.5, 0.15, 0.7] as [number, number, number],
      scale: [0.6, 0.15, 0.04] as [number, number, number],
      color: componentColors.ssd,
      explodeOffset: [0.5, -2, 0.5] as [number, number, number],
      emissive: true,
    },
    {
      component: 'cooling',
      label: componentLabels.cooling,
      position: [0.8, 0.15, 0.4] as [number, number, number],
      scale: [0.5, 0.5, 0.15] as [number, number, number],
      color: componentColors.cooling,
      explodeOffset: [1.5, -1.5, 0] as [number, number, number],
      emissive: true,
    },
    {
      component: 'battery',
      label: componentLabels.battery,
      position: [-0.5, 0.15, 1.0] as [number, number, number],
      scale: [1.5, 1.0, 0.12] as [number, number, number],
      color: componentColors.battery,
      explodeOffset: [0, -2.5, 0.5] as [number, number, number],
      emissive: true,
    },
    {
      component: 'bottomChassis',
      label: componentLabels.bottomChassis,
      position: [0, 0.15, 1.2] as [number, number, number],
      scale: [2.6, 1.7, 0.12] as [number, number, number],
      color: componentColors.bottomChassis,
      explodeOffset: [0, -3.5, 0] as [number, number, number],
    },
  ];

  return (
    <group ref={groupRef} rotation={[0.3, 0, 0]}>
      {/* Platform ring */}
      <mesh position={[0, -1.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.2, 2.5, 64]} />
        <meshStandardMaterial color="#00b4ff" emissive="#00b4ff" emissiveIntensity={0.3} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -1.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.8, 1.85, 64]} />
        <meshStandardMaterial color="#00b4ff" emissive="#00b4ff" emissiveIntensity={0.2} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* Components */}
      {components.map((c) => (
        <ComponentMesh
          key={c.component}
          component={c.component}
          position={c.position}
          scale={c.scale}
          color={c.color}
          exploded={exploded}
          explodeOffset={c.explodeOffset}
          selected={selectedComponent === c.component}
          onClick={() =>
            onSelectComponent(selectedComponent === c.component ? null : c.component)
          }
          emissive={c.emissive}
        />
      ))}

      {/* Hotspot indicators for key components */}
      {['ram', 'ssd', 'cooling', 'battery', 'motherboard'].map((comp) => {
        const c = components.find((c) => c.component === comp)!;
        const offset = exploded ? c.explodeOffset : [0, 0, 0];
        return (
          <mesh
            key={`hotspot-${comp}`}
            position={[c.position[0] + offset[0], c.position[1] + offset[1] + 0.8, c.position[2] + offset[2]]}
          >
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial
              color="#ff8c42"
              emissive="#ff8c42"
              emissiveIntensity={selectedComponent === comp ? 1 : 0.5}
            />
          </mesh>
        );
      })}
    </group>
  );
}
