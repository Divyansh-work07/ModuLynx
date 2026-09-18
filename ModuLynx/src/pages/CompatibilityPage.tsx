import { useState } from "react";
import { AlertTriangle, ArrowRight, CheckCircle2, Play, Repeat, XCircle } from "lucide-react";
import { laptops } from "../data/demoData";
import { analyzeRAMCompatibility, analyzeSSDCompatibility, translateInterface, type CompatibilityResult } from "../utils/compatibilityEngine";

export default function CompatibilityPage(){
 const [laptopId,setLaptopId]=useState(laptops[0].id),[category,setCategory]=useState<"RAM"|"SSD">("RAM"),[result,setResult]=useState<CompatibilityResult|null>(null),[busy,setBusy]=useState(false);
 const [ramGen,setRamGen]=useState<"DDR4"|"DDR5">("DDR5"),[ramCap,setRamCap]=useState(16),[ramSpeed,setRamSpeed]=useState(4800);
 const [ff,setFf]=useState("2280"),[intf,setIntf]=useState<"NVMe"|"SATA">("NVMe"),[gen,setGen]=useState(4);
 const [source,setSource]=useState("M.2 2230 NVMe"),[target,setTarget]=useState("M.2 2280 NVMe"),[translation,setTranslation]=useState<any>(null);
 const laptop=laptops.find(x=>x.id===laptopId)!;
 const run=()=>{setBusy(true);setResult(null);setTimeout(()=>{setResult(category==="RAM"?analyzeRAMCompatibility(laptop,{upgradeGen:ramGen,upgradeCapacity:ramCap,upgradeSpeed:ramSpeed}):analyzeSSDCompatibility(laptop,{upgradeFormFactor:ff,upgradeInterface:intf,upgradePcieGen:gen}));setBusy(false)},650)};
 return <div className="module-page">
  <section className="module-hero"><div><span className="eyebrow">MODULE 02 · CONSTRAINT SOLVER</span><h1>COMPATIBILITY CENTER</h1><p>Test a component against a selected laptop using physical, protocol, thermal, power and firmware layers.</p></div><div className="hero-chip">5-LAYER ANALYSIS</div></section>
  <div className="compat-grid">
   <section className="glass-panel config-panel">
    <div className="section-head"><span>LAPTOP TARGET</span><b>01</b></div>
    <select value={laptopId} onChange={e=>setLaptopId(e.target.value)}>{laptops.map(l=><option key={l.id} value={l.id}>{l.brand} {l.model} · DEMO</option>)}</select>
    <div className="mini-stats"><div><small>RAM</small><b>{laptop.ramType}</b></div><div><small>PCIe</small><b>GEN {laptop.pcieGen}</b></div><div><small>SSD</small><b>M.2 {laptop.ssdFormFactors.join("/")}</b></div></div>
    <div className="section-head"><span>COMPONENT TARGET</span><b>02</b></div>
    <div className="segmented"><button className={category==="RAM"?"active":""} onClick={()=>setCategory("RAM")}>RAM</button><button className={category==="SSD"?"active":""} onClick={()=>setCategory("SSD")}>SSD</button></div>
    {category==="RAM"?<div className="field-grid"><label>GEN<select value={ramGen} onChange={e=>setRamGen(e.target.value as any)}><option>DDR4</option><option>DDR5</option></select></label><label>CAPACITY<select value={ramCap} onChange={e=>setRamCap(+e.target.value)}><option>8</option><option>16</option><option>32</option><option>64</option></select></label><label>SPEED<select value={ramSpeed} onChange={e=>setRamSpeed(+e.target.value)}><option>3200</option><option>4800</option><option>5600</option></select></label></div>:<div className="field-grid"><label>FORM FACTOR<select value={ff} onChange={e=>setFf(e.target.value)}><option>2230</option><option>2242</option><option>2280</option></select></label><label>INTERFACE<select value={intf} onChange={e=>setIntf(e.target.value as any)}><option>NVMe</option><option>SATA</option></select></label><label>PCIE<select value={gen} onChange={e=>setGen(+e.target.value)}><option>3</option><option>4</option><option>5</option></select></label></div>}
    <button className="primary-btn wide" onClick={run} disabled={busy}><Play size={15}/>{busy?"ANALYZING…":"RUN ANALYSIS"}</button>
   </section>
   <section className="glass-panel result-panel">{busy?<div className="analysis-wait"><div className="spinner"/><b>RUNNING ANALYSIS</b><span>EVALUATING 5 CONSTRAINT LAYERS…</span></div>:result?<Result result={result}/>:<div className="analysis-wait idle"><AlertTriangle size={28}/><b>AWAITING ANALYSIS</b><span>Select a target and run the solver.</span></div>}</section>
  </div>
  <section className="glass-panel translator"><div className="section-title"><Repeat/> COMPATIBILITY TRANSLATOR</div><p>Explore whether an adapter, converter or bridge may be required.</p><div className="translator-row"><input value={source} onChange={e=>setSource(e.target.value)}/><ArrowRight/><input value={target} onChange={e=>setTarget(e.target.value)}/><button className="orange-btn" onClick={()=>setTranslation(translateInterface(source,target))}>TRANSLATE</button></div>{translation&&<div className="translation-result"><b>{translation.result.replaceAll("_"," ")}</b><p>{translation.message}</p>{translation.details.map((d:string,i:number)=><span key={i}>› {d}</span>)}</div>}</section>
 </div>
}
function Result({result}:{result:CompatibilityResult}){const bad=result.overall==="INCOMPATIBLE";return <div><div className={`result-banner ${bad?"bad":"review"}`}>{bad?<XCircle/>:<CheckCircle2/>}<div><small>FINAL STATUS</small><strong>{result.overall.replace(/_/g," ")}</strong></div></div><div className="check-list">{result.checks.map(c=><div className="check-row" key={c.layer}><div><b>{c.layer}</b><span>{c.details[0]}</span></div><strong className={c.status.toLowerCase()}>{c.status}</strong><div className="meter"><i style={{width:`${c.score}%`}}/></div></div>)}</div><p className="result-summary">{result.summary}</p></div>}
