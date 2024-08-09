const axios = require('axios');
const CONST = require('../constant');
const ApiResponseCandidate = require('../models/apiResponseCandidate');

const apiUrl = `${CONST.CONST_URL}/external/candidate/list`; // Replace with the actual API URL
const headers = {
    'RF-Api-Key': CONST.CONST_API
}

let index = 1
let candidateList

const callCandidateAPI = async () => {
    const params = {
        items_per_page: '100',
        current_page: index || '1',
        include_count: true,
        include_description: true
    }
    try {
        const response = await axios.get(apiUrl, { headers: headers, params: params })
        const apiResponse = new ApiResponseCandidate({ data: response.data.data, size: response.data.total_items });
        await apiResponse.save();
        index++;
    } catch (error) {
        console.error('Error fetching API:', error.message);
    }
}

exports.getTotalProspectCount = async (limit = 100) => {
    let totalCount = 0;
    let page = 1;

    while (true) {
        const response = await axios.get(apiUrl, { headers: headers, params: params });

        const candidates = response.data;

        if (candidates.length === 0) {
            break;
        }

        totalCount += candidates.length;

        // Process candidates in batches (replace with your processing logic)
        for (const candidate of candidates) {
        // ... your candidate processing logic here ...
            candidateList.push(candidate)
        }

        page++;
    }
    console.log(candidateList)
    return totalCount;
}

module.exports = callCandidateAPI