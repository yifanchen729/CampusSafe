# CampusSafe

CampusSafe is an interactive web application for exploring reported crime incidents around UC Santa Barbara and Isla Vista. It transforms publicly available incident data into an interactive map, searchable table, and time-based visualization to make local safety information easier to explore.

## Live Demo

**Deployed at:** [CampusSafe](https://yifanchencs.com/)

## Features

- **Interactive Crime Map** — Visualizes reported incidents using Leaflet with categorized map markers.
- **Marker Clustering** — Groups nearby incidents to keep the map readable and allows users to expand clustered locations.
- **Crime Filtering** — Filter incidents by categories including violence, theft, property crime, alcohol/drugs, public order, and other incidents.
- **Incident Search** — Search reported incidents by crime type or location.
- **Date Filtering** — Explore incidents from the last day, 7 days, 14 days, 28 days, or all available records.
- **Incident Timeline** — Displays crime activity across 2-hour time intervals using a stacked Recharts visualization.
- **Automated Data Processing** — Backend periodically retrieves and processes the latest incident data.
- **Persistent Geocoding Cache** — Stores previously geocoded locations to avoid unnecessary external API requests.

## Tech Stack

### Frontend

- React
- TypeScript
- React Leaflet
- Leaflet MarkerCluster
- Recharts
- CSS

### Backend

- Node.js
- Express
- Axios
- csv-parse
- Geoapify Geocoding API

## Architecture

```text
Public Incident Data
        |
        v
Node.js / Express Backend
        |
        +--> Parse & normalize records
        |
        +--> Categorize incidents
        |
        +--> Geocode locations
        |       |
        |       +--> Persistent location cache
        |
        v
Processed Crime Data
        |
        v
REST API
        |
        v
React Frontend
   |       |       |
   v       v       v
  Map    Table    Chart
```

The backend periodically checks for updated incident data and stores the last successful update time. Previously geocoded locations are stored in a persistent cache so repeated locations do not require additional geocoding API requests.

## Project Impact

- Visualizes **350+ reported UCSB and Isla Vista incidents** through an interactive map, searchable table, and activity chart.
- Persistent location caching reduces potential geocoding API requests by approximately **66% across 400+ incident records**.

## Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/yifanchen729/CampusSafe.git
cd CampusSafe
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory:

```env
GEOAPIFY_API_KEY=your_api_key_here
```

Start the backend:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### 3. Set up the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Then open the local URL provided by Vite.

## API

### Get Crime Data

```http
GET /api/crimes
```

Returns the processed crime incident records used by the map, table, and chart.

Example:

```json
{
  "crimes": [
    {
      "id": "...",
      "dateReported": "10/22/2026 9:01 PM",
      "crimeType": "Theft",
      "category": "theft",
      "location": "UCSB",
      "occurredStart": "...",
      "occurredEnd": null,
      "disposition": "...",
      "latitude": 34.414,
      "longitude": -119.856
    }
  ]
}
```

### Get Last Update Time

```http
GET /api/timeUpdated
```

Returns the timestamp of the most recent successful data update.

```json
{
  "updatedAt": "2026-10-23T18:00:00.000Z"
}
```

## Data & Privacy

CampusSafe uses publicly available incident information and is an independent student project.

Some incidents may not contain precise location information. Incidents with unavailable coordinates are not displayed on the map, and sensitive incident categories with intentionally generalized location information are excluded from location-based visualization.

CampusSafe should not be treated as an emergency alert system or a replacement for official public safety resources.

## Disclaimer

CampusSafe is an independent student project and is not affiliated with, endorsed by, or operated by UC Santa Barbara or any law enforcement agency. Incident information may be delayed, incomplete, or subject to change. Always refer to official sources for emergency and public safety information.

## Author

**Yifan Chen**