const mongoose = require('mongoose');

const apiResponseCandidateSchema = new mongoose.Schema({
  data: {
    type: Object,
    required: true
  },
  fetchedAt: {
    type: Date,
    default: Date.now
  }
});

const ApiResponse = mongoose.model('candidates', apiResponseCandidateSchema);

module.exports = ApiResponse;