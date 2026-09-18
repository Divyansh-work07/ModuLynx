import { useState } from "react";
import { Battery, Cpu, Fan, HardDrive, Layers3, Maximize2, MemoryStick, ScanLine, ShieldCheck, Thermometer, Wrench } from "lucide-react";
import LaptopViewer from "../three/LaptopViewer";
import { laptops } from "../data/demoData";

type Page = "EXPLORE"|"COMPATIBILITY"|"UPGRADE"|"LEARN"|"SCANNER";
type PartId = "RAM"|"SSD"|"BATTERY"|"COOLING"|"MOTHERBOARD"|"GPU"|"CPU"|null;

const components=[
 {id:"RAM" as PartId,name:"RAM MODULE",sub:"DDR5 SO-DIMM",icon:MemoryStick,status:"UPGRADE"},
 {id:"SSD" as PartId,name:"SSD STORAGE",sub:"M.2 NVMe",icon:HardDrive,status:"UPGRADE"},
 {id:"MOTHERBOARD" as PartId,name:"MOTHERBOARD",sub:"SYSTEM BOARD",icon:Cpu,status:"CORE"},
 {id:"BATTERY" as PartId,name:"BATTERY PACK",sub:"POWER SYSTEM",icon:Battery,status:"POWER"},
 {id:"COOLING" as PartId,name:"COOLING SYSTEM",sub:"FANS + HEAT PIPES",icon:Fan,status:"THERMAL"},
];
export default function ExplorePage({onNavigate}:{onNavigate:(p:Page)=>void}){
 const [brand,setBrand]=useState("ALL"),[laptopId,setLaptopId]=useState(laptops[0].id),[selected,setSelected]=useState<PartId>("RAM"),[exploded,setExploded]=useState(false),[xray,setXray]=useState(false);
 const laptop=laptops.find(l=>l.id===laptopId)!;
 const visible=laptops.filter(l=>brand==="ALL"||l.brand===brand);
 return <div className="module-page">
  <section className="explore-hero glass-panel"><div><span className="eyebrow">MODULE 01 · 3D HARDWARE LAB</span><h1>YOUR MACHINE.<br/><span>FULLY EXPOSED.</span></h1><p>Inspect the chassis, select internal components, switch to X-RAY or exploded mode and launch compatibility checks from the same hardware workspace.</p></div><div className="hero-metrics"><div><b>3D</b><span>CORE</span></div><div><b>05</b><span>LAYERS</span></div><div><b>24/7</b><span>READY</span></div></div></section>
  <section className="explore-layout">
   <aside className="side-panel glass-panel">
    <div className="panel-title"><span>LAPTOP LOADOUT</span><b>01</b></div>
    <div className="brand-filter">{["ALL","ASUS","Lenovo","HP","Dell"].map(b=><button key={b} className={brand===b?"active":""} onClick={()=>setBrand(b)}>{b}</button>)}</div>
    <div className="eyebrow" style={{marginBottom:7}}>SELECT MODEL</div>
    <div className="model-list">{visible.map(l=><button key={l.id} className={`model-card ${laptopId===l.id?"active":""}`} onClick={()=>setLaptopId(l.id)}><em>{l.ramType}</em><span>{l.brand}</span><b>{l.model}</b><small>{l.family} · DEMO</small></button>)}</div>
    <div className="selected-specs"><div className="eyebrow">LIVE PROFILE</div>{[["CPU",laptop.cpu],["GPU",laptop.gpu],["RAM",`${laptop.ramType} · ${laptop.ramMax}GB max`],["SSD",`M.2 ${laptop.ssdFormFactors.join("/")}`],["BATTERY",`${laptop.batteryWh}Wh · demo`],["DISPLAY",laptop.display]].map(([a,b])=><div className="spec-line" key={a}><span>{a}</span><b>{b}</b></div>)}</div>
   </aside>
   <section className="viewer-panel glass-panel">
    <div className="viewer-head"><div><span className="eyebrow">CENTER VIEW · 3D LAPTOP CORE</span><h2>{laptop.brand.toUpperCase()} {laptop.model.toUpperCase()}</h2></div><div className="viewer-actions"><button className={exploded?"active":""} onClick={()=>setExploded(!exploded)}><Maximize2 size={14}/> EXPLODE</button><button className={xray?"active":""} onClick={()=>setXray(!xray)}><ScanLine size={14}/> X-RAY</button><button onClick={()=>setSelected(null)}><ShieldCheck size={14}/> RESET</button></div></div>
    <LaptopViewer exploded={exploded} xray={xray} selectedPart={selected} onSelect={setSelected}/>
    <div className="viewer-footer"><span>DRAG TO ROTATE</span><span>SCROLL TO ZOOM</span><span>CLICK INTERNALS TO INSPECT</span></div>
   </section>
   <aside className="side-panel glass-panel">
    <div className="panel-title"><span>COMPONENT SCANNER</span><b>02</b></div>
    <div className="component-list">{components.map(c=>{const Icon=c.icon;return <button key={c.id} className={`component-card ${selected===c.id?"selected":""}`} onClick={()=>setSelected(c.id)}><div className="component-icon"><Icon size={18}/></div><div><b>{c.name}</b><span>{c.sub}</span></div><em>{c.status}</em></button>})}</div>
    <div className="analysis-box"><span className="eyebrow">SELECTED COMPONENT</span><h3>{selected||"SYSTEM"}</h3>{[["PHYSICAL FIT","PASS"],["INTERFACE","PASS"],["THERMAL","VERIFY"],["POWER","PASS"],["FIRMWARE","UNKNOWN"]].map(([a,b])=><div className="analysis-row" key={a}><span>{a}</span><b className={b==="PASS"?"pass":b==="VERIFY"?"warn":"unknown"}>{b}</b></div>)}<div className="score-line"><span>DEMO CONFIDENCE</span><strong>{selected? "82%":"—"}</strong></div>{selected&&<div className="score-bar"><i style={{width:"82%"}}/></div>}</div>
    <button className="primary-btn wide" onClick={()=>onNavigate("COMPATIBILITY")}><Wrench size={14}/> CHECK COMPATIBILITY</button>
    <button className="bottom-action wide" onClick={()=>onNavigate("UPGRADE")}><Thermometer size={14}/> OPEN SERVICE BAY</button>
   </aside>
  </section>
 </div>
}
