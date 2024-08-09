const mongoose = require('mongoose');

const apiResponseUserSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  }
});

const ApiResponse = mongoose.model('users', apiResponseUserSchema);

module.exports = ApiResponse;