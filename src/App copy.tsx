import { useState } from "react";
import CrimeMap from "./CrimeMap";
import crimes from "./data/crimeData.json";
import "./App.css";

const categories = [
  "sexualCrime",
  "violence",
  "theft",
  "property",
  "alcoholDrugs",
  "publicOrder",
  "other"
] as const;

type Category = typeof categories[number];

function App() {
  // This makes an object that as category and boolean as eky value pairs
  const [filters, setFilters] = useState<Record<Category, boolean>>({
    sexualCrime: false,
    violence: true,
    theft: true,
    property: true,
    alcoholDrugs: true,
    publicOrder: true,
    other: true
  });

  // const filteredCrimes = crimes.filter(
  //   (crime) => filters[crime.category as Category]
  // );

  return (
    <div className="site">
      <header className="navbar">
        <div className="navContent">
          <h2 className="logo">CampusSafe</h2>

          <nav>
            <a href="#map">Map</a>
            <a href="#incidents">Incidents</a>
            <a href="#about">About</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="heroContent">
            <span className="eyebrow">UCSB & Isla Vista</span>

            <h1>
              Campus safety information,
              <br />
              easier to explore.
            </h1>

            <p>
              Explore publicly reported incidents around UCSB and
              Isla Vista through an interactive crime map.
            </p>

            <a className="primaryButton" href="#map">
              Explore the map
            </a>
          </div>
        </section>

        {/* <section className="section" id="map">
          <div className="sectionHeading">
            <div>
              <p className="sectionLabel">INTERACTIVE MAP</p>
              <h2>Crime Map</h2>
              <p>
                Select a marker to view information about a
                reported incident.
              </p>
            </div>
          </div>

          <div className="mapCard">
            <CrimeMap filters={filters} />
          </div>
        </section> */}

        <section className="section" id="incidents">
          <p className="sectionLabel">INCIDENT DATA</p>
          <h2>Explore Incidents</h2>
          <p>
            Filter reported incidents by category and browse
            the underlying data.
          </p>

          <div className="filterCard">
            <h3>Filters</h3>

            <div className="filters">
              {categories.map((category) => (
                <label className="filterOption" key={category}>
                  <input
                    type="checkbox"
                    checked={filters[category]}
                    onChange={() =>
                      setFilters({
                        ...filters,
                        [category]: !filters[category]
                      })
                    }
                  />

                  <span
                    className={`categoryDot marker-color-${category}`}
                  />

                  {formatCategory(category)}
                </label>
              ))}
            </div>
          </div>

          {/* <div className="tableCard">
            <table>
              <thead>
                <tr>
                  <th>Date Reported</th>
                  <th>Crime</th>
                  <th>Location</th>
                  <th>Occurred</th>
                  <th>Disposition</th>
                </tr>
              </thead>

              <tbody>
                {filteredCrimes.map((crime) => (
                  <tr key={crime.id}>
                    <td>{crime.dateReported}</td>
                    <td>{crime.crimeType}</td>
                    <td>{crime.location}</td>
                    <td>{crime.occurredStart}</td>
                    <td>{crime.disposition}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div> */}
        </section>

        <section className="aboutSection" id="about">
          <div>
            <p className="label">ABOUT THE PROJECT</p>
            <h2>Making public safety data easier to understand.</h2>
          </div>

          <p>
            CampusSafe organizes publicly available crime-log
            information into an interactive map and searchable
            incident dataset. Locations shown on the map are
            approximate and depend on the location information
            available in the original report.
          </p>
        </section>
      </main>

      <footer>
        <strong>CampusSafe</strong>
        <span>Built as an independent student project.</span>
      </footer>
    </div>
  );
}

function formatCategory(category: Category) {
  const labels: Record<Category, string> = {
    sexualCrime: "Sexual Crime",
    violence: "Violence",
    theft: "Theft",
    property: "Property",
    alcoholDrugs: "Alcohol / Drugs",
    publicOrder: "Public Order",
    other: "Other"
  };

  return labels[category];
}

export default App;