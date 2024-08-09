const express = require('express');
const router = express.Router();
const axios = require('axios');

const { fetchCandidateList, startApiCalls, stopApiCalls } = require('../controllers/RecruiterController')
const getTotalProspectCount = require('../utils/recruiterCall')
const { callCandidateAPI, callJobsAPI, callUserAPI, callPlacementAPI, callClientAPI, callStageAPI } = require('../utils/jobsCall')

const CONST = require('../constant');
const { getCandidateWithStatus } = require('../controllers/ApiController');
const apiUrl = `${CONST.CONST_URL}/external/candidate/list`; // Replace with the actual API URL
const headers = {
    'RF-Api-Key': CONST.CONST_API
}
let index = 1

let candidateList = [];
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
                items_per_page: '100',
                current_page: '1',
                include_count: true
            }
        })
    .then((result) => {
        console.log(result.data)
        rawData = result.data.data
        let listJobs = []
        rawData.filter((value) => {
            if (value.open_jobs.length > 0) {
                return listJobs.push({
                    id: value.id,
                    name: value.name,
                    open_jobs: value.open_jobs,
                    count_jobs: value.closed_jobs.length,
                    jobs: value.closed_jobs.filter((value) => {
                        if (value.candidates_hired === 1 || value.candidates_submitted === 1) {
                            return value
                        }
                        return
                    })
                })
            }
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

router.get('/clientList', async (req, res) => {
    const response = await callClientAPI()
    res.json(response)
})
router.get('/jobList', async (req, res) => {
    const response = await callJobsAPI()
    res.json(response)
});

router.get('/candidateList', async (req, res) => {
    const response = await callCandidateAPI()
    res.json(response)
});

router.get('/userList', async (req, res) => {
    const response = await callUserAPI()
    res.json(response)
})

router.get('/placementList', async (req, res) => {
    const response = await callPlacementAPI(100, 1, 53369,119)
    res.json(response)
})

router.get('/stagesList', async (req, res) => {
    const response = await callStageAPI()
    res.json(response)
})

router.get('/test', async (req, res) => {
    const response = await getCandidateWithStatus('Hired')
    res.json(response)
})

// router.get('/test', async (req, res) => {

//     let totalCount = 0;
//     let page = 1;
//     let isFound = false
//     const params = {
//         items_per_page: '100',
//         current_page: page,
//         include_count: true,
//         include_description: true
//     }
//     let limit = 100
//     let totalItem = 42474
    
//     while (((page - 1) * limit) < totalItem) {
//         console.log('PAGE', page)
//         console.log(((page - 1) * limit) < totalItem)
//         const response = await axios.get(apiUrl, { headers: headers, params: params });
//         const candidates = response.data.data;


//         // totalCount += candidates.length;
//         totalItem = response.data.total_items;

//         // Process candidates in batches (replace with your processing logic)
//         for (const candidate of candidates) {
//         // ... your candidate processing logic here ...
//             candidateList.push(candidate)
//             // if (candidate.name === 'Kim Hudson') {
//             //     isFound = true
//             //     // break;
//             // }
//         }

//         page++;
//     }
//     // console.log('candidate list', candidateList)
//     res.json(candidateList)

//     // getTotalProspectCount()
//     // .then((count) => { console.log(`Total Prospect Count: ${count}`) })
//     // .catch(error => console.error(error));
// })

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