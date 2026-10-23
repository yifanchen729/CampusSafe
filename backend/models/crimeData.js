const mongoose = require('mongoose');

// This is the data structure for crime data
const CrimeDataSchema = new mongoose.Schema({
  id: {
    type: String
  },
  dateReported: {
    type: String
  },
  crimeType: {
    type: String
  },
  category: {
    type: String
  },
  disposition: {
    type: String
  },
  occurredStart: {
    type: String
  },
  occurredEnd: {
    type: String
  },
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

module.exports = mongoose.model('crimeData', CrimeDataSchema);