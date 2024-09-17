const express = require('express');
const router = express.Router();
const { storeLogin, setEmailTo } = require('../controllers/AdminController');

// router.post('/', async (req, res) => {
//     const response = await fetchLogin(req)
//     res.send(response)
// })

router.post('/register', async (req, res) => {
    const response = await storeLogin(req)
    res.send(response)
})

router.post('/set-email', async (req, res) => {
    const response = await setEmailTo(req)
    res.send(response)
})

module.exports = router