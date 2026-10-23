import { useEffect, useState } from "react";

import { categories } from "../types/crime";
import type { Crime, Category, Filters } from "../types/crime";
import "./Table.css"

type TableProps = {
  crimes: Crime[];
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
};

export default function Table({
  crimes,
  filters,
  setFilters
}: TableProps) {

  const [location, setLocation] = useState("");
  const [crimeSearch, setCrimeSearch] = useState("");
  const [time, setTime] = useState("All");

  function formatCategory(category: Category) {
    const names: Record<Category, string> = {
      sexualCrime: "Sexual Crime",
      violence: "Violence",
      theft: "Theft",
      property: "Property",
      alcoholDrugs: "Alcohol & Drugs",
      publicOrder: "Public Order",
      other: "Other"
    };

    return names[category];
  }

  // const filteredCrimes = crimes.filter(
  //   (crime) => filters[crime.category as Category]
  // );

  // This gives the crime list based on the filter
  function applyFilters() {
    let result = [...crimes];

    // Filter based on category
    result = result.filter(
      (crime) => filters[crime.category as Category]
    );

    // Filter based on location if it contains the phrase
    if (location !== "") {
      result = result.filter((crime) =>
        crime.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Filter based on the crime type if it contains the phrase
    if (crimeSearch !== "") {
      result = result.filter((crime) =>
        crime.crimeType.toLowerCase().includes(crimeSearch.toLowerCase())
      );
    }

    // Time filter
    const now = new Date();

    if (time === "Last 1 Day") {
      // Create date object with current time
      const cutoff = new Date();
      // Change cutoff based on our need
      // This gets the day then subtract it by 1 then set the value
      cutoff.setDate(now.getDate() - 1);

      result = result.filter(
        // This convert our data format (Ex: "8/16/2026 5:44 PM") correctly
        // A better approach would be to reformat it but this works so far
        (crime) => new Date(crime.dateReported) >= cutoff
      );
    }

    if (time === "Last 7 Days") {
      const cutoff = new Date();
      cutoff.setDate(now.getDate() - 7);

      result = result.filter(
        (crime) => new Date(crime.dateReported) >= cutoff
      );
    }

    if (time === "Last 14 Days") {
      const cutoff = new Date();
      cutoff.setDate(now.getDate() - 14);

      result = result.filter(
        (crime) => new Date(crime.dateReported) >= cutoff
      );
    }

    if (time === "Last 28 Days") {
      const cutoff = new Date();
      cutoff.setDate(now.getDate() - 28);

      result = result.filter(
        (crime) => new Date(crime.dateReported) >= cutoff
      );
    }

    // Order newest → oldest
    // Uses built in .sort() function
    if (time === "Newest") {
      result.sort(
        (a, b) =>
          // Get the date then use .getTime() to convert into # in miliseconds
          // Sort work by if result is negative, then a goes before b, if pos, then b before a
          // If equal then no change
          new Date(b.dateReported).getTime() -
          new Date(a.dateReported).getTime()
      );
    }

    return result;
  }

  const filteredCrimes = applyFilters();

  const [updatedAt, setUpdatedAt] = useState("");

  useEffect(() => {
    async function getUpdatedTime() {
      try {
        const response = await fetch(
          // "http://localhost:5000/api/updateTime"
          "https://site--campussafe--99l47djp6wk8.code.run/api/updateTime"
        );

        const data = await response.json();

        setUpdatedAt(data.updatedAt);
      } catch (error) {
        console.log("Failed to get update time:", error);
      }
    }

    getUpdatedTime();
  }, []);

  return (
    <>
      <section className="section filterSection">
        <h3>Map & Table Filters: </h3>

        {categories
          // Did not include sexualCrime as a filter options
          // Due to location very generic, prob due to privacy issue
          .filter((category) => category !== "sexualCrime")
          .map((category) => (
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

              <div className={`marker-pin marker-color-${category} filter-pin`}>
                <div className="marker-center"></div>
              </div>

              <span>{formatCategory(category)}</span>
            </label>
          ))}
      </section>
      <section className="section legendSection">
        <h3>Legend:</h3>

        <div className="legendItem">
          <div className="marker-pin marker-color-other filter-pin">
            <div className="marker-center"></div>
          </div>

          <span>Individual incident</span>
        </div>

        <div className="legendItem">
          <div className="cluster-icon cluster-color-other filter-cluster">
            3
          </div>

          <span>
            Multiple similar incidents in this area {" "}
            <span className="legendHint">
              (click on icon to spiderfy/expand)
            </span>
          </span>
        </div>
      </section>

      <section className="section" id="incidents">
        {/* <p className="sectionLabel">INCIDENT DATA</p> */}
        <p className="label">INCIDENT DATA</p>
        <h2>Explore Incidents</h2>
        <p>
          Filter reported incidents by category above and browse
          the underlying data.
        </p>

        <div className="tableFilters">

          {/* Search by crime */}
          <input
            type="text"
            className="tableFilterInput"
            placeholder="Search crime..."
            value={crimeSearch}
            onChange={(e) => setCrimeSearch(e.target.value)}
          />

          {/* Search by location */}
          <input
            type="text"
            className="tableFilterInput"
            placeholder="Search location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          {/* Filter/order by date */}
          <select
            className="tableFilterSelect"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          >
            <option value="All">All Time</option>
            <option value="Newest">Newest</option>
            <option value="Last 1 Day">Last 1 Day</option>
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 14 Days">Last 14 Days</option>
            <option value="Last 28 Days">Last 28 Days</option>
          </select>
        </div>

        <div className="tableDetailrow">
          <div className="tableResultCount">
            {filteredCrimes.length} incidents shown
          </div>
          <div className="tableUpdateDate">
            Last update: {updatedAt
              ? new Date(updatedAt).toLocaleString()
              : "Loading..."}
          </div>
        </div>

        <div className="tableCard">
          <table>
            <thead>
              <tr>
                <th className="dateCol">Date Reported</th>
                <th className="crimeCol">Crime</th>
                <th className="locationCol">Location</th>
                <th className="occurredCol">Occurred</th>
                <th className="dispositionCol">Disposition</th>
              </tr>
            </thead>

            <tbody>
              {filteredCrimes.map((crime) => (
                <tr key={crime.id}>
                  <td>{crime.dateReported}</td>
                  <td>
                    {crime.crimeType.split("\n").map((line, index) => (
                      <div key={index}>
                        &bull; {line}
                      </div>
                    ))}
                  </td>
                  <td>{crime.location}</td>
                  <td>{crime.occurredStart}</td>
                  <td>{crime.disposition}</td>
                </tr>
              ))}

              {/* If no result in the filtered list, do this */}
              {!filteredCrimes.length && (
                <tr>
                  {/* Takes 5 column */}
                  <td colSpan={5} className="no-result">
                    No crime result match your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}