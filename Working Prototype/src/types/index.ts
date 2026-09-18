export type Brand = 'ASUS' | 'Lenovo' | 'HP' | 'Dell';

export type ComponentType =
  | 'CPU'
  | 'GPU'
  | 'RAM'
  | 'STORAGE'
  | 'BATTERY'
  | 'COOLING'
  | 'DISPLAY'
  | 'MOTHERBOARD'
  | 'PORTS'
  | 'WIFI';

export interface LaptopSpecs {
  cpu: string;
  gpu: string;
  ram: string;
  storage: string;
  battery: string;
  cooling: string;
  display: string;
}

export interface Laptop {
  id: string;
  brand: Brand;
  model: string;
  specs: LaptopSpecs;
  ramType: 'DDR4' | 'DDR5';
  ramSlots: number;
  ramMaxCapacityGB: number;
  ramSpeedMHz: number;
  ssdSlots: string[];
  ssdFormFactors: string[];
  pcieGen: number;
  batteryVoltage: number;
  batteryConnector: string;
  coolingFans: number;
  heatPipes: number;
}

export interface ComponentInfo {
  type: ComponentType;
  title: string;
  category: string;
  details: Record<string, string>;
  description: string;
}

export type CompatibilityStatus = 'COMPATIBLE' | 'INCOMPATIBLE' | 'INSUFFICIENT_INFORMATION';

export type CheckStatus = 'PASS' | 'FAIL' | 'REVIEW' | 'UNKNOWN';

export interface CompatibilityCheck {
  layer: 'PHYSICAL' | 'THERMAL' | 'POWER' | 'PROTOCOL' | 'FIRMWARE';
  status: CheckStatus;
  score: number;
  details: string[];
}

export interface CompatibilityResult {
  overall: CompatibilityStatus;
  checks: CompatibilityCheck[];
  summary: string;
}

export interface UpgradeCard {
  id: string;
  category: string;
  current: string;
  proposed: string;
  compatibility: CompatibilityStatus;
  benefit: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  warnings: string[];
  tools: string[];
  verify: string[];
}

export interface LearnLesson {
  id: string;
  title: string;
  icon: string;
  what: string;
  why: string;
  how: string;
  category: string;
}

export interface TranslationResult {
  result: 'DIRECT_COMPATIBILITY' | 'ADAPTER_MAY_BE_REQUIRED' | 'CONVERTER_MAY_BE_REQUIRED' | 'NOT_RECOMMENDED' | 'INSUFFICIENT_INFORMATION';
  message: string;
  details: string[];
}
