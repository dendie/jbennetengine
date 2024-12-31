const ApiResponseCandidate = require('../models/apiResponseCandidate');
const ApiResponseJob = require('../models/apiResponseJob');
const ApiResponseClient = require('../models/apiResponseClient');
const ApiResponseUser = require('../models/apiResponseUser');
const ApiResponsePlacement = require('../models/apiResponsePlacement');
const ApiResponseLocations = require('../models/apiResponseLocations');
const ApiResponseClientAll = require('../models/apiResponseClientAll');
const { callCandidateAPI, callJobsAPI, callClientAPI, callStageAPI, callUserAPI, callLocationAPI } = require('../utils/jobsCall')
const { updateLocationsCandidate, updateLocationsJobs } = require('../utils/recruiterCall')

async function cronJobs () {
    try {
        // const resultCandidate = await ApiResponseCandidate.deleteMany({});
        // console.log(`Cleared ${resultCandidate.deletedCount} document(s)`);

        // const resultJob = await ApiResponseJob.deleteMany({});
        // console.log(`Cleared ${resultJob.deletedCount} document(s)`);

        const resultClient = await ApiResponseClient.deleteMany({});
        console.log(`Cleared ${resultClient.deletedCount} document(s)`);
        
        const resultClientAll = await ApiResponseClientAll.deleteMany({});
        console.log(`Cleared ${resultClientAll.deletedCount} document(s)`);
        
        // const resultUser = await ApiResponseUser.deleteMany({});
        // console.log(`Cleared ${resultUser.deletedCount} document(s)`);

        // const resultPlacement = await ApiResponsePlacement.deleteMany({});
        // console.log(`Cleared ${resultPlacement.deletedCount} document(s)`);

        // const resultLocation = await ApiResponseLocations.deleteMany({});
        // console.log(`Cleared ${resultLocation.deletedCount} document(s)`);

        // await callJobsAPI()
        await callClientAPI()
        // await callCandidateAPI()
        // await callUserAPI()
        // await callStageAPI()
        // await callLocationAPI()
        // await updateLocationsCandidate()
        // await updateLocationsJobs()
        console.log('SUCCESS')
        return { message: 'SUCCESS' }
    } catch (err) {
        console.error('Error cron job:', err);
    }
}

module.exports = { cronJobs }