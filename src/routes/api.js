const express = require('express');
const app = express();
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
//     // await cronJobs()
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

router.get('/cron-job', async (req, res) => {
    // task.stop();
    const response = await cronJobs()
    res.json(response)
})

router.get('/recruiter', authenticateToken, async (req, res) => {
    // const clientName = await getClientName(req);
    // if (Object.keys(req.query).length > 0 && clientName !== 'jbennett') {
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
    const clientName = req.clientName;
    const response = await getDataRecruiter(req, clientName);
    res.json(response)
})

router.get('/job-list', authenticateToken, async (req, res) => {
    res.json(await getJobList(req, false))
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

async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
  
    await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        if (user.client.length > 0) {
            // Extract clientName and set as a global variable
            const client = user.client[0];
            const nameMatch = client.match(/name:\s*'([^']+)'/);
    
            const clientName = nameMatch ? nameMatch[1] : null;
            if (clientName) {
                req.clientName = clientName; // For request-specific access
                global.clientName = clientName; // Optional: Set as truly global variable
            }
        } else {
            req.clientName = 'jbennett'; // For request-specific access
            global.clientName = 'jbennett'; // Optional: Set as truly global variable
        }
    })

    next();
}

module.exports = router;