import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

import L from "leaflet";
import "leaflet.markercluster";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css"

import { categories } from "../types/crime";
import type { Crime, Filters } from "../types/crime";
;
import "./CrimeMap.css";

type CrimeMapProps = {
  crimes: Crime[];
  filters: Filters;
};

export default function CrimeMap({
  crimes,
  filters
}: CrimeMapProps) {

  // Creates a different marker depending on the crime type
  function getCrimeIcon(category: string) {
    // Name the container
    const markerClass = `marker-color-${category}`;

    // Return the element which specific class
    return L.divIcon({
      className: "custom-marker",

      html: `
      <div class="marker-pin ${markerClass}">
        <div class="marker-center"></div>
      </div>
    `,

      // Size but since we use div, it does not influence
      iconSize: [20, 20],
      // Bottom of the pin represents the actual coordinate
      iconAnchor: [10, 20],
      // Position popup above the marker
      popupAnchor: [2, -20]
    });
  }

  return (
    // Sets the size of the map
    // Configs the map
    <>
      <MapContainer
        center={[34.414, -119.856]}
        zoom={15}
        minZoom={10}
        maxZoom={18}
        style={{
          height: "80vh",
          width: "100%"
        }}
      >

        {/* Gets the free map */}
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* For each category, make a cluster */}
        {categories
          .filter((category) => filters[category])
          .map((category) => {
            const clusterClass = `cluster-color-${category}`;

            return (
              <MarkerClusterGroup
                maxClusterRadius={2}
                spiderfyOnMaxZoom={true}
                key={category}
                // disableClusteringAtZoom={18}
                removeOutsideVisibleBounds={true}

                iconCreateFunction={(cluster: L.MarkerCluster) => {
                  const count = cluster.getChildCount();

                  return L.divIcon({
                    html:
                      `
                      <div class="cluster-icon ${clusterClass}">
                        ${count}
                      </div>
                    `,
                    className: "custom-cluster",
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                  });
                }}
              >
                {crimes
                  .filter(
                    (crime) =>
                      crime.latitude !== null &&
                      crime.longitude !== null &&
                      crime.category === category
                  )
                  .map((crime) => (
                    <Marker
                      key={crime.id}
                      position={[crime.latitude!, crime.longitude!]}
                      icon={getCrimeIcon(crime.category)}
                    >
                      <Popup maxWidth={3000}>
                        <div className="popupContainer">
                          <div className="popupVerticalContainer">
                            <div className="popupItem">
                              <div className="header">
                                Crime type:
                              </div>
                              {crime.crimeType.split("\n").map((line, index) => (
                                <div
                                  className="detail"
                                  key={index}
                                >
                                  &bull; {line}
                                </div>
                              ))}
                            </div>
                            <div className="popupItem">
                              <div className="header">
                                Occured at:
                              </div>
                              <div className="detail">
                                {crime.occurredStart}
                              </div>
                            </div>
                          </div>
                          <div className="popupVerticalContainer">
                            <div className="popupItem">
                              <div className="header">
                                Location:
                              </div>
                              <div className="detail">
                                {crime.location}
                              </div>
                            </div>
                            <div className="popupItem">
                              <div className="header">
                                End at:
                              </div>
                              <div className="detail">
                                {crime.occurredEnd || "N/A"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
              </MarkerClusterGroup>
            );
          })}
      </MapContainer >
    </>
  );
}