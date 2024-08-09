const mongoose = require('mongoose');

const apiResponseJobSchema = new mongoose.Schema({
  job_id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  is_open: {
    type: Boolean,
    required: true
  },
  locations: {
    type: Array,
    required: false
  },
  company: {
    type: Array,
    required: false
  },
  fetchedAt: {
    type: Date,
    default: Date.now
  }
});

const ApiResponse = mongoose.model('jobs', apiResponseJobSchema);

module.exports = ApiResponse;