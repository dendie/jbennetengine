const express = require('express');
const router = express.Router();
const axios = require('axios');
const CONST = require('../constant');
const { fetchCandidateList, startApiCalls, stopApiCalls } = require('../controllers/recruiterConstroller')
// const { axios } = require('../plugins/axios');

// Get all users
router.get('/external/client/get', async (req, res) => {
    await axios.get(`${CONST.CONST_URL}/external/client/get?id=1`, { headers: { 'RF-Api-Key': CONST.CONST_API } })
    .then((result) => {
      console.log('RESPONSE', result.data)
      res.json(result.data);
    })
    .catch((errult) => {
        console.log(err)
    })
});

router.get('/external/client/activity-type/list', async (req, res) => {
    await axios.get(`${CONST.CONST_URL}/external/client/activity-type/list`, { headers: { 'RF-Api-Key': CONST.CONST_API } })
    .then((result) => {
      res.json(result.data);
    })
    .catch((errult) => {
        console.log(err)
    })
});

router.get('/external/client/list', async (req, res) => {
    let rawData = null
    let objectClient = null
    await axios.get(`${CONST.CONST_URL}/external/client/list`, 
        { 
            headers: {
                'RF-Api-Key': CONST.CONST_API
            },
            params: {
                items_per_page: '1',
                current_page: '1',
                include_count: true
            }
        })
    .then((result) => {
        rawData = result.data.data
        let listJobs = []
        rawData.map((value) => {
            return listJobs.push({
                id: value.id,
                name: value.name,
                count_jobs: value.closed_jobs.length,
                jobs: value.closed_jobs.filter((value) => {
                    if (value.candidates_hired === 1 || value.candidates_submitted === 1) {
                        return value
                    }
                    return
                })
            })
        })
        res.json(listJobs);
    })
    .catch((err) => {
        console.log(err)
    })
});

router.get('/external/client/status/list', async (req, res) => {
    await axios.get(`${CONST.CONST_URL}/external/client/status/list`, 
        { 
            headers: {
                'RF-Api-Key': CONST.CONST_API
            }
        })
        .then((result) => {
            res.json(result.data)
        })
        .catch((err) => {
            console.log(err)
        })
});

router.get('/external/campaign/list', async (req, res) => {
    await axios.get(`${CONST.CONST_URL}/external/campaign/list`, 
        { 
            headers: {
                'RF-Api-Key': CONST.CONST_API
            },
            params: {
                include_count: true
            }
        })
        .then((result) => {
            res.json(result.data)
        })
        .catch((err) => {
            console.log(err)
        })
});

router.get('/external/job/list', async (req, res) => {
    await axios.get(`${CONST.CONST_URL}/external/job/list`, 
        { 
            headers: {
                'RF-Api-Key': CONST.CONST_API
            },
            params: {
                // items_per_page: '100',
                // current_page: '1',
                include_count: 'true',
                include_description: 'true'
            }
        })
        .then((result) => {
            console.log(result.data.data.length)
            rawData = result.data.data
            let listJobs = []
            rawData.map((value) => {
                return listJobs.push({
                    id: value.id,
                    name: value.name,
                    company: value.company
                })
            })
            res.json(listJobs);
        })
        .catch((err) => {
            console.log(err)
        })
});

router.get('/external/candidate/list', async (req, res) => {
    const result = fetchCandidateList(req, res)
    res.json(result)
});

router.get('/getAllCandidate', fetchCandidateList)

// router.get('/start', startApiCalls);
// router.get('/stop', stopApiCalls);

// router.get('/getAllCandidate', async (req, res, next) => {
//     let index = 1
//     try {
//         setInterval(async () => {
//             const response = await fetchCandidateList(index, res, next)
//             res.json(response)
//             index++
//         }, 5000)
//     } catch (error) {
//         console.error('Error fetching API', error);
//         res.status(500).send(error);
//     }
//     // let counter = 1
//     // for (let index = 1; index < 5; index++) {
//     //     setInterval(async () => {
//     //         try {
//     //             await axios.get(`http://localhost:3000/recruite/external/candidate/list`, {
//     //                 params: {
//     //                     page: `${index}`
//     //                 }
//     //             })
//     //         } catch (error) {
//     //             console.error('Error fetching API', error);
//     //             res.status(500).send(error);
//     //         }
//     //     }, 1000)
        
//     // }
//     // counter++
//     // } while (res.status(200));
// })

module.exports = router;