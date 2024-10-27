const ApiResponseCandidate = require('../models/apiResponseCandidate');
const ApiResponseJob = require('../models/apiResponseJob');
const ApiResponseClient = require('../models/apiResponseClient');
const ApiResponseStage = require('../models/apiResponseStage');
const ApiResponseLocation = require('../models/apiResponseLocations');
const { callLongLatAPI } = require('../utils/jobsCall');
const jwt = require('jsonwebtoken');

async function getJobList(request, isRecruiter) {
    try {
        let response
        let query = {};
        let listQuery = {}
        if (request && request.jobs && request.jobs !== '') {
            listQuery['name'] = request.jobs
        }
        if (request && request.isOpen && request.isOpen !== '') {
            // query['jobs.is_open'] = request.isOpen.toLowerCase() === 'true' ? true : false
            listQuery['is_open'] = request.isOpen.toLowerCase() === 'open' || request.isOpen.toLowerCase() === "true"
        }
        if (request && request.client && request.client !== '') {
            listQuery['company.name'] = request.client
        }
        if (request && Object.keys(request).length >= 2) {
            query.$and = [
                listQuery
            ]
        } else {
            // Add name condition only if the name parameter is not null or undefined
            query = listQuery 
        }

        response = await ApiResponseJob.find(query);
        const jobs = response.map(item => {
            return { id: item.job_id, name: item.name, locations: item.locations[0], is_open: item.is_open }
        })
        return jobs
    } catch ( error ) {
        console.error('Error retrieving users:', error);
    }
}

async function getClientList(request) {
    try {
        let query = {};
        const page = parseInt(request.page) || 1; // Default to page 1
        const limit = parseInt(request.limit) || 10; // Default to 10 items per page
        const searchQuery = request.search || '';
        const skip = (page - 1) * limit; // Calculate the number of documents to skip
        const searchCondition = searchQuery ? { name: { $regex: searchQuery.trim(), $options: 'i' } } : {};
    
        // Add name condition only if the name parameter is not null or undefined
        if (request.client_id) {
          query.client_id = request.client_id;
        }

        const clone = JSON.parse(JSON.stringify(searchCondition));

        query = {
            ...query,
            ...clone
        }

        // Example query: Find all documents
        const response = await ApiResponseClient.find(query).skip(skip).limit(limit);
        const client = (await response).map(item => {
            return { id: item.client_id, name: item.name }
        })
        // Get the total count of items in the collection
        const totalItems = client.length;

        return {
            page,
            limit,
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            client
        }
    } catch ( error ) {
        console.error('Error retrieving users:', error);
    }
}

async function getCandidateWithStatus(query, req) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        const decoded = jwt.decode(token);
        // let locQuery = {};
    
        // if (query) {
        //     locQuery = { 
        //         ...query,
        //         $or: [ { job_stages: 'Hired' }, { 'jobs.stage_name': 'Hired' } ]
        //     };
        // } else {
        //     locQuery = {
        //         $or: [ { job_stages: 'Hired' }, { 'jobs.stage_name': 'Hired' } ]
        //     };
        // }
        // Example query: Find all documents
        const response = await ApiResponseCandidate.find(query);
        let candidates = []
        for (res of response) {
            let filteredJobs = res.jobs.filter((job) => {
                return job.stage_name === 'Hired'
            })

            if (filteredJobs.length > 0 && ((decoded === filteredJobs[0].client_company_name) || ((decoded === 'jbennett') ?? true)) ) {
                let filterDate = filteredJobs.length > 0 ? filteredJobs[0].stage_moved.split('T')[0] : null;
                candidates.push({
                    start_date: res.join_date || filterDate,
                    name: res.name,
                    job_name: filteredJobs[0].title
                })
            } else if (filteredJobs.length > 0) {
                candidates.push({
                    start_date: res.join_date || filterDate,
                    name: res.name,
                    job_name: filteredJobs[0].title
                })
            }
        }
        return candidates
    } catch ( error ) {
        console.error('Error retrieving users:', error);
    }
}

async function getCandidate (query) {
    const response = ApiResponseCandidate.find(query);
    return response
}

