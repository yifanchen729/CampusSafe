const express = require("express");
const app = express();

// For local port testing
const cors = require("cors");

const mongoose = require("mongoose");
require("dotenv").config();

const getCrimeData = require("./getCrimeData");

const crimeData = require('./models/crimeData');
const updateTime = require('./models/updateTime');

app.use(express.json());
app.use(cors());

// This simply gets the crimeData and return it
app.get("/api/crimes", async (req, res) => {
  try {
    const crimes = await crimeData.find({});

    res.status(200).json({ crimes });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Failed to get crime data"
    });
  }
});

// This simply gets the updateTime and return it
app.get("/api/updateTime", async (req, res) => {
  try {
    const data = await updateTime.findOne({});

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

// This uses the updateTime data to check if need to update
// The update time gap is currently: 1 hour
async function shouldUpdate() {
  const data = await updateTime.findOne({});

  // No update time yet means we need to update
  if (!data) {
    return true;
  }

  const updatedAt = new Date(data.updatedAt);
  const now = new Date();

  const oneHour = 60 * 60 * 1000;

  return now - updatedAt >= oneHour;
}

// This is the actual update function
async function updateCrimeData() {
  try {
    if (!(await shouldUpdate())) {
      console.log("Crime data is already up to date");
      return;
    }

    console.log("Updating crime data...");

    await getCrimeData();

    // Update the last update time
    await updateTime.findOneAndUpdate(
      {},
      {
        updatedAt: new Date().toISOString()
      },
      {
        upsert: true
      }
    );

    // We'll change this part next

  } catch (error) {
    console.log("Failed to update crime data:", error);
  }
}

// Sets up the server
const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Connected to MongoDB");

    app.listen(port, console.log(`Server is listening on port ${port}...`))

    // Update immediately when server starts
    updateCrimeData();

    // Update every 1 hours
    setInterval(
      updateCrimeData,
      60 * 60 * 1000
    );

  } catch (error) {
    console.log(error)
  }
}

start();