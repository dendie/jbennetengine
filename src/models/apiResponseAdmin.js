const mongoose = require('mongoose');

const apiResponseAdmin = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    client: {
        type: Array,
        required: true
    },
    token: {
        type: String,
        required: false
    }
});

const ApiResponse = mongoose.model('admin', apiResponseAdmin);

module.exports = ApiResponse;