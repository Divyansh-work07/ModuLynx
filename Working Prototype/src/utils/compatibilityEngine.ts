import type {
  CompatibilityResult,
  CompatibilityCheck,
  CompatibilityStatus,
  CheckStatus,
  Laptop,
  TranslationResult,
} from '@/types';

interface RAMUpgrade {
  currentGen: 'DDR4' | 'DDR5';
  currentCapacity: number;
  currentSpeed: number;
  upgradeGen: 'DDR4' | 'DDR5';
  upgradeCapacity: number;
  upgradeSpeed: number;
}

interface SSDUpgrade {
  currentFormFactor: string;
  currentInterface: 'NVMe' | 'SATA';
  currentPcieGen: number;
  upgradeFormFactor: string;
  upgradeInterface: 'NVMe' | 'SATA';
  upgradePcieGen: number;
}

function checkToStatus(check: CompatibilityCheck): CompatibilityStatus {
  const hasFail = check.status === 'FAIL';
  const hasUnknown = check.status === 'UNKNOWN';
  if (hasFail) return 'INCOMPATIBLE';
  if (hasUnknown) return 'INSUFFICIENT_INFORMATION';
  return 'COMPATIBLE';
}

function aggregateStatus(checks: CompatibilityCheck[]): CompatibilityStatus {
  if (checks.some((c) => c.status === 'FAIL')) return 'INCOMPATIBLE';
  if (checks.some((c) => c.status === 'UNKNOWN')) return 'INSUFFICIENT_INFORMATION';
  if (checks.some((c) => c.status === 'REVIEW')) return 'INSUFFICIENT_INFORMATION';
  return 'COMPATIBLE';
}

export function analyzeRAMCompatibility(
  laptop: Laptop,
  upgrade: RAMUpgrade
): CompatibilityResult {
  const checks: CompatibilityCheck[] = [];

  // PHYSICAL
  const physicalDetails: string[] = [];
  let physicalStatus: CheckStatus = 'PASS';
  let physicalScore = 100;

  if (upgrade.upgradeGen !== laptop.ramType) {
    physicalDetails.push(`✗ ${upgrade.upgradeGen} does not match laptop's ${laptop.ramType} SO-DIMM slots`);
    physicalStatus = 'FAIL';
    physicalScore = 0;
  } else {
    physicalDetails.push(`✓ ${upgrade.upgradeGen} SO-DIMM form factor matches`);
  }

  if (laptop.ramSlots === 0) {
    physicalDetails.push('✗ RAM is soldered — no SO-DIMM slots available');
    physicalStatus = 'FAIL';
    physicalScore = 0;
  } else {
    physicalDetails.push(`✓ ${laptop.ramSlots} SO-DIMM slot(s) available`);
  }

  checks.push({ layer: 'PHYSICAL', status: physicalStatus, score: physicalScore, details: physicalDetails });

  // THERMAL
  const thermalDetails: string[] = ['✓ Additional RAM module has negligible thermal impact'];
  checks.push({ layer: 'THERMAL', status: 'PASS', score: 100, details: thermalDetails });

  // POWER
  const powerDetails: string[] = [];
  let powerStatus: CheckStatus = 'PASS';
  let powerScore = 100;

  if (upgrade.upgradeGen === 'DDR4' && laptop.ramType === 'DDR4') {
    powerDetails.push('✓ DDR4 voltage 1.2V matches');
  } else if (upgrade.upgradeGen === 'DDR5' && laptop.ramType === 'DDR5') {
    powerDetails.push('✓ DDR5 voltage 1.1V matches');
  }
  if (upgrade.upgradeGen !== laptop.ramType) {
    powerDetails.push(`✗ Voltage mismatch: ${upgrade.upgradeGen} vs ${laptop.ramType}`);
    powerStatus = 'FAIL';
    powerScore = 0;
  }

  checks.push({ layer: 'POWER', status: powerStatus, score: powerScore, details: powerDetails });

  // PROTOCOL
  const protocolDetails: string[] = [];
  let protocolStatus: CheckStatus = 'PASS';
  let protocolScore = 100;

  if (upgrade.upgradeGen !== laptop.ramType) {
    protocolDetails.push(`✗ ${upgrade.upgradeGen} is not compatible with ${laptop.ramType} memory controller`);
    protocolStatus = 'FAIL';
    protocolScore = 0;
  } else {
    protocolDetails.push(`✓ ${upgrade.upgradeGen} generation matches`);
  }

  if (upgrade.upgradeCapacity > laptop.ramMaxCapacityGB) {
    protocolDetails.push(`✗ ${upgrade.upgradeCapacity}GB exceeds max supported ${laptop.ramMaxCapacityGB}GB`);
    protocolStatus = 'FAIL';
    protocolScore = Math.min(protocolScore, 0);
  } else {
    protocolDetails.push(`✓ ${upgrade.upgradeCapacity}GB is within max supported ${laptop.ramMaxCapacityGB}GB`);
  }

  if (upgrade.upgradeSpeed > laptop.ramSpeedMHz) {
    protocolDetails.push(`⚠ ${upgrade.upgradeSpeed}MHz exceeds native ${laptop.ramSpeedMHz}MHz — will downclock`);
    protocolStatus = protocolStatus === 'FAIL' ? 'FAIL' : 'REVIEW';
    protocolScore = Math.min(protocolScore, 75);
  } else {
    protocolDetails.push(`✓ ${upgrade.upgradeSpeed}MHz is within supported speed`);
  }

  checks.push({ layer: 'PROTOCOL', status: protocolStatus, score: protocolScore, details: protocolDetails });

  // FIRMWARE
  checks.push({
    layer: 'FIRMWARE',
    status: 'UNKNOWN',
    score: 50,
    details: [
      '⚠ BIOS may restrict supported RAM modules',
      '⚠ Verify QVL (Qualified Vendor List) if available',
      '⚠ Exact model-specific specifications must be verified',
    ],
  });

  const overall = aggregateStatus(checks);
  return {
    overall,
    checks,
    summary: overall === 'COMPATIBLE'
      ? 'Basic checks passed. Verify exact model-specific specifications before purchase.'
      : overall === 'INCOMPATIBLE'
      ? 'Incompatible based on available specifications.'
      : 'Review required — some specifications need verification.',
  };
}

