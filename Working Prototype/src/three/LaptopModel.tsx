import { Suspense, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface LaptopModelProps {
  exploded: boolean;
  xray: boolean;
  selectedPart: string;
}

function RealLaptop({
  exploded,
  xray,
  selectedPart,
}: LaptopModelProps) {
  const { scene } = useGLTF("/models/laptop/laptop.glb");

  const model = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;

      object.castShadow = true;
      object.receiveShadow = true;

      if (object.material instanceof THREE.MeshStandardMaterial) {
        object.material = object.material.clone();

        if (xray) {
          object.material.transparent = true;
          object.material.opacity = 0.18;
        }

        const objectName = object.name.toLowerCase();
        const selected = selectedPart.toLowerCase();

        if (
          selected &&
          objectName.includes(selected)
        ) {
          object.material.emissive = new THREE.Color(
            "#00d9ff"
          );

          object.material.emissiveIntensity = 2;
        }
      }
    });

    return clone;
  }, [scene, xray, selectedPart]);

  return (
    <group
      scale={1}
      position={[
        0,
        exploded ? 0.35 : 0,
        0,
      ]}
      rotation={[0, -0.35, 0]}
    >
      <primitive object={model} />
    </group>
  );
}

/*
  Temporary fallback.

  This means the application still works
  even before you upload the real GLB.
*/

function DemoLaptop({
  exploded,
  xray,
}: LaptopModelProps) {
  return (
    <group
      rotation={[0, -0.35, 0]}
      position={[0, exploded ? 0.3 : 0, 0]}
    >

      {/* BOTTOM CHASSIS */}

      <mesh
        castShadow
        receiveShadow
        position={[0, 0.2, 0]}
      >
        <boxGeometry args={[6, 0.35, 4]} />

        <meshStandardMaterial
          color={xray ? "#0d6878" : "#171a1f"}
          metalness={0.8}
          roughness={0.25}
          transparent={xray}
          opacity={xray ? 0.3 : 1}
        />
      </mesh>

      {/* KEYBOARD DECK */}

      <mesh
        castShadow
        position={[0, 0.43, -0.15]}
      >
        <boxGeometry args={[5.7, 0.12, 3.35]} />

        <meshStandardMaterial
          color="#242932"
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* KEYBOARD */}

      <group position={[0, 0.52, -0.4]}>

        {Array.from({ length: 10 }).map(
          (_, row) =>
            Array.from({ length: 14 }).map(
              (_, column) => (
                <mesh
                  key={`${row}-${column}`}
                  position={[
                    -2.35 + column * 0.36,
                    0,
                    -0.8 + row * 0.25,
                  ]}
                >
                  <boxGeometry
                    args={[
                      0.27,
                      0.045,
                      0.18,
                    ]}
                  />

                  <meshStandardMaterial
                    color="#080a0d"
                    roughness={0.4}
                  />
                </mesh>
              )
            )
        )}

      </group>

      {/* TRACKPAD */}

      <mesh
        position={[0, 0.55, 1.05]}
      >
        <boxGeometry
          args={[1.8, 0.05, 1.15]}
        />

        <meshStandardMaterial
          color="#0b0e12"
          metalness={0.4}
          roughness={0.2}
        />
      </mesh>

      {/* DISPLAY */}

      <group
        position={[0, 2.25, -1.8]}
        rotation={[-0.18, 0, 0]}
      >

        <mesh castShadow>

          <boxGeometry
            args={[5.9, 3.65, 0.18]}
          />

          <meshStandardMaterial
            color="#101419"
            metalness={0.75}
            roughness={0.22}
          />

        </mesh>

        {/* SCREEN */}

        <mesh
          position={[0, 0, 0.12]}
        >

          <boxGeometry
            args={[5.25, 3.05, 0.025]}
          />

          <meshStandardMaterial
            color="#06121b"
            emissive="#003b55"
            emissiveIntensity={0.5}
            roughness={0.1}
          />

        </mesh>

        {/* WEBCAM */}

        <mesh
          position={[0, 1.48, 0.15]}
        >

          <sphereGeometry
            args={[0.035, 16, 16]}
          />

          <meshStandardMaterial
            color="#030303"
          />

        </mesh>

      </group>

      {/* INTERNAL COMPONENTS */}

      <group
        position={[
          0,
          exploded ? 1.2 : 0.65,
          0,
        ]}
      >

        {/* MOTHERBOARD */}

        <mesh
          position={[0, 0, -0.2]}
        >

          <boxGeometry
            args={[4.6, 0.08, 2.3]}
          />

          <meshStandardMaterial
            color="#123e35"
            roughness={0.65}
          />

        </mesh>

        {/* RAM */}

        <mesh
          position={[
            -1,
            exploded ? 0.3 : 0.08,
            -0.1,
          ]}
        >

          <boxGeometry
            args={[1.6, 0.08, 0.45]}
          />

          <meshStandardMaterial
            color="#1b4f91"
            emissive={
              selectedPart === "RAM"
                ? "#00d9ff"
                : "#000000"
            }
            emissiveIntensity={
              selectedPart === "RAM"
                ? 1.5
                : 0
            }
          />

        </mesh>

        {/* SSD */}

        <mesh
          position={[
            1,
            exploded ? 0.4 : 0.1,
            -0.1,
          ]}
        >

          <boxGeometry
            args={[1.8, 0.08, 0.45]}
          />

          <meshStandardMaterial
            color="#222831"
            emissive={
              selectedPart === "SSD"
                ? "#00d9ff"
                : "#000000"
            }
            emissiveIntensity={
              selectedPart === "SSD"
                ? 1.5
                : 0
            }
          />

        </mesh>

        {/* BATTERY */}

        <mesh
          position={[
            0,
            exploded ? -0.3 : -0.05,
            1,
          ]}
        >

          <boxGeometry
            args={[3.8, 0.16, 0.8]}
          />

          <meshStandardMaterial
            color="#17191c"
            emissive={
              selectedPart === "Battery"
                ? "#00d9ff"
                : "#000000"
            }
            emissiveIntensity={
              selectedPart === "Battery"
                ? 1.5
                : 0
            }
          />

        </mesh>

        {/* COOLING FAN */}

        <mesh
          position={[
            1.7,
            exploded ? 0.5 : 0.1,
            0.8,
          ]}
        >

          <cylinderGeometry
            args={[0.55, 0.55, 0.12, 32]}
          />

          <meshStandardMaterial
            color="#454c55"
            metalness={0.8}
          />

        </mesh>

      </group>

    </group>
  );
}

export default function LaptopModel(
  props: LaptopModelProps
) {
  return (
    <Suspense
      fallback={
        <DemoLaptop {...props} />
      }
    >

      <RealLaptop {...props} />

    </Suspense>
  );
}

useGLTF.preload(
  "/models/laptop/laptop.glb"
);