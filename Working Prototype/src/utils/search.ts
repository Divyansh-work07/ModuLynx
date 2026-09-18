import { laptops, learnLessons, upgradeCards } from '@/data/demoData';

export interface SearchResult {
  type: 'laptop' | 'component' | 'learn' | 'upgrade';
  title: string;
  subtitle: string;
  id: string;
}

export function searchAll(query: string): SearchResult[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const results: SearchResult[] = [];

  laptops.forEach((l) => {
    if (l.model.toLowerCase().includes(q) || l.brand.toLowerCase().includes(q)) {
      results.push({
        type: 'laptop',
        title: `${l.brand} ${l.model}`,
        subtitle: `Laptop — ${l.specs.cpu}`,
        id: l.id,
      });
    }
  });

  learnLessons.forEach((l) => {
    if (l.title.toLowerCase().includes(q) || l.what.toLowerCase().includes(q)) {
      results.push({
        type: 'learn',
        title: l.title,
        subtitle: `Learn — ${l.category}`,
        id: l.id,
      });
    }
  });

  upgradeCards.forEach((u) => {
    if (u.category.toLowerCase().includes(q) || u.current.toLowerCase().includes(q) || u.proposed.toLowerCase().includes(q)) {
      results.push({
        type: 'upgrade',
        title: u.category,
        subtitle: `Upgrade — ${u.current} → ${u.proposed}`,
        id: u.id,
      });
    }
  });

  const terms: Record<string, string> = {
    ram: 'Memory / RAM',
    ssd: 'Storage / SSD',
    ddr4: 'DDR4 Memory',
    ddr5: 'DDR5 Memory',
    'm.2': 'M.2 Storage',
    nvme: 'NVMe Storage',
    sata: 'SATA Storage',
    pcie: 'PCIe Interface',
    battery: 'Battery',
    cooling: 'Cooling System',
    fan: 'Cooling Fan',
    'heat pipe': 'Heat Pipe',
    cpu: 'Processor / CPU',
    gpu: 'Graphics / GPU',
    motherboard: 'Motherboard',
    'usb-c': 'USB-C Port',
    hdmi: 'HDMI Port',
    display: 'Display Panel',
    wifi: 'Wi-Fi Card',
  };

  Object.entries(terms).forEach(([key, label]) => {
    if (key.includes(q) || q.includes(key)) {
      results.push({
        type: 'component',
        title: label,
        subtitle: 'Hardware Term',
        id: key,
      });
    }
  });

  return results.slice(0, 20);
}
