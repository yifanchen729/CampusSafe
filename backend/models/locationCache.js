const mongoose = require('mongoose');

// This stores the cached coordinates for each location
const LocationCacheSchema = new mongoose.Schema({
  location: {
    type: String
  },
  latitude: {
    type: Number
  },
  longitude: {
    type: Number
  }
});

module.exports = mongoose.model('locationCache', LocationCacheSchema);