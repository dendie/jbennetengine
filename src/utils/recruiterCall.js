const axios = require('axios');
const CONST = require('../constant');
const ApiResponseCandidate = require('../models/apiResponseCandidate');

const apiUrl = `${CONST.CONST_URL}/external/candidate/list`; // Replace with the actual API URL
const headers = {
    'RF-Api-Key': CONST.CONST_API
}

let index = 1

const callAPI = async () => {
    const params = {
        items_per_page: '100',
        current_page: index || '1',
        include_count: 'true',
        include_description: 'true'
    }
    try {
        console.log('INDEX', index)
        const response = await axios.get(apiUrl, { headers: headers, params: params })
        const apiResponse = new ApiResponseCandidate({ data: response.data.data, size: response.data.total_items });
        await apiResponse.save();
        index++;
    } catch (error) {
        console.error('Error fetching API:', error.message);
    }
}

module.exports = callAPI