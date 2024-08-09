const mongoose = require('mongoose');

const apiResponseCandidateSchema = new mongoose.Schema({
  candidate_id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  jobs: {
    type: Array,
    required: false
  },
  phone_number: {
    type: String,
    required: false
  },
  status: {
    type: Object,
    required: false
  },
  prospect_id: {
    type: String,
    required: false
  },
  prospect_type_id: {
    type: String,
    required: false
  },
  job_stages: {
    type: String,
    required: false
  },
  job_title: {
    type: String,
    required: false
  },
  locations: {
    type: Array,
    required: false
  },
  user_id: {
    type: String,
    required: false
  },
  join_date: {
    type: String,
    required: false
  },
  fetchedAt: {
    type: Date,
    default: Date.now
  }
});

const ApiResponse = mongoose.model('candidates', apiResponseCandidateSchema);

module.exports = ApiResponse;