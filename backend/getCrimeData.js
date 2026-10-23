const axios = require("axios");
const { parse } = require("csv-parse/sync");

require("dotenv").config();

const crimeData = require("./models/crimeData");
const locationCache = require("./models/locationCache");

// Map keywords into categories
function categorizeCrime(crimeType) {
  const crime = crimeType.toLowerCase();

  if (
    crime.includes("rape") ||
    crime.includes("fondling") ||
    crime.includes("sexual") ||
    crime.includes("stalking")
  ) {
    return "sexualCrime";
  }

  if (
    crime.includes("assault") ||
    crime.includes("battery") ||
    crime.includes("violence") ||
    crime.includes("strangulation") ||
    crime.includes("kidnapping")
  ) {
    return "violence";
  }

  if (
    crime.includes("theft") ||
    crime.includes("stolen") ||
    crime.includes("burglary")
  ) {
    return "theft";
  }

  if (
    crime.includes("trespassing") ||
    crime.includes("arson") ||
    crime.includes("vandalism")
  ) {
    return "property";
  }

  if (
    crime.includes("alcohol") ||
    crime.includes("intoxication") ||
    crime.includes("liquor") ||
    crime.includes("drug") ||
    crime.includes("controlled substance") ||
    crime.includes("dui") ||
    crime.includes("under the influence")
  ) {
    return "alcoholDrugs";
  }

  if (
    crime.includes("noise") ||
    crime.includes("disturbing the peace") ||
    crime.includes("camping")
  ) {
    return "publicOrder";
  }

  return "other";
}

// Takes in a row of raw data then normalize it into data structure
function normalizeCrime(row) {

  // Split up occurred and end
  const [occurredStart, occurredEnd] =
    row["Date and Time Occurred"]
      .trim()
      .split(" - ");

  // For category data (more readable)
  const crimeType =
    row["Crime Classification/\nNature of Fire"].trim();

  return {
    id: crypto.randomUUID(),
    dateReported: row["Date Reported\nto UCPD"].trim(),
    crimeType,
    // Make them into category to make it easier to map
    category: categorizeCrime(crimeType),
    disposition: row["Disposition"].trim(),
    occurredStart: occurredStart.trim(),
    occurredEnd: occurredEnd?.trim() || null,
    location: row["General Location"].trim()
  };
}

// The function that uses Geoapify to get the lat and long
// Uses cache in a file to prevent repetitively calling API
// Since the limit is 5 API calls/s, for safety, I only did 4 API calls/s
async function geocode(location, cache) {

  console.log("geocoding...");

  location = location
    .replace(/ Bike Racks$/i, "")
    .replace(/ Parking Garage$/i, "")
    .replace(/ Parking Lot$/i, "")
    .trim();

  // If cache
  // Check our temporary in-memory cache first
  if (cache[location]) {
    return cache[location];
  }

  // Query and API calling
  const query = `${location}, UCSB, Goleta, California, USA`;

  const { data } = await axios.get(
    "https://api.geoapify.com/v1/geocode/search",
    {
      params: {
        text: query,
        limit: 1,
        apiKey: process.env.GEOAPIFY_API_KEY
      }
    }
  );

  const latitude = data.features[0]?.geometry.coordinates[1];
  const longitude = data.features[0]?.geometry.coordinates[0];

  const coordinates =
    data.features.length > 0 &&
      !(
        latitude === 34.4358295 &&
        longitude === -119.8276389
      )
      ? {
        latitude: latitude,
        longitude: longitude
      }
      : {
        latitude: null,
        longitude: null
      };

  // For checking

  console.log("Below is adding new location lat and long to cache");
  console.log(JSON.stringify(coordinates, null, 2));

  // Add to cache array
  cache[location] = coordinates;

  // Also permanently save it in MongoDB
  await locationCache.create({
    location,
    latitude: coordinates.latitude,
    longitude: coordinates.longitude
  });

  // Wait for .25s
  await new Promise(resolve => setTimeout(resolve, 250));

  return coordinates;
}

// The main function that takes in the specific google sheet
// then convert into normalized data into a file
async function getCrimeData() {

  const cachedLocations =
    await locationCache.find({});

  // Create a cache for every single update
  // LocationCache was stored an object of 3 values so have to reformat to access like object[key]
  const cache = {};

  for (const item of cachedLocations) {
    cache[item.location] = {
      latitude: item.latitude,
      longitude: item.longitude
    };
  }

  console.log(
    `Loaded ${cachedLocations.length} cached locations`
  );

  const url =
    "https://docs.google.com/spreadsheets/d/1ogmWCkY532nrMmhXJ1_noyisct1NslHiIg9qvJXUPlY/export?format=csv&gid=1931872013";

  // Get the sheet as csv
  const { data: csv } = await axios.get(url);

  // Get the csv as rows in certain conditions
  const rows = parse(csv, {
    columns: true,
    skip_empty_lines: true,
    from_line: 5
  });

  // Remove the date data that contains invalid date
  // Ex:
  // "original: NO CRIMES REPORTED 9/15/2026
  // updated: see below for Crimes Reported 9/15/2026"	
  const isDate = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
  let result = rows.filter((row) => {
    const dateData = row["Date Reported\nto UCPD"].trim();
    return isDate.test(dateData);
  })

  // Remove the crime data that contains the word "updated" to normalize data
  // Ex:
  // "original: Domestic Violence
  // Violate Court Order to Prevent Domestic Violence
  // Clery: Aggravated Assault
  // Updated: Domestic Violence (Clery: Dating Violence)
  // Violate Court Order to Prevent Domestic Violence
  // Clery: Aggravated Assault"
  result = result.filter((row) => {
    const crimeType = row["Crime Classification/\nNature of Fire"].trim().toLowerCase();
    return !crimeType.includes("updated");
  })

  // Remove the dispoition data that contains "updated"
  // Ex: 
  // "original: Report Filed 
  // updated: Arrest, 1" 
  result = result.filter((row) => {
    const dispositionType = row["Disposition"].trim().toLowerCase();
    return !dispositionType.includes("updated");
  })

  // Take the data and convert into the data structure wanted
  result = result.map(normalizeCrime);

  // For every row after normalized data, use Geoapify to convert
  // string locaiton into lat and long for mapping
  for (const row of result) {
    const coordinates = await geocode(row.location, cache);

    row.latitude = coordinates.latitude;
    row.longitude = coordinates.longitude;
  }

  await crimeData.deleteMany({});
  await crimeData.insertMany(result);

  console.log(
    `Saved ${result.length} crimes to MongoDB`
  );
}

module.exports = getCrimeData;