const mongoose = require('mongoose');

const apiResponseStagesSchema = new mongoose.Schema({
  stages: {
    type: Array,
    required: true
  }
});

const ApiResponse = mongoose.model('stages', apiResponseStagesSchema);

module.exports = ApiResponse;