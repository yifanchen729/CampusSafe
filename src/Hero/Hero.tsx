import "./Hero.css"

export default function Hero() {
  return (
    <div className="hero">
      <span className="eyebrow">UCSB & Isla Vista</span>

      <h1>
        Campus safety information,
        <br />
        easier to explore
      </h1>

      <p>
        Explore publicly reported incidents around UCSB and
        Isla Vista through an interactive crime map.
      </p>

      <a className="primaryButton" href="#map">
        Explore the map
      </a>
    </div>
  )
}