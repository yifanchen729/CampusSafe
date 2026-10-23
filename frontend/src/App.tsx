import { useEffect, useState } from "react";
import CrimeMap from "./CrimeMap/CrimeMap";
import "./App.css";

import type { Crime, Filters } from "./types/crime";

import NavBar from "./NavBar/NavBar";
import Hero from "./Hero/Hero";
import Table from "./Table/Table";
import Chart from "./Chart/Chart";
import About from "./About/About";

export default function App() {

  const [crimes, setCrimes] = useState<Crime[]>([]);

  useEffect(() => {
    async function getCrimes() {
      try {
        const response = await fetch("http://localhost:5000/api/crimes");
        console.log("successfully interacted with API")

        const data = await response.json();

        setCrimes(data.crimes);
      } catch (error) {
        console.log("Failed to get crime data:", error);
      }
    }

    getCrimes();
  }, []);

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

  // I attempt to have two filter sections that change the filter
  // Appearantly only the first one works, so have two filters
  const [chartFilters, setChartFilters] = useState<Filters>({
    sexualCrime: true,
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
            <CrimeMap 
              crimes={crimes}
              filters={filters}
            />
          </div>
        </section>

        <Table
          crimes={crimes}
          filters={filters}
          setFilters={setFilters}
        />

        <Chart
          crimes={crimes}
          filters={chartFilters}
          setFilters={setChartFilters} />

        <About />
      </main >

      <footer>
        <strong>CampusSafe</strong>
        <span>Built as an independent student project.</span>
      </footer>
    </>
  )
}