export function analyzeSSDCompatibility(
  laptop: Laptop,
  upgrade: SSDUpgrade
): CompatibilityResult {
  const checks: CompatibilityCheck[] = [];

  // PHYSICAL
  const physicalDetails: string[] = [];
  let physicalStatus: CheckStatus = 'PASS';
  let physicalScore = 100;

  if (!laptop.ssdFormFactors.includes(upgrade.upgradeFormFactor)) {
    physicalDetails.push(`✗ M.2 ${upgrade.upgradeFormFactor} not supported — slot accepts ${laptop.ssdFormFactors.join(', ')}`);
    physicalStatus = 'FAIL';
    physicalScore = 0;
  } else {
    physicalDetails.push(`✓ M.2 ${upgrade.upgradeFormFactor} form factor matches slot`);
  }

  physicalDetails.push('⚠ Verify mounting position and clearance');
  if (physicalStatus !== 'FAIL') {
    physicalStatus = 'REVIEW';
    physicalScore = 80;
  }

  checks.push({ layer: 'PHYSICAL', status: physicalStatus, score: physicalScore, details: physicalDetails });

  // THERMAL
  checks.push({
    layer: 'THERMAL',
    status: 'REVIEW',
    score: 75,
    details: [
      '⚠ Verify SSD has adequate cooling',
      '⚠ Some Gen 4/5 SSDs require heatsink or thermal pad',
      '⚠ Check chassis clearance for heatsink',
    ],
  });

  // POWER
  checks.push({
    layer: 'POWER',
    score: 90,
    status: 'PASS',
    details: ['✓ M.2 slot provides standard 3.3V power', '✓ NVMe power draw within slot budget'],
  });

  // PROTOCOL
  const protocolDetails: string[] = [];
  let protocolStatus: CheckStatus = 'PASS';
  let protocolScore = 100;

  if (upgrade.upgradeInterface === 'NVMe') {
    protocolDetails.push('✓ NVMe interface uses PCIe lanes');
    if (upgrade.upgradePcieGen > laptop.pcieGen) {
      protocolDetails.push(`⚠ Gen ${upgrade.upgradePcieGen} SSD in Gen ${laptop.pcieGen} slot — runs at Gen ${laptop.pcieGen} speed`);
      protocolStatus = 'REVIEW';
      protocolScore = 75;
    } else {
      protocolDetails.push(`✓ PCIe Gen ${upgrade.upgradePcieGen} within slot Gen ${laptop.pcieGen}`);
    }
  } else if (upgrade.upgradeInterface === 'SATA') {
    protocolDetails.push('⚠ Verify slot supports SATA M.2 (some NVMe-only slots exist)');
    protocolStatus = 'REVIEW';
    protocolScore = 70;
  }

  checks.push({ layer: 'PROTOCOL', status: protocolStatus, score: protocolScore, details: protocolDetails });

  // FIRMWARE
  checks.push({
    layer: 'FIRMWARE',
    status: 'UNKNOWN',
    score: 50,
    details: [
      '⚠ BIOS may restrict supported SSD models',
      '⚠ Verify firmware compatibility with laptop BIOS',
      '⚠ Some laptops have SSD whitelists',
    ],
  });

  const overall = aggregateStatus(checks);
  return {
    overall,
    checks,
    summary: overall === 'COMPATIBLE'
      ? 'Basic checks passed. Verify mounting position and clearance before purchase.'
      : overall === 'INCOMPATIBLE'
      ? 'Incompatible based on available specifications.'
      : 'Review required — verify mounting, clearance, and BIOS compatibility.',
  };
}

