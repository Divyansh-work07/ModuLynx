import { useState } from "react";

import {
  Box,
  Cpu,
  Database,
  GraduationCap,
  Search,
  Settings,
  ShieldCheck,
  Wrench,
} from "lucide-react";

import ExplorePage from "./pages/ExplorePage";

const navigation = [
  {
    name: "EXPLORE",
    icon: Box,
  },
  {
    name: "COMPATIBILITY",
    icon: ShieldCheck,
  },
  {
    name: "UPGRADE",
    icon: Wrench,
  },
  {
    name: "LEARN",
    icon: GraduationCap,
  },
  {
    name: "SCANNER",
    icon: Cpu,
  },
];

export default function App() {

  const [active, setActive] =
    useState("EXPLORE");

  return (

    <div className="app-shell">

      {/* TOP NAVIGATION */}

      <header className="topbar">

        <div className="brand">

          <div className="brand-mark">
            M
          </div>

          <div>

            <strong>
              MODULYNX
            </strong>

            <span>
              EXPLORE. MATCH. UPGRADE.
            </span>

          </div>

        </div>


        <nav>

          {navigation.map(
            (item) => {

              const Icon =
                item.icon;

              return (

                <button
                  key={item.name}
                  className={
                    active === item.name
                      ? "nav-item active"
                      : "nav-item"
                  }
                  onClick={() =>
                    setActive(
                      item.name
                    )
                  }
                >

                  <Icon size={15} />

                  {item.name}

                </button>

              );

            }
          )}

        </nav>


        <div className="system-tools">

          <div className="system-online">

            <span />

            SYSTEM ONLINE

          </div>


          <button>
            <Search size={17} />
          </button>

          <button>
            <Database size={17} />
          </button>

          <button>
            <Settings size={17} />
          </button>

        </div>

      </header>


      {/* MAIN */}

      {active === "EXPLORE" ? (

        <ExplorePage />

      ) : (

        <div className="coming-soon">

          <Cpu size={45} />

          <h2>
            {active}
          </h2>

          <p>
            This ModuLynx module is
            under development.
          </p>

        </div>

      )}

    </div>
  );
}