const app = require('./index');
const PORT = process.env.PORT || 3000;
// const intervalTime = 5000;
const callApi = require('./utils/recruiterCall');

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// exports.startInterval = (intervalTime) => {
//     if (apiInterval) {
//       console.log('Interval already running');
//       return;
//     }
//     apiInterval = setInterval(callApi, intervalTime);
//     console.log('API call interval started');
// };
  
// exports.stopInterval = () => {
//     if (!apiInterval) {
//       console.log('No interval running');
//       return;
//     }
//     clearInterval(apiInterval);
//     apiInterval = null;
//     console.log('API call interval stopped');
// };
  
  // Export the start and stop functions for use in other modules
//   module.exports = { startInterval, stopInterval };