export function translateInterface(
  source: string,
  target: string
): TranslationResult {
  const s = source.toLowerCase();
  const t = target.toLowerCase();

  // M.2 length translations
  const m2Sizes = ['2230', '2242', '2280'];
  const sSize = m2Sizes.find((sz) => s.includes(sz));
  const tSize = m2Sizes.find((sz) => t.includes(sz));

  if (sSize && tSize && sSize !== tSize) {
    return {
      result: 'ADAPTER_MAY_BE_REQUIRED',
      message: `Physical adapter may be required. M.2 ${sSize} to M.2 ${tSize} involves different mounting positions.`,
      details: [
        `M.2 ${sSize} is ${sSize === '2230' ? '30mm' : sSize === '2242' ? '42mm' : '80mm'} long`,
        `M.2 ${tSize} is ${tSize === '2230' ? '30mm' : tSize === '2242' ? '42mm' : '80mm'} long`,
        'A shorter SSD can sometimes fit a longer slot, but not vice versa',
        'Verify mounting screw position and chassis clearance',
        'Do not force a module — physical damage may occur',
      ],
    };
  }

  // DDR generation translation
  if ((s.includes('ddr4') && t.includes('ddr5')) || (s.includes('ddr5') && t.includes('ddr4'))) {
    return {
      result: 'NOT_RECOMMENDED',
      message: 'DDR4 and DDR5 are not interchangeable. Different notch positions and electrical interfaces.',
      details: [
        'DDR4 and DDR5 SO-DIMMs have different keying notch positions',
        'Voltage differs: DDR4 is 1.2V, DDR5 is 1.1V',
        'Memory controller in CPU only supports one generation',
        'No adapter exists — motherboard must support the target generation',
      ],
    };
  }

  // NVMe to SATA
  if (s.includes('nvme') && t.includes('sata')) {
    return {
      result: 'NOT_RECOMMENDED',
      message: 'NVMe and SATA use different protocols and key types. Direct conversion is not possible.',
      details: [
        'NVMe uses M-Key, SATA uses B+M Key',
        'NVMe uses PCIe lanes, SATA uses AHCI protocol',
        'Some slots support both (B+M Key SATA or M-Key NVMe only)',
        'No passive adapter converts between protocols',
      ],
    };
  }

  // USB-C to HDMI
  if (s.includes('usb-c') && t.includes('hdmi')) {
    return {
      result: 'CONVERTER_MAY_BE_REQUIRED',
      message: 'USB-C to HDMI requires DisplayPort Alt Mode support or an active converter.',
      details: [
        'Check if USB-C port supports DisplayPort Alt Mode',
        'Passive cables work only with Alt Mode support',
        'Active converters work with any USB-C port',
        'Thunderbolt 3/4 ports always support video output',
      ],
    };
  }

  // USB-C to DisplayPort
  if (s.includes('usb-c') && t.includes('displayport')) {
    return {
      result: 'ADAPTER_MAY_BE_REQUIRED',
      message: 'USB-C to DisplayPort adapter required. Verify Alt Mode support.',
      details: [
        'DisplayPort Alt Mode enables direct video output via USB-C',
        'Passive adapter works if Alt Mode is supported',
        'Active adapter needed if no Alt Mode support',
        'Thunderbolt ports support DisplayPort natively',
      ],
    };
  }

  // Same interface
  if (s === t || (s.includes('nvme') && t.includes('nvme'))) {
    return {
      result: 'DIRECT_COMPATIBILITY',
      message: 'Direct compatibility — same interface type.',
      details: ['No adapter or converter required', 'Verify physical form factor and generation separately'],
    };
  }

  return {
    result: 'INSUFFICIENT_INFORMATION',
    message: 'Insufficient information to determine compatibility.',
    details: [
      'Specify exact source and target interfaces',
      'Include form factor, protocol, and generation details',
    ],
  };
}
