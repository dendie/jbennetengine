const mongoose = require('mongoose');

const apiResponseLocationSchema = new mongoose.Schema({
    location_id: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    latitude: {
        type: String,
        required: false
    },
    longitude: {
        type: String,
        required: false
    }
});

const ApiResponse = mongoose.model('locations', apiResponseLocationSchema);

module.exports = ApiResponse;