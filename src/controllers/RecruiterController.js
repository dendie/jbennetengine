const ApiResponse = require('../models/apiResponseCandidate');
const ApiResponseCandidate = require('../models/apiResponseCandidate');

// Function to fetch and store API response
fetchCandidateList = async (req, res, next) => {
    try {
      const responses = await ApiResponseCandidate.find();
      res.json(responses);
    } catch (error) {
      next(error);
    }
}

fetchJobsList = async (req, res, next) => {
  try {
    const response = await ApiResponseJobs.find();
    res.json(response)
  } catch (error) {
    next(error)
  }
}

module.exports = { fetchCandidateList }