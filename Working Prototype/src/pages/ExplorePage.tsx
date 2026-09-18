import { useState } from "react";

import {
  Battery,
  Box,
  Cpu,
  HardDrive,
  Layers3,
  Maximize2,
  Rotate3D,
  ScanLine,
  Thermometer,
  Wrench,
  Zap,
} from "lucide-react";

import LaptopViewer from "../three/LaptopViewer";

const components = [
  {
    name: "RAM",
    icon: Layers3,
    type: "DDR5 SO-DIMM",
    status: "UPGRADE",
  },
  {
    name: "SSD",
    icon: HardDrive,
    type: "M.2 NVMe",
    status: "UPGRADE",
  },
  {
    name: "CPU",
    icon: Cpu,
    type: "PROCESSOR",
    status: "SOLDERED",
  },
  {
    name: "Battery",
    icon: Battery,
    type: "LI-ION",
    status: "INTERNAL",
  },
  {
    name: "Cooling",
    icon: Thermometer,
    type: "HEATPIPE + FAN",
    status: "INTERNAL",
  },
];

export default function ExplorePage() {

  const [exploded, setExploded] =
    useState(false);

  const [xray, setXray] =
    useState(false);

  const [selected, setSelected] =
    useState("RAM");

  return (

    <main className="explore-page">

      {/* HEADER */}

      <section className="hero-copy">

        <div>

          <span className="eyebrow">
            MODULYNX / HARDWARE INTELLIGENCE
          </span>

          <h1>
            EXPLORE
            <br />
            YOUR MACHINE.
          </h1>

          <p>
            Inspect laptop architecture,
            identify upgrade points and
            analyze hardware compatibility
            through an interactive 3D
            hardware environment.
          </p>

        </div>

        <div className="model-status">

          <span className="status-dot" />

          3D CORE ONLINE

        </div>

      </section>


      {/* WORKSPACE */}

      <section className="workspace">


        {/* LEFT PANEL */}

        <aside className="hardware-panel panel">

          <div className="panel-title">

            <span>
              LAPTOP CONFIGURATION
            </span>

            <small>
              01
            </small>

          </div>


          <div className="machine-card active">

            <div className="machine-image">

              <div className="machine-outline">

                <Box size={42} />

              </div>

              <span>
                MODULYNX
              </span>

            </div>

            <div>

              <strong>
                Modular Laptop
              </strong>

              <small>
                Demonstration Hardware
              </small>

            </div>

          </div>


          <div className="spec-list">

            <div>
              <span>
                ARCHITECTURE
              </span>

              <b>
                x86_64
              </b>
            </div>

            <div>
              <span>
                MEMORY
              </span>

              <b>
                DDR5
              </b>
            </div>

            <div>
              <span>
                STORAGE
              </span>

              <b>
                M.2 NVMe
              </b>
            </div>

            <div>
              <span>
                DISPLAY
              </span>

              <b>
                15.6"
              </b>
            </div>

          </div>


          <div className="hardware-actions">

            <button>

              <Wrench size={14} />

              HARDWARE MAP

            </button>

            <button>

              <Zap size={14} />

              POWER MAP

            </button>

          </div>

        </aside>


        {/* CENTER 3D */}

        <section className="viewer-panel panel">

          <div className="viewer-header">

            <div>

              <span className="eyebrow">
                3D HARDWARE CORE
              </span>

              <h2>
                LAPTOP ARCHITECTURE
              </h2>

            </div>


            <div className="viewer-actions">

              <button
                className={
                  exploded
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setExploded(!exploded)
                }
              >

                <Maximize2 size={15} />

                EXPLODE

              </button>


              <button
                className={
                  xray
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setXray(!xray)
                }
              >

                <ScanLine size={15} />

                X-RAY

              </button>

            </div>

          </div>


          <LaptopViewer
            exploded={exploded}
            xray={xray}
            selectedPart={selected}
          />


          <div className="viewer-footer">

            <span>

              <Rotate3D size={14} />

              DRAG TO ROTATE

            </span>

            <span>
              SCROLL TO ZOOM
            </span>

            <span>
              MODEL / DEMO-01
            </span>

          </div>

        </section>


        {/* RIGHT PANEL */}

        <aside className="component-panel panel">

          <div className="panel-title">

            <span>
              COMPONENT ANALYZER
            </span>

            <small>
              02
            </small>

          </div>


          <div className="component-list">

            {components.map(
              (component) => {

                const Icon =
                  component.icon;

                return (

                  <button
                    key={component.name}
                    className={
                      selected ===
                      component.name
                        ? "component-item selected"
                        : "component-item"
                    }
                    onClick={() =>
                      setSelected(
                        component.name
                      )
                    }
                  >

                    <div className="component-icon">

                      <Icon size={18} />

                    </div>


                    <div>

                      <strong>
                        {component.name}
                      </strong>

                      <span>
                        {component.type}
                      </span>

                    </div>


                    <small>
                      {component.status}
                    </small>

                  </button>

                );

              }
            )}

          </div>


          {/* ANALYSIS */}

          <div className="analysis-box">

            <span className="eyebrow">
              COMPONENT ANALYSIS
            </span>

            <h3>
              {selected}
            </h3>


            <div className="analysis-row">

              <span>
                PHYSICAL FIT
              </span>

              <b className="pass">
                PASS
              </b>

            </div>


            <div className="analysis-row">

              <span>
                INTERFACE
              </span>

              <b className="pass">
                PASS
              </b>

            </div>


            <div className="analysis-row">

              <span>
                POWER
              </span>

              <b className="pass">
                PASS
              </b>

            </div>


            <div className="analysis-row">

              <span>
                THERMAL
              </span>

              <b className="warning">
                VERIFY
              </b>

            </div>


            <div className="analysis-row">

              <span>
                FIRMWARE
              </span>

              <b className="unknown">
                UNKNOWN
              </b>

            </div>


            <div className="compatibility-score">

              <div>

                <span>
                  COMPATIBILITY
                </span>

                <strong>
                  ANALYSIS
                </strong>

              </div>

              <div className="score">
                82%
              </div>

            </div>

          </div>

        </aside>

      </section>

    </main>
  );
}