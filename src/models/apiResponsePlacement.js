const mongoose = require('mongoose');

const apiResponsePlacementSchema = new mongoose.Schema({
  placement_id: {
    type: Number,
    required: true
  },
  job_id: {
    type: Number,
    required: true
  },
  user_id: {
    type: Number,
    required: true
  },
  job_start_date: {
    type: String,
    required: true
  }
});

const ApiResponse = mongoose.model('placement', apiResponsePlacementSchema);

module.exports = ApiResponse;