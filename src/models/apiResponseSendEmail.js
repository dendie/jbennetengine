const mongoose = require('mongoose');

const apiResponseEmail = new mongoose.Schema({
    // user: {
    //     type: String,
    //     required: true
    // },
    email: {
        type: Array,
        required: true
    }
});

const ApiResponse = mongoose.model('email', apiResponseEmail);

module.exports = ApiResponse;