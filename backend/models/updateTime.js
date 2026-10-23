const mongoose = require('mongoose');

// This stores when the crime data was last updated
const UpdateTimeSchema = new mongoose.Schema({
  updatedAt: {
    type: String
  }
});

module.exports = mongoose.model('updateTime', UpdateTimeSchema);