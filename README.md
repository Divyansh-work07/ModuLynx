# MODULYNX

**Explore. Match. Upgrade.**

MODULYNX is a Universal Cross-Brand Modular Laptop Configurator & Compatibility Platform. It helps beginners, laptop enthusiasts, students, and repair technicians understand laptop internals, explore components visually, and determine whether a replacement or upgrade component is compatible with a particular laptop.

## Features

- **EXPLORE** — Interactive 3D laptop model with clickable components, exploded view, and a gaming-lobby-style three-panel layout (Laptop Loadout, 3D Laptop Core, Component Scanner)
- **COMPATIBILITY CENTER** — Multi-layer compatibility engine that evaluates Physical, Thermal, Power, Protocol, and Firmware constraints — not just component names. Returns COMPATIBLE, INCOMPATIBLE, or INSUFFICIENT INFORMATION
- **COMPATIBILITY TRANSLATOR** — Determines whether an adapter, converter, or enclosure is needed between two interfaces (M.2 2230 → 2280, USB-C → HDMI, DDR4 → DDR5, etc.)
- **UPGRADE CENTER** — Upgrade cards with current → proposed, compatibility, expected benefit, installation difficulty, warnings, required tools, things to verify, and step-by-step installation guides
- **LEARN MODE** — Beginner-friendly lessons for CPU, GPU, RAM, SSD, Motherboard, VRAM, Battery, Cooling Fan, Heat Pipe, PCIe, M.2, SO-DIMM, and USB-C. Each lesson uses WHAT / WHY / HOW structure
- **AI BOARD IDENTIFICATION (SCANNER)** — Upload a motherboard image for a demo scanning interface. Structured so a YOLO/OpenCV/OCR backend can be connected later
- **SEARCH** — Search demo data for laptop models, components, hardware terms, and learning topics
- **Sustainability section** — Encourages repair and upgrades over unnecessary replacement

## Technologies

- **React 18** + **TypeScript** — UI framework
- **Vite** — Build tool and dev server
- **Three.js** + **React Three Fiber** + **Drei** — 3D laptop model
- **Tailwind CSS** — Styling
- **Lucide React** — Icons

## Installation

```bash
npm install
```

## Running

```bash
npm run dev
```

Then open the URL shown in the terminal (typically `http://localhost:5173`).

## Build

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── BootSequence.tsx   # Startup boot animation
│   ├── LoadoutPanel.tsx   # Left panel — laptop selector & specs
│   ├── ScannerPanel.tsx   # Right panel — component scanner cards
│   └── TopNav.tsx         # HUD-style top navigation + search
├── data/
│   └── demoData.ts        # Demo laptops, components, lessons, upgrades
├── pages/                # Main application pages
│   ├── ExplorePage.tsx
│   ├── CompatibilityPage.tsx
│   ├── UpgradePage.tsx
│   ├── LearnPage.tsx
│   └── ScannerPage.tsx
├── three/                # 3D rendering
│   ├── LaptopModel.tsx    # Stylized laptop geometry
│   └── LaptopViewer.tsx   # Canvas wrapper + controls
├── types/
│   └── index.ts           # TypeScript interfaces
├── utils/
│   ├── compatibilityEngine.ts  # Multi-layer compatibility logic
│   └── search.ts          # Search across demo data
├── App.tsx               # Root component + navigation
├── index.css             # Global styles + design system
└── main.tsx              # Entry point
```

## Important Notes

- **All laptop specifications are DEMO / SAMPLE DATA.** They are not official manufacturer specifications. Always verify with the manufacturer before purchasing any component.
- The 3D laptop model is a stylized demo model, not an exact manufacturer chassis.
- The AI Board Identification scanner produces simulated results. No actual AI computer vision model is connected.
- The compatibility engine returns INSUFFICIENT INFORMATION when required specifications are unknown — it never claims compatibility without evidence.

## Future Improvements

- **Backend**: FastAPI server with Neo4j graph database for a real compatibility graph (Laptop → supports → Component → uses → Interface → requires → Protocol → has → Power/Thermal constraint)
- **AI Scanner**: YOLO object detection + OpenCV + OCR for real motherboard identification
- **Real database**: Replace demo data with verified manufacturer specifications
- **User accounts**: Save laptop configurations and upgrade plans
- **Community**: User-submitted compatibility reports and upgrade guides
