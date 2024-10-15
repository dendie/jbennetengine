const ApiResponseCandidate = require('../models/apiResponseCandidate');
const ApiResponseJob = require('../models/apiResponseJob');
const ApiResponseClient = require('../models/apiResponseClient');
const ApiResponseStage = require('../models/apiResponseStage');
const ApiResponseLocation = require('../models/apiResponseLocations');
const { callLongLatAPI } = require('../utils/jobsCall')

async function getJobList(request, isRecruiter) {
    try {
        let response
        if (!isRecruiter) {
            let query = {};
            // Example query: Find all documents
            if (request && Object.keys(request).length >= 2) {
                query.$and = [
                    { name: request.jobs },
                    // { is_open: (request.isOpen && request.isOpen.toLowerCase() === 'true') ? true : false },
                    request.isOpen && request.isOpen.toLowerCase() === 'true' ? { is_open: true } : { job_stages: 'Hired' },
                    { 'company.name': request.client }
                ]
            } else {
                // Add name condition only if the name parameter is not null or undefined
                if (request && request && request.jobs) {
                    query.name = request.jobs
                }
                if (request && request && request.isOpen) {
                    // query.is_open = request.isOpen.toLowerCase() === 'true' ? true : false
                    request.isOpen.toLowerCase() === 'true' ? query.is_open = true : query.job_stages = 'Hired'
                }
                if (request && request && request.client) {
                    query['company.name']= request.client
                }
            }
            response = await ApiResponseJob.find(query);
        } else {
            response = await ApiResponseJob.find(request);
        }
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
        const query = {};
    
        // Add name condition only if the name parameter is not null or undefined
        if (request.client_id) {
          query.client_id = request.client_id;
        }
        
        // Example query: Find all documents
        const response = ApiResponseClient.find(query);
        const client = (await response).map(item => {
            return item
        })
        return client
    } catch ( error ) {
        console.error('Error retrieving users:', error);
    }
}

async function getCandidateWithStatus(query) {
    try {
        let locQuery = {};
    
        // Add name condition only if the name parameter is not null or undefined
        if (query) {
            locQuery = { 
                ...query,
                $or: [ { job_stages: 'Hired' }, { 'jobs.stage_name': 'Hired' } ]
            };
        } else {
            locQuery = {
                $or: [ { job_stages: 'Hired' }, { 'jobs.stage_name': 'Hired' } ]
            };
        }
        // Example query: Find all documents
        const response = await ApiResponseCandidate.find(locQuery);
        let candidates = []
        for (res of response) {
            let job_name = res.jobs.filter((job) => {
                return job.stage_name === 'Hired'
            })
            candidates.push({
                start_date: res.join_date,
                name: res.name,
                job_name: job_name.title
            })
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
    
        if (request && Object.keys(request).length >= 2) {
            query.$and = [
                { 'jobs.name': request.jobs },
                // { 'jobs.is_open': request.isOpen && request.isOpen.toLowerCase() === 'true' ? true : false },
                request.isOpen && request.isOpen.toLowerCase() === 'true' ? { 'jobs.is_open': true } : { job_stages: 'Hired' },
                { 'jobs.client_company_name': request.client }
            ]
        } else {
            // Add name condition only if the name parameter is not null or undefined
            if (request && request.jobs && request.jobs !== '') {
                
                query['jobs.name'] = request.jobs
            }
            if (request && request.isOpen && request.isOpen !== '') {
                // query['jobs.is_open'] = request.isOpen.toLowerCase() === 'true' ? true : false
                request.isOpen.toLowerCase() === 'true' ? query['jobs.is_open'] = true : query['job_stages'] = 'Hired'
            }
            if (request && request.client && request.client !== '') {
                query['jobs.client_company_name'] = request.client
            }
        }

        // Example query: Find all documents
        const response = await ApiResponseStage.find();
        const stages = [ ...response[0].stages, 'false' ]
        let totalCandidate = 0
        let totalHired = 0
        let totalRecruited = 0
        let totalShortList = 0
        for (const stage of stages) {
            let candidateResponse = await getCandidate({ ...query, $or: [ { job_stages: stage.toString() }, { 'jobs.stage_name': stage.toString() } ] })
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
    try {
        let query = {};
        if (request && Object.keys(request).length >= 2) {
            query.$and = [
                { 'jobs.name': request.jobs },
                // { 'jobs.is_open': request.isOpen && request.isOpen.toLowerCase() === 'true' ? true : false },
                request.isOpen && request.isOpen.toLowerCase() === 'true' ? { 'jobs.is_open': true } : { job_stages: 'Hired' },
                { 'jobs.client_company_name': request.client }
            ]
        } else {
            // Add name condition only if the name parameter is not null or undefined
            if (request && request.jobs && request.jobs !== '') {
                query['jobs.name'] = request.jobs
            }
            if (request && request.isOpen && request.isOpen !== '') {
                // query['jobs.is_open'] = request.isOpen.toLowerCase() === 'true' ? true : false
                request.isOpen && request.isOpen.toLowerCase() === 'true' ? { 'jobs.is_open': true } : { job_stages: 'Hired' }
            }
            if (request && request.client && request.client !== '') {
                query['jobs.client_company_name'] = request.client
            }
        }

        const totalJobs = await getJobList(request, false)
        responseData.candidateHired = await getCandidateWithStatus(query)
        responseData.totalJobs = totalJobs.length
        const candidate = await getCandidate(query)
        responseData.locations = await getLocations(candidate, totalJobs)
        const counter = await getCounterList(request)
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