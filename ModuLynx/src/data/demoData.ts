export interface Laptop {
  id:string; brand:string; model:string; family:string; ramType:"DDR4"|"DDR5";
  ramMax:number; ramSlots:number; pcieGen:number; ssdFormFactors:string[];
  ssdInterfaces:("NVMe"|"SATA")[]; batteryWh:number; display:string; cpu:string; gpu:string;
}
export const laptops:Laptop[]=[
 {id:"asus-tuf-a15",brand:"ASUS",model:"TUF Gaming A15",family:"TUF",ramType:"DDR5",ramMax:64,ramSlots:2,pcieGen:4,ssdFormFactors:["2230","2242","2280"],ssdInterfaces:["NVMe"],batteryWh:90,display:'15.6" FHD',cpu:"AMD Ryzen 7 class",gpu:"RTX class"},
 {id:"asus-rog-g15",brand:"ASUS",model:"ROG Strix G15",family:"ROG",ramType:"DDR4",ramMax:32,ramSlots:2,pcieGen:4,ssdFormFactors:["2280"],ssdInterfaces:["NVMe"],batteryWh:90,display:'15.6" FHD',cpu:"Ryzen 7 class",gpu:"RTX class"},
 {id:"lenovo-legion5",brand:"Lenovo",model:"Legion 5",family:"Legion",ramType:"DDR5",ramMax:64,ramSlots:2,pcieGen:4,ssdFormFactors:["2280"],ssdInterfaces:["NVMe"],batteryWh:80,display:'15.6" FHD',cpu:"Ryzen 7 class",gpu:"RTX class"},
 {id:"hp-victus",brand:"HP",model:"Victus Gaming",family:"Victus",ramType:"DDR5",ramMax:64,ramSlots:2,pcieGen:4,ssdFormFactors:["2280"],ssdInterfaces:["NVMe"],batteryWh:70,display:'15.6" FHD',cpu:"Core/Ryzen class",gpu:"RTX class"},
 {id:"dell-g15",brand:"Dell",model:"G15",family:"G Series",ramType:"DDR5",ramMax:64,ramSlots:2,pcieGen:4,ssdFormFactors:["2280"],ssdInterfaces:["NVMe"],batteryWh:86,display:'15.6" FHD',cpu:"Core/Ryzen class",gpu:"RTX class"}
];
export const lessons=[
 {id:"cpu",title:"CPU",group:"CORE COMPONENTS",icon:"CPU",what:"The processor executes instructions and coordinates computation.",why:"CPU capability affects application performance, responsiveness and supported platform features.",how:"Check socket or soldered design, supported memory, power envelope and platform generation."},
 {id:"gpu",title:"GPU",group:"CORE COMPONENTS",icon:"GPU",what:"The graphics processor handles rendering and parallel workloads.",why:"GPU capability matters for gaming, 3D, video and AI workloads.",how:"Check whether it is soldered, its thermal design and the system cooling path."},
 {id:"ram",title:"RAM",group:"UPGRADEABLE COMPONENTS",icon:"RAM",what:"RAM is temporary working memory used by active programs.",why:"More memory can reduce paging and improve multitasking.",how:"Match DDR generation, SO-DIMM form factor, supported capacity and platform limits."},
 {id:"ssd",title:"SSD",group:"UPGRADEABLE COMPONENTS",icon:"SSD",what:"An SSD stores the operating system, applications and files.",why:"Storage capacity and interface affect capacity and throughput.",how:"Match M.2 size, keying, protocol, PCIe generation and physical clearance."},
 {id:"motherboard",title:"Motherboard",group:"CORE COMPONENTS",icon:"BOARD",what:"The main board connects compute, memory, storage, power and I/O.",why:"It determines much of the laptop's compatibility envelope.",how:"Use board model, connector layout and verified service documentation."},
 {id:"battery",title:"Battery",group:"POWER SYSTEM",icon:"BAT",what:"The battery provides portable electrical energy.",why:"Capacity, voltage and connector design affect runtime and safety.",how:"Match the exact part number, connector and electrical specifications."},
 {id:"cooling",title:"Cooling",group:"THERMAL SYSTEM",icon:"FAN",what:"Fans and heat pipes move heat away from high-power components.",why:"Thermal limits can constrain performance and upgrades.",how:"Check mounting, heat-pipe geometry, fan connector and thermal envelope."},
 {id:"pcie",title:"PCIe / M.2",group:"INTERFACES",icon:"PCIe",what:"PCIe is a high-speed interconnect used by devices such as NVMe SSDs.",why:"Interface generations and lane configurations affect compatibility and bandwidth.",how:"Match physical slot, keying, lane support and protocol."},
 {id:"usb-c",title:"USB-C",group:"INTERFACES",icon:"USB",what:"USB-C is a connector; capabilities depend on the implemented protocols.",why:"A USB-C port may support data, charging, display output or combinations.",how:"Verify the laptop's exact port capabilities before selecting an adapter."}
];
export const upgradeCards=[
 {id:"ram",title:"RAM Upgrade",component:"RAM",difficulty:"EASY",current:"8 GB DDR5",proposed:"16 GB DDR5",compat:"COMPATIBLE",benefit:"More multitasking headroom",tools:"Phillips screwdriver",warning:"Verify maximum supported capacity and module configuration."},
 {id:"ssd",title:"NVMe SSD Upgrade",component:"SSD",difficulty:"EASY",current:"512 GB NVMe",proposed:"1 TB NVMe",compat:"COMPATIBLE",benefit:"More storage",tools:"Phillips screwdriver",warning:"Match M.2 length and PCIe interface."},
 {id:"wifi",title:"Wi-Fi Card",component:"Wi-Fi",difficulty:"MEDIUM",current:"Current WLAN card",proposed:"New WLAN card",compat:"INSUFFICIENT_INFORMATION",benefit:"Potential wireless feature upgrade",tools:"Phillips screwdriver + antenna tool",warning:"Check BIOS whitelist, connector, antenna and OS driver support."},
 {id:"cooling",title:"Cooling Service",component:"Cooling",difficulty:"MEDIUM",current:"Existing thermal system",proposed:"Clean + repaste",compat:"COMPATIBLE",benefit:"Potentially improved thermal maintenance",tools:"Phillips screwdriver + cleaning supplies",warning:"Use the correct thermal interface material and follow service documentation."}
];
