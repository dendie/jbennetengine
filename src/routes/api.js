const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { getClientList, getCounterList, getDataRecruiter, getJobList } = require('../controllers/ApiController')
const { cronJobs } = require('../controllers/CronController')
const { callLongLatAPI } = require('../utils/jobsCall')
const cron = require('node-cron');
const Redis = require('redis')
const redisClient = Redis.createClient()
const DEFAULT_EXPARATIONS = 3600
redisClient.connect()
redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

const task = cron.schedule('*/1 * * * *', async () => {
    console.log('Running Cron Job');
    const response = await getDataRecruiter()
    redisClient.set('recruiter', JSON.stringify(response))
    console.log('Cron Job completed');
});
task.start();

router.get('/cron-job', async (req, res) => {
    task.stop();
    const response = await cronJobs()
    res.json(response)
})

router.get('/recruiter', async (req, res) => {
    // const response = await getDataRecruiter(req.query)
    // res.json(response)
    if (Object.keys(req.query).length > 0) {
        const response = await getDataRecruiter(req.query)
        res.json(response)
    } else {
        const recruiter = await redisClient.get('recruiter');
        if (recruiter != null) {
            return res.json(JSON.parse(recruiter))
        }
    //     // } else {
    //     //     console.log('Cache Miss')
    //     //     const response = await getDataRecruiter(req.query)
    //     //     redisClient.set('recruiter', JSON.stringify(response))
    //     //     res.json(response)
    //     // }
    }
})

router.get('/job-list', authenticateToken, async (req, res) => {
    res.json(await getJobList(req.query, false))
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