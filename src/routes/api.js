const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { getClientList, getCounterList, getDataRecruiter, getJobList } = require('../controllers/ApiController')
const { cronJobs } = require('../controllers/CronController')
const { callLongLatAPI } = require('../utils/jobsCall')
const cron = require('node-cron');
const Redis = require('redis')
const redisClient = Redis.createClient()
redisClient.connect()
redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

// const task = cron.schedule('*/30 * * * *', async () => {
//     console.log('Running Redis store');
//     const response = await getDataRecruiter()
//     redisClient.set('recruiter', JSON.stringify(response))
//     console.log('Redis store completed');
// });


// cron.schedule('*/15 * * * *', async () => {
//     const recruiter = await redisClient.get('recruiter');
//     if (recruiter != null) {
//         task.stop();
//     }
// });

// cron.schedule('0 0 */2 * *', async () => {
//     console.log('Running Cron Job');
//     await cronJobs()
//     const recruiter = await redisClient.get('recruiter');
//     if (recruiter != null) {
//         task.start();
//     } else {
//         task.del('recruiter');
//     }
//     console.log('Cron Job completed');
// });

// router.get('/redis-start', async (req, res) => {
//     task.start();
//     res.json({ message: 'Cron Job started' })
// })

// router.get('/redis-stop', async (req, res) => {
//     task.stop();
//     res.json({ message: 'Cron Job stop' })
// })

// router.get('/cron-job', async (req, res) => {
//     task.stop();
//     const response = await cronJobs()
//     res.json(response)
// })

router.get('/recruiter', authenticateToken, async (req, res) => {
    // if (Object.keys(req.query).length > 0) {
    //     const response = await getDataRecruiter(req)
    //     redisClient.set('recruiter', JSON.stringify(response))
    //     res.json(response)
    // } else {
    //     const recruiter = await redisClient.get('recruiter');
    //     if (recruiter != null) {
    //         return res.json(JSON.parse(recruiter))
    //     } else {
    //         const response = await getDataRecruiter(req)
    //         res.json(response)
    //     }
    // }
    const response = await getDataRecruiter(req)
    res.json(response)
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
      if (err) return res.sendStatus(403)
      req.user = user
      next()
    })
}

module.exports = router;