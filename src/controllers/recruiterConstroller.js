const ApiResponseCandidate = require('../models/apiResponseCandidate');
const { startInterval, stopInterval } = require('../server');

// Function to fetch and store API response
fetchCandidateList = async (req, res, next) => {
    try {
        const responses = await ApiResponseCandidate.find();
        res.json(responses);
    } catch (error) {
        next(error);
    }
}

exports.startApiCalls = (req, res, next) => {
    try {
      const intervalTime = req.body.intervalTime || 5000; // Default to 5 seconds if not provided
      startInterval(intervalTime);
      res.json({ message: 'API call interval started' });
    } catch (error) {
      next(error);
    }
};
  
exports.stopApiCalls = (req, res, next) => {
    try {
      stopInterval();
      res.json({ message: 'API call interval stopped' });
    } catch (error) {
      next(error);
    }
};

module.exports = { fetchCandidateList }