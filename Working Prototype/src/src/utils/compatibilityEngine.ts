import type { Laptop } from "../data/demoData";

export type CheckStatus="PASS"|"FAIL"|"REVIEW";
export interface Check { layer:string; status:CheckStatus; score:number; details:string[] }
export interface CompatibilityResult { overall:"COMPATIBLE"|"INCOMPATIBLE"|"INSUFFICIENT_INFORMATION"; checks:Check[]; summary:string }

export function analyzeRAMCompatibility(l:Laptop,p:{upgradeGen:"DDR4"|"DDR5";upgradeCapacity:number;upgradeSpeed:number}):CompatibilityResult{
 const checks:Check[]=[
  {layer:"PHYSICAL",status:p.upgradeGen===l.ramType?"PASS":"FAIL",score:p.upgradeGen===l.ramType?100:0,details:[p.upgradeGen===l.ramType?"✓ DDR generation matches platform":"✗ DDR generation mismatch","• SO-DIMM form factor required"]},
  {layer:"CAPACITY",status:p.upgradeCapacity<=l.ramMax?"PASS":"FAIL",score:p.upgradeCapacity<=l.ramMax?100:25,details:[p.upgradeCapacity<=l.ramMax?`✓ ${p.upgradeCapacity} GB is within demo maximum ${l.ramMax} GB`:`✗ Exceeds demo maximum ${l.ramMax} GB`]},
  {layer:"SPEED",status:"REVIEW",score:78,details:[`• Module rated ${p.upgradeSpeed} MT/s`, "⚠ Verify exact laptop memory speed support"]},
  {layer:"THERMAL / POWER",status:"REVIEW",score:72,details:["⚠ Exact power and thermal data not available in demo dataset"]},
  {layer:"FIRMWARE",status:"REVIEW",score:55,details:["⚠ Verify BIOS/firmware support and module layout"]},
 ];
 const failed=checks.some(c=>c.status==="FAIL");
 return {overall:failed?"INCOMPATIBLE":"INSUFFICIENT_INFORMATION",checks,summary:failed?"The selected upgrade conflicts with a known platform constraint.":"The demo data does not contain enough manufacturer-level evidence to certify compatibility."};
}
export function analyzeSSDCompatibility(l:Laptop,p:{upgradeFormFactor:string;upgradeInterface:"NVMe"|"SATA";upgradePcieGen:number}):CompatibilityResult{
 const form=l.ssdFormFactors.includes(p.upgradeFormFactor), int=l.ssdInterfaces.includes(p.upgradeInterface), gen=p.upgradePcieGen<=l.pcieGen;
 const checks:Check[]=[
  {layer:"PHYSICAL",status:form?"PASS":"FAIL",score:form?100:0,details:[form?`✓ M.2 ${p.upgradeFormFactor} is listed in demo support`:`✗ M.2 ${p.upgradeFormFactor} is not listed in demo support`]},
  {layer:"PROTOCOL",status:int?"PASS":"FAIL",score:int?100:0,details:[int?`✓ ${p.upgradeInterface} interface matches`:`✗ ${p.upgradeInterface} is not listed in demo support`]},
  {layer:"PCIe",status:gen?"PASS":"REVIEW",score:gen?100:60,details:[gen?`✓ Gen ${p.upgradePcieGen} is within demo Gen ${l.pcieGen} envelope`:"⚠ Higher generation may negotiate down; verify platform support"]},
  {layer:"THERMAL / CLEARANCE",status:"REVIEW",score:70,details:["⚠ Verify controller temperature and chassis clearance"]},
  {layer:"FIRMWARE",status:"REVIEW",score:60,details:["⚠ Verify BIOS storage compatibility"]},
 ];
 const failed=checks.some(c=>c.status==="FAIL");
 return {overall:failed?"INCOMPATIBLE":"INSUFFICIENT_INFORMATION",checks,summary:failed?"The selected SSD conflicts with a known interface or physical constraint.":"The demo dataset cannot certify the upgrade without exact manufacturer/service information."};
}
export function translateInterface(source:string,target:string){
 const a=source.toLowerCase(),b=target.toLowerCase();
 if(a===b)return {result:"DIRECT_COMPATIBILITY",message:"The interfaces are the same in this demo.",details:["No adapter concept is required."]};
 if(a.includes("2230")&&b.includes("2280"))return {result:"ADAPTER_MAY_BE_REQUIRED",message:"A physical mounting difference exists.",details:["An adapter/bracket may solve mounting, but connector position and chassis clearance must be verified.","The electrical protocol still needs to match."]};
 if(a.includes("ddr4")&&b.includes("ddr5"))return {result:"NOT_RECOMMENDED",message:"DDR4 and DDR5 are different memory generations.",details:["A passive adapter does not make incompatible memory generations interchangeable.","The platform must natively support the target generation."]};
 if(a.includes("nvme")&&b.includes("sata"))return {result:"CONVERTER_MAY_BE_REQUIRED",message:"NVMe and SATA are different storage protocols.",details:["A protocol bridge may exist in some form factors, but performance and boot support vary."]};
 if(a.includes("usb-c")&&(b.includes("hdmi")||b.includes("displayport")))return {result:"CONVERTER_MAY_BE_REQUIRED",message:"USB-C to display output depends on Alt Mode support.",details:["Verify the source USB-C port supports the required display protocol."]};
 return {result:"INSUFFICIENT_INFORMATION",message:"The translator needs more interface details.",details:["Provide exact connector, protocol, generation and physical dimensions."]};
}
