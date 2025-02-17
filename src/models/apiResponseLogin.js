const mongoose = require('mongoose');

const apiResponseLoginSchema = new mongoose.Schema({
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
    role: {
        type: Object,
        required: true
    },
    token: {
        type: String,
        required: false
    }
});

const ApiResponse = mongoose.model('login', apiResponseLoginSchema);

module.exports = ApiResponse;