const cron = require('node-cron');
const { cronJobs } = require('./controllers/CronController')
// Schedule a task to run every minute
cron.schedule('* 12,23 * * *', () => {
    cronJobs()
});