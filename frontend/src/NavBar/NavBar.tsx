import { smoothScrollTo } from "../utils/smoothScrollTo";

import "./NavBar.css";

export default function NavBar() {
  return (
    <div className="navbar">
      <div className="navContent">
        <h2 className="logo">CampusSafe</h2>

        <nav>
          <a
            href="#map"
            onClick={(e) => {
              e.preventDefault();
              smoothScrollTo("map");
            }}
          >
            Map
          </a>

          <a
            href="#incidents"
            onClick={(e) => {
              e.preventDefault();
              smoothScrollTo("incidents");
            }}
          >
            Incidents
          </a>

          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              smoothScrollTo("about");
            }}
          >
            About
          </a>
        </nav>
      </div>
    </div>
  );
}
