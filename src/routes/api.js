const express = require('express');
const router = express.Router();
const { getClientList, getCounterList, getDataRecruiter, getJobList } = require('../controllers/ApiController')
const { cronJobs } = require('../controllers/CronController')

router.get('/cron-job', async (req, res) => {
    const response = await cronJobs()
    res.json(response)
})

router.get('/recruiter', async (req, res) => {
    const response = await getDataRecruiter(req.query)
    res.json(response)
})

router.get('/job-list', async (req, res) => {
    res.json(await getJobList())
})

router.get('/client-list', async (req, res) => {
    res.json(await getClientList())
})

router.get('/counter-list', async (req, res) => {
    res.json(await getCounterList(req.query))
})

module.exports = router;