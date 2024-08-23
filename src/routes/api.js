const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { getClientList, getCounterList, getDataRecruiter, getJobList } = require('../controllers/ApiController')
const { cronJobs } = require('../controllers/CronController')
const { callLongLatAPI } = require('../utils/jobsCall')

router.get('/cron-job', async (req, res) => {
    const response = await cronJobs()
    res.json(response)
})

router.get('/recruiter', async (req, res) => {
    const response = await getDataRecruiter(req.query)
    res.json(response)
})

router.get('/job-list', authenticateToken, async (req, res) => {
    res.json(await getJobList(req.query))
})

router.get('/client-list', authenticateToken, async (req, res) => {
    res.json(await getClientList(req.query))
})

router.get('/counter-list', async (req, res) => {
    res.json(await getCounterList(req.query))
})

router.get('/location-list', async (req, res) => {
    res.json(await callLongLatAPI(req.query.city))
})

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      console.log(err)
      if (err) return res.sendStatus(403)
      req.user = user
      next()
    })
}

module.exports = router;