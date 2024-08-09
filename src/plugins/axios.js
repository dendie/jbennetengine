const axios = require('axios');
const CONST = require('../constant');

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: `${CONST.CONST_URL}`,
    headers: {
        'RF-Api-Key': CONST.CONST_API
    }
});

axios.interceptors.request.use(config => {
    config.headers['RF-Api-Key'] = `${CONST.CONST_URL}`;
    return config;
});

module.exports = { axios }