async function getCounterList(request) {
    try {
        let query = {};
        let listQuery = {}
        if (request && request.jobs && request.jobs !== '') {
            listQuery['jobs.name'] = request.jobs
        }
        if (request && request.isOpen && request.isOpen !== '') {
            // query['jobs.is_open'] = request.isOpen.toLowerCase() === 'true' ? true : false
            request.isOpen.toLowerCase() === 'true' || request.isOpen.toLowerCase() === 'open' ? listQuery['jobs.is_open'] = true : listQuery['job_stages'] = 'Hired'
        }
        if (request && request.client && request.client !== '') {
            listQuery['jobs.client_company_name'] = request.client
        }
        if (request && Object.keys(request).length >= 2) {
            query.$and = [
                listQuery
            ]
        } else {
            // Add name condition only if the name parameter is not null or undefined
           query = listQuery 
        }

        // Example query: Find all documents
        const response = await ApiResponseStage.find();
        const stages = [ ...response[0].stages, 'false' ]
        let totalCandidate = 0
        let totalHired = 0
        let totalRecruited = 0
        let totalShortList = 0
        for (const stage of stages) {
            let candidateResponse = await getCandidate({ $and: [ { $and: [{ ...query, 'jobs.stage_name': stage.toString() } ] } ] });
            if (stage === 'Hired') {
                totalHired = candidateResponse.length           
            } else if (stage === 'Client Interview' ||  stage === 'Offer' || stage === 'Shortlist Interview') {
                totalShortList += candidateResponse.length
            } else if (stage === 'Recruited' || stage === 'Recruiting Call') {
                totalRecruited += candidateResponse.length
            } else {
                totalCandidate += candidateResponse.length
            }
        }
        totalShortList += totalHired
        totalRecruited += totalShortList
        totalCandidate += totalRecruited
        const objectCount = {
            totalCandidate: totalCandidate,
            totalHired: totalHired,
            totalRecruited: totalRecruited,
            totalShortList: totalShortList
        }
        return objectCount
    } catch ( error ) {
        console.error('Error retrieving users:', error);
    }
}

async function getLocations (dataCandidate, dataJobs) {
    let locations = []
    let setArray = new Set(locations.map(loc => loc.city))
    if (dataCandidate) {
        for (const candidate of dataCandidate) {
            const newObject = {
                city: candidate.locations[0].city,
                state: candidate.locations[0].state,
                latitude: candidate.locations[0].latitude,
                longitude: candidate.locations[0].longitude
            }
            insertUniqueObject(locations, newObject, setArray)
        }
    }
    if (dataJobs) {
        for (const job of dataJobs) {
            const newObject = {
                city: job.locations.city,
                state: job.locations.state,
                latitude: job.locations.latitude,
                longitude: job.locations.longitude
            }
            insertUniqueObject(locations, newObject, setArray)
        }
    }

    // Function to insert object if id is not already present
    function insertUniqueObject(array, obj, setArray) {
        if (!setArray.has(obj.city)) {
            array.push(obj);
            setArray.add(obj); // Add the new city to the set
        } else {
            console.log(`Object with city ${obj.city} already exists.`);
        }
    }

    locations = Array.from(setArray)
    return locations
    // if (((dataCandidate.length / counterLocation) > 0.8 || (dataJobs.length / counterLocation) > 0.8)) {
    //     return locations
    // }
    // const fullLocations = getLongLat(locations);
    // return fullLocations
}

async function getLongLat (locationsData) {
    let locations = []
    let setArray = new Set(locations)
    for (const loc of locationsData) {
        try {
            if (loc.city !== '' || loc.city !== 0) {
                const response = await callLongLatAPI(loc.city)
                const newObject = {
                    ...loc,
                    latitude: (response || response.length > 0) ? response[0].latitude : '0',
                    longitude: (response || response.length > 0) ? response[0].longitude : '0'
                }
                setArray.add(newObject)
            }
        } catch (error) {
            console.error(`Error retrieving long/lat for ${loc.city}:`, error);
        }
    }
    locations = Array.from(setArray)
    return locations
}

async function getDataRecruiter (request) {
    let responseData = {}
    let requestData = request.query;
    try {
        let query = {};
        let listQuery = {};
        if (requestData && requestData.jobs && requestData.jobs !== '') {
            listQuery['jobs.name'] = requestData.jobs
        }
        if (requestData && requestData.isOpen && requestData.isOpen !== '') {
            // query['jobs.is_open'] = requestData.isOpen.toLowerCase() === 'true' ? true : false
            requestData.isOpen.toLowerCase() === 'true' || requestData.isOpen.toLowerCase() === 'open' ? listQuery['jobs.is_open'] = true : listQuery['job_stages'] = 'Hired'
        }
        if (requestData && requestData.client && requestData.client !== '') {
            listQuery['jobs.client_company_name'] = requestData.client
        }
        if (requestData && Object.keys(requestData).length >= 2) {
            query.$and = [
                listQuery
            ]
        } else {
            // Add name condition only if the name parameter is not null or undefined
           query = listQuery 
        }
        const totalJobs = await getJobList(requestData, false)
        responseData.candidateHired = await getCandidateWithStatus(query, request)
        responseData.totalJobs = totalJobs.length
        const candidate = await getCandidate(query)
        responseData.locations = await getLocations(candidate, totalJobs)
        const counter = await getCounterList(requestData)
        responseData = {
            ...responseData,
            ...counter
        }
        return responseData
    } catch ( error ) {
        console.error('Error retrieving users:', error);
    }
}

module.exports = { getCandidateWithStatus, getClientList, getCounterList, getJobList, getDataRecruiter }