const mongoose = require('mongoose');

const apiResponseClientSchema = new mongoose.Schema({
  client_id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  locations: {
    type: String,
    required: false
  },
  closedJobs: {
    type: Array,
    required: false
  },
  openJobs: {
    type: Array,
    required: false
  }
});

const ApiResponse = mongoose.model('clientsAll', apiResponseClientSchema);

module.exports = ApiResponse;