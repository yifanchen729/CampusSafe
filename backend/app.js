const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const getCrimeData = require("./getCrimeData");

const app = express();

require("dotenv").config();

app.use(express.json());
app.use(cors());

// Get crime data
app.get("/api/crimes", (req, res) => {
  try {
    const filePath = path.join(
      __dirname,
      "data",
      "crimeData.json"
    );

    const crimes = JSON.parse(
      fs.readFileSync(filePath, "utf8")
    );

    res.status(200).json({ crimes });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Failed to get crime data"
    });
  }
});

// Get last update time
app.get("/api/updateTime", (req, res) => {
  try {
    const timePath = path.join(
      __dirname,
      "data",
      "updateTime.json"
    );

    const data = JSON.parse(
      fs.readFileSync(timePath, "utf8")
    );

    res.status(200).json({
      updatedAt: data.updatedAt
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Failed to get update time"
    });
  }
});

function shouldUpdate() {
  const timePath = path.join(
    __dirname,
    "data",
    "updateTime.json"
  );

  const data = JSON.parse(
    fs.readFileSync(timePath, "utf8")
  );

  const updatedAt = new Date(data.updatedAt);
  const now = new Date();

  const oneHour = 60 * 60 * 1000;

  return now - updatedAt >= oneHour;
}

async function updateCrimeData() {
  try {

    // Don't update if data is less than 1 hour old
    if (!shouldUpdate()) {
      console.log("Crime data is already up to date");
      return;
    }

    console.log("Updating crime data...");

    await getCrimeData();

    // Update the last updated time
    const timePath = path.join(
      __dirname,
      "data",
      "updateTime.json"
    );

    fs.writeFileSync(
      timePath,
      JSON.stringify(
        {
          updatedAt: new Date().toISOString()
        },
        null,
        2
      )
    );

    console.log("Crime data updated");

  } catch (error) {
    console.log("Failed to update crime data:", error);
  }
}

// Update immediately when server starts
updateCrimeData();

// Update every 1 hours
setInterval(
  updateCrimeData,
  60 * 60 * 1000
);

// Sets up the server
const port = 5000;
const start = async () => {
  try {
    app.listen(port, console.log(`Server is listening on port ${port}...`))
  } catch (error) {
    console.log(error)
  }
}

start();