const axios = require('axios');
const CONST = require('../constant');
const ApiResponseCandidate = require('../models/apiResponseCandidate');
const ApiResponseLocation = require('../models/apiResponseLocations');
const ApiResponseJob = require('../models/apiResponseJob');

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

const updateLocationsCandidate = async () => {
    try {
        const dataCandidate = await ApiResponseCandidate.find();
        for (const candidate of dataCandidate) {
            if (candidate.locations[0].city !== null) {
                try {
                    const responseLocations = await ApiResponseLocation.find({ city: candidate.locations[0].city })
                    let newObject = {
                        ...candidate.locations[0],
                        latitude: responseLocations.length > 0 && responseLocations[0].latitude,
                        longitude: responseLocations.length > 0 && responseLocations[0].longitude
                    }
                    const result = await candidate.updateOne(
                        { $set: { locations: newObject } }
                    );
                    console.log(`${candidate.name} have been updated successfully.` + result);
                } catch (error) {
                    console.error('Error updating candidate:', error);
                }
            }
        }
        console.log('All users have been updated successfully.');
    } catch (error) {
        console.error('Error updating users:', error);
    }
}

const updateLocationsJobs = async () => {
    try {
        const dataJobs = await ApiResponseJob.find();
        for (const job of dataJobs) {
            if (job.locations !== null) {
                try {
                    const splitLocation = job.locations[0].name.split(', ');
                    const responseLocations = await ApiResponseLocation.find({ city: splitLocation[0] });
                    let newObject = {
                        city: splitLocation[0],
                        state: splitLocation[1],
                        latitude: responseLocations.length > 0 && responseLocations[0].latitude,
                        longitude: responseLocations.length > 0 && responseLocations[0].longitude
                    }
                    const result = await job.updateOne(
                        { $set: { locations: newObject } }
                    );
                    console.log(`${job.name} have been updated successfully.` + result);
                } catch (error) {
                    console.error('Error updating jobs:', error);
                }
            }
        }
        console.log('All jobs have been updated successfully.');
    } catch (error) {
        console.error('Error updating jobs:', error);
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

module.exports = { callCandidateAPI, updateLocationsCandidate, updateLocationsJobs }