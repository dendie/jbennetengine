const axios = require('axios');
const CONST = require('../constant');

const ApiResponseJob = require('../models/apiResponseJob');
const ApiResponseCandidate = require('../models/apiResponseCandidate');
const ApiResponseUser = require('../models/apiResponseUser');
const ApiResponseClient = require('../models/apiResponseClient');
const ApiResponseStage = require('../models/apiResponseStage');
const ApiResponseLocation = require('../models/apiResponseLocations');

// const apiUrl = ; // Replace with the actual API URL
const headers = {
    'RF-Api-Key': CONST.CONST_API
}

const callClientAPI = async (limit = 100, page = 1, accumulatedData = []) => {
    const params = {
        items_per_page: limit,
        current_page: page,
        include_count: true
    }
    try {
        const response = await axios.get(`${CONST.CONST_URL}/external/client/list`, { headers: headers, params: params })
        const clients = response.data.data || []
        accumulatedData = accumulatedData.concat(clients);
        for (const client of clients) {
            let formData = { client_id: client.id, name: client.name, locations: client.location.city, closed_jobs: client.closed_jobs, open_jobs: client.open_jobs }
            const apiResponse = new ApiResponseClient(formData);
            await apiResponse.save();
        }
        if (clients.length === limit) {
            // There might be more data, fetch the next page
            return await callClientAPI(limit, page + 1, accumulatedData);
        } else {
            // No more data, return the accumulated data
            return accumulatedData;
        }
    } catch (error) {
        console.error('Error fetching API:', error.message);
    }
}

const callCandidateAPI = async (limit = 100, page = 1, accumulatedData = []) => {
    const params = {
        items_per_page: limit,
        current_page: page,
        include_count: true,
        include_description: true
    }
    try {
        const response = await axios.get(`${CONST.CONST_URL}/external/candidate/list`, { headers: headers, params: params })
        const candidates = response.data.data || []
        accumulatedData = accumulatedData.concat(candidates);
        console.log('PAGE', page)
        for (const candidate of candidates) {
            let user_id = candidate.rating.added_by.id || (candidate.jobs.length > 0 && candidate.jobs[0].added_to_job_by.id)
            let formData = {
                candidate_id: candidate.id,
                name: candidate.name,
                jobs: candidate.jobs,
                phone_number: candidate.phone_number[0],
                prospect_id: candidate.prospect_id,
                prospect_type_id: candidate.prospect_type_id,
                job_stages: candidate.jobs.length > 0 && candidate.jobs[0].stage_name,
                job_title: candidate.jobs.length > 0 && candidate.jobs[0].title,
                locations: candidate.location,
                user_id: user_id,
                join_date: null
            }
            const apiResponse = new ApiResponseCandidate(formData);
            await apiResponse.save();
        }
        if (candidates.length === limit) {
            // There might be more data, fetch the next page
            return await callCandidateAPI(limit, page + 1, accumulatedData);
        } else {
            // No more data, return the accumulated data
            return accumulatedData;
        }
    } catch (error) {
        console.error('Error fetching API:', error.message);
    }
}

const callJobsAPI = async (limit = 100, page = 1, isOpen = 0, accumulatedData = []) => {
    const params = {
        items_per_page: limit,
        current_page: page,
        include_count: true,
        include_description: true,
        only_open: isOpen
    }
    try {
        const response = await axios.get(`${CONST.CONST_URL}/external/job/list`, { headers: headers, params: params })
        const jobs = response.data.data || []
        accumulatedData = accumulatedData.concat(jobs);
        for (const job of jobs) {
            let formData = { job_id: job.id, name: job.name, is_open: job.is_open, locations: job.locations, company: job.company }
            const apiResponse = new ApiResponseJob(formData);
            await apiResponse.save();
        }
        if (jobs.length === limit) {
            // There might be more data, fetch the next page
            return await callJobsAPI(limit, page + 1, isOpen, accumulatedData);
        } else if (jobs.length < limit && isOpen === 0 ) {
            return await callJobsAPI(limit, page + 1, 1, accumulatedData);
        } else {
            // No more data, return the accumulated data
            return accumulatedData;
        }
    } catch (error) {
        console.error('Error fetching API:', error.message);
    }
}

const callUserAPI = async () => {
    try {
        const response = await axios.get(`${CONST.CONST_URL}/external/user/list`, { headers: headers })
        const users = response.data.data || []
        for (const user of users) {
            let formData = { user_id: user.id, name: user.name }
            const apiResponse = new ApiResponseUser(formData);
            await apiResponse.save();
            const candidates = await ApiResponseCandidate.find({ 'jobs.stage_name': 'Hired' });
            for (const candidate of candidates) {
                await callPlacementAPI(100, 1, user.id, candidate.jobs[0].job_id)
            }
        }
    } catch (error) {
        console.error('Error fetching API:', error.message);
    }
}

const callPlacementAPI = async (limit = 100, page = 1, userID, jobID) => {
    const paramsPlacement = {
        job_id: jobID,
        detailed: 1,
        user_id: userID,
        items_per_page: limit,
        current_page: page,
        include_count: true
    }

    try {
        responsePlacement = await axios.get(`${CONST.CONST_URL}/external/job/placement-record/list`, { headers: headers, params: paramsPlacement })
        const placements = responsePlacement.data.data || []
        for (const placement of placements) {
            const result = await ApiResponseCandidate.updateOne({ 'jobs.job_id': placement.job.id, 'jobs.stage_name': 'Hired' }, { $set: { join_date: placement.job_start_date }})
            console.log(`Updated ${result.modifiedCount} document(s)`);
        }
        return placements
    } catch (error) {
        console.error('Error fetching API:', error.message);
    }
}

const callStageAPI = async () => {

    try {
       const responseStage = await axios.get(`${CONST.CONST_URL}/external/job/stage_names`, { headers: headers })
       const apiResponse = new ApiResponseStage({ 'stages': responseStage.data.data })
       await apiResponse.save();
       return apiResponse
    } catch (error) {
        console.log('Error fetch API:', error.message)
    }
}

const callLocationAPI = async () => {
    try {
        const responseLocation = await axios.get(`${CONST.CONST_URL}/external/location/list`, { headers: headers })
        const locations = responseLocation.data.data || []
        for (const location of locations) {
            if (location.city !== null || location.city !== '') {
                let formData = {
                    location_id: location.id,
                    city: location.city,
                    country: location.country,
                    state: location.state,
                    latitude: location.latitude,
                    longitude: location.longitude
                }
                const apiResponse = new ApiResponseLocation(formData);
                await apiResponse.save();
                await callLongLatAPI(location.city)
            }
        }
    } catch (error) {
        console.error('Error fetching API:', error.message);
    }
}

const callLongLatAPI = async (city) => {
    try {
        const responseLocation = await axios.get(`https://api.positionstack.com/v1/forward?access_key=6fcc5edd7c2c22ecc10a70e4db5a9e3f&query=${city}&country=US`)
        const locations = responseLocation.data.data || []
        if (locations.length > 0) {
            const result = await ApiResponseLocation.updateOne({ 'city': city }, { $set: { latitude: locations[0].latitude, longitude: locations[0].longitude }})
            console.log(`Updated ${result.modifiedCount} document(s)`);
        }
        console.log('Location not found');
        return locations;
    } catch (error) {
        console.error('Error fetching API:', error.message);
    }
}

module.exports = { callClientAPI, callJobsAPI, callCandidateAPI, callUserAPI, callPlacementAPI, callStageAPI, callLocationAPI, callLongLatAPI }