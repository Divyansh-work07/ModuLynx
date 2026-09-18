import { useMemo } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";

type PartId = "RAM" | "SSD" | "BATTERY" | "COOLING" | "MOTHERBOARD" | "GPU" | "CPU" | null;

interface Props {
  exploded: boolean;
  xray: boolean;
  selectedPart: PartId;
  onSelect: (part: PartId) => void;
}

const metal = new THREE.MeshStandardMaterial({ color: "#202831", metalness: .86, roughness: .22 });
const darkMetal = new THREE.MeshStandardMaterial({ color: "#0b0f14", metalness: .72, roughness: .3 });
const board = new THREE.MeshStandardMaterial({ color: "#123b32", metalness: .18, roughness: .6 });
const copper = new THREE.MeshStandardMaterial({ color: "#9b5428", metalness: .72, roughness: .24 });
const cyan = new THREE.MeshStandardMaterial({ color: "#1e7e91", emissive: "#00bfff", emissiveIntensity: .45, metalness: .55, roughness: .28 });

function Material({ active, xray, color = "#202831" }: {active:boolean; xray:boolean; color?:string}) {
  return <meshStandardMaterial
    color={active ? "#00cfff" : color}
    emissive={active ? "#00cfff" : "#000000"}
    emissiveIntensity={active ? 1.4 : 0}
    metalness={.7}
    roughness={.25}
    transparent={xray}
    opacity={xray ? .25 : 1}
  />;
}

function KeyGrid() {
  const keys = useMemo(() => {
    const rows = [13,13,13,13,12,10];
    return rows.flatMap((count, r) => Array.from({length: count}, (_, c) => ({
      x: -2.45 + c * .39 + (13-count)*.195,
      z: -.98 + r * .34,
      w: r === 5 && c === 0 ? .72 : .29
    })));
  }, []);
  return <group position={[0,.43,-.25]}>
    {keys.map((k,i)=><mesh key={i} position={[k.x,.08,k.z]} castShadow>
      <boxGeometry args={[k.w,.055,.22]}/>
      <meshStandardMaterial color="#080b0f" roughness={.42}/>
    </mesh>)}
  </group>;
}

function Fan({position, active}:{position:[number,number,number]; active:boolean}) {
  return <group position={position}>
    <mesh rotation={[Math.PI/2,0,0]}>
      <cylinderGeometry args={[.62,.62,.12,40]}/>
      <meshStandardMaterial color={active ? "#0fb8d5" : "#2c343d"} metalness={.8} roughness={.22}/>
    </mesh>
    {Array.from({length:10},(_,i)=><mesh key={i} position={[Math.cos(i*Math.PI/5)*.32,.08,Math.sin(i*Math.PI/5)*.32]} rotation={[0,0,i*.4]}>
      <boxGeometry args={[.1,.035,.42]}/>
      <meshStandardMaterial color="#10151a" />
    </mesh>)}
  </group>;
}

