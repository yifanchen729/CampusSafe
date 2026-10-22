import "./About.css"

export default function About() {
  return (
    <section className="aboutSection" id="about">
      <div>
        <p className="label">ABOUT THE PROJECT</p>
        <h2>Making public safety data easier to understand.</h2>
      </div>

      <p>
        CampusSafe organizes publicly available crime-log information into an
        interactive map and searchable incident dataset. Locations shown on the
        map are approximate and depend on the location information available in
        the original report.
      </p>
    </section>
  );
}
