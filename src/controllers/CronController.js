const ApiResponseCandidate = require('../models/apiResponseCandidate');
const ApiResponseJob = require('../models/apiResponseJob');
const ApiResponseClient = require('../models/apiResponseClient');
const ApiResponseUser = require('../models/apiResponseUser');
const ApiResponsePlacement = require('../models/apiResponsePlacement');
const { callCandidateAPI, callJobsAPI, callClientAPI, callStageAPI, callUserAPI } = require('../utils/jobsCall')

async function cronJobs () {
    try {
        const resultCandidate = await ApiResponseCandidate.deleteMany({});
        console.log(`Cleared ${resultCandidate.deletedCount} document(s)`);

        const resultJob = await ApiResponseJob.deleteMany({});
        console.log(`Cleared ${resultJob.deletedCount} document(s)`);

        const resultClient = await ApiResponseClient.deleteMany({});
        console.log(`Cleared ${resultClient.deletedCount} document(s)`);

        const resultUser = await ApiResponseUser.deleteMany({});
        console.log(`Cleared ${resultUser.deletedCount} document(s)`);

        const resultPlacement = await ApiResponsePlacement.deleteMany({});
        console.log(`Cleared ${resultPlacement.deletedCount} document(s)`);

        await callJobsAPI()
        await callClientAPI()
        await callCandidateAPI()
        await callUserAPI()
        await callStageAPI()
        return { message: 'SUCCESS' }
    } catch (err) {
        console.error('Error cron job:', err);
    }
}

module.exports = { cronJobs }