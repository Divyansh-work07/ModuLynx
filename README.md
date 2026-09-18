# MODULYNX

**Explore. Match. Upgrade.**

A lightweight futuristic web prototype for exploring laptop internals and checking cross-brand component compatibility.

## Run with Git Bash

Open Git Bash **inside this folder**, the folder that directly contains `package.json`, then:

```bash
npm install
npm run dev
```

Open the localhost URL shown by Vite, normally `http://localhost:5173/`.

## Build

```bash
npm run build
```

## Type check

```bash
npm run typecheck
```

## Included

- EXPLORE gaming-lobby interface
- Interactive procedural 3D laptop
- Component selection
- X-ray and exploded views
- Compatibility Center
- Compatibility Translator
- Upgrade Center
- Learn Mode
- AI Board Identification demo scanner
- Global search
- Responsive futuristic HUD styling
- Demo laptop/component data

## Important

The laptop specifications are DEMO/SAMPLE DATA. The 3D laptop is a stylized procedural model, not an exact manufacturer chassis. The scanner is simulated; no real computer-vision model is connected yet.

## Structure

```text
ModuLynx/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── eslint.config.js
├── src/
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── data/
│   ├── pages/
│   ├── three/
│   ├── types/
│   └── utils/
└── README.md
```
