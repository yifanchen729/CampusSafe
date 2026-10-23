import { useState } from "react";
import CrimeMap from "./CrimeMap/CrimeMap";
import crimes from "./data/crimeData.json";
import "./App.css";

import type { Filters } from "./types/crime";

import NavBar from "./NavBar/NavBar";
import Hero from "./Hero/Hero";
import Table from "./Table/Table";
import Chart from "./Chart/Chart";
import About from "./About/About";

export default function App() {

  // Stores which crime categories are enabled
  const [filters, setFilters] = useState<Filters>({
    sexualCrime: false,
    violence: true,
    theft: true,
    property: true,
    alcoholDrugs: true,
    publicOrder: true,
    other: true
  });

  return (
    <>
      <NavBar />
      <main>
        <Hero />

        {/* The Map section */}
        <section className="section" id="map">
          <div className="heading">
            <p className="label">
              INTERACTIVE MAP
            </p>
            <h2>
              Crime Map
            </h2>
            <p>
              Zoom, Drag and select a marker to view information about a
              reported incident.
            </p>
          </div>

          <div className="mapCard">
            <CrimeMap filters={filters} />
          </div>
        </section>

        <Table
          crimes={crimes}
          filters={filters}
          setFilters={setFilters}
        />

        <Chart crimes={crimes} filters={filters} />

        <About />
      </main >

      <footer>
        <strong>CampusSafe</strong>
        <span>Built as an independent student project.</span>
      </footer>
    </>
  )
}