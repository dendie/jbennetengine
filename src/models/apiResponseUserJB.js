const mongoose = require('mongoose');
// Define the User schema and model
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    message: { type: String, required: true }
  }, { timestamps: true }); // Add timestamps for createdAt and updatedAt
  
  const ApiResponse = mongoose.model('UserJB', userSchema);

  module.exports = ApiResponse;