export default function LaptopModel({ exploded, xray, selectedPart, onSelect }: Props) {
  const gap = exploded ? 1 : 0;

  return (
    <group rotation={[0,-.42,0]} position={[0, exploded ? .15 : 0,0]}>
      {/* screen/lid */}
      <group position={[0,2.15,-1.72]} rotation={[-.18,0,0]}>
        <mesh castShadow>
          <boxGeometry args={[6.15,3.75,.18]}/>
          <Material active={false} xray={xray} color="#11161c"/>
        </mesh>
        <mesh position={[0,0,.12]}>
          <boxGeometry args={[5.58,3.15,.035]}/>
          <meshStandardMaterial color="#041018" emissive="#003b55" emissiveIntensity={.8} roughness={.12}/>
        </mesh>
        <mesh position={[0,1.56,.15]}>
          <sphereGeometry args={[.035,16,16]}/>
          <meshStandardMaterial color="#020304" />
        </mesh>
        <mesh position={[0,0,.16]}>
          <planeGeometry args={[5.15,2.72]}/>
          <meshBasicMaterial color="#061c28" transparent opacity={.35}/>
        </mesh>
      </group>

      {/* base */}
      <mesh position={[0,.2,0]} castShadow receiveShadow>
        <boxGeometry args={[6.2,.38,4.15]}/>
        <Material active={false} xray={xray} color="#1b222a"/>
      </mesh>

      <mesh position={[0,.42,-.18]} receiveShadow>
        <boxGeometry args={[5.88,.12,3.62]}/>
        <Material active={false} xray={xray} color="#252d36"/>
      </mesh>

      <KeyGrid/>

      <mesh position={[0,.52,1.02]} receiveShadow>
        <boxGeometry args={[1.78,.045,1.12]}/>
        <Material active={false} xray={xray} color="#0b0f14"/>
      </mesh>

      {/* internal layer */}
      <group position={[0,-.18-gap*.45,0]}>
        <mesh position={[0,.02,-.2]} onClick={(e)=>{e.stopPropagation();onSelect("MOTHERBOARD")}}>
          <boxGeometry args={[4.75,.07,2.35]}/>
          <Material active={selectedPart==="MOTHERBOARD"} xray={xray} color="#123b32"/>
        </mesh>

        {/* CPU/GPU */}
        <mesh position={[-.25,.09,-.35]} onClick={(e)=>{e.stopPropagation();onSelect("CPU")}}>
          <boxGeometry args={[.62,.12,.62]}/>
          <Material active={selectedPart==="CPU"} xray={xray} color="#6b7077"/>
        </mesh>
        <mesh position={[.6,.1,-.35]} onClick={(e)=>{e.stopPropagation();onSelect("GPU")}}>
          <boxGeometry args={[.95,.12,.68]}/>
          <Material active={selectedPart==="GPU"} xray={xray} color="#414951"/>
        </mesh>

        {/* RAM */}
        <group position={[-1.35,.1,.15]} onClick={(e)=>{e.stopPropagation();onSelect("RAM")}}>
          <mesh position={[0,0,0]}>
            <boxGeometry args={[1.65,.09,.42]}/>
            <Material active={selectedPart==="RAM"} xray={xray} color="#173f72"/>
          </mesh>
          {Array.from({length:8},(_,i)=><mesh key={i} position={[-.62+i*.18,.055,0]}>
            <boxGeometry args={[.09,.03,.22]}/><meshStandardMaterial color="#c4a13a" metalness={.7}/>
          </mesh>)}
        </group>

        {/* SSD */}
        <group position={[1.1,.11,.1]} onClick={(e)=>{e.stopPropagation();onSelect("SSD")}}>
          <mesh>
            <boxGeometry args={[1.9,.08,.45]}/>
            <Material active={selectedPart==="SSD"} xray={xray} color="#252c35"/>
          </mesh>
          <mesh position={[-.75,.06,0]}><boxGeometry args={[.12,.04,.32]}/><meshStandardMaterial color="#d1a32d"/></mesh>
        </group>

        {/* battery */}
        <group position={[0,-.02,1.15]} onClick={(e)=>{e.stopPropagation();onSelect("BATTERY")}}>
          <mesh>
            <boxGeometry args={[4.4,.18,.82]}/>
            <Material active={selectedPart==="BATTERY"} xray={xray} color="#151a20"/>
          </mesh>
          <mesh position={[0,.1,0]}><boxGeometry args={[3.6,.025,.04]}/><meshStandardMaterial color="#38414a"/></mesh>
        </group>

        {/* cooling */}
        <group onClick={(e)=>{e.stopPropagation();onSelect("COOLING")}}>
          <Fan position={[-1.65,.15,.9]} active={selectedPart==="COOLING"}/>
          <Fan position={[1.65,.15,.9]} active={selectedPart==="COOLING"}/>
          <mesh position={[0,.22,-.1]} rotation={[0,0,Math.PI/2]}>
            <boxGeometry args={[.16,.14,3.2]}/>
            <meshStandardMaterial color={selectedPart==="COOLING" ? "#d56a2a" : "#9a5429"} metalness={.8}/>
          </mesh>
          <mesh position={[0,.23,-.55]} rotation={[0,0,Math.PI/2]}>
            <boxGeometry args={[.11,.1,2.8]}/>
            <meshStandardMaterial color="#b66b35" metalness={.8}/>
          </mesh>
        </group>
      </group>

      {/* exploded labels */}
      {exploded && selectedPart && (
        <Html position={[0,2.2,0]} center distanceFactor={9}>
          <div className="scene-label">{selectedPart} SELECTED</div>
        </Html>
      )}
    </group>
  );
}
