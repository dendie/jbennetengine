const express = require('express');
const router = express.Router();
const { fetchLogin, storeLogin } = require('../controllers/LoginController');

router.post('/', async (req, res) => {
    const response = await fetchLogin(req)
    res.json(response)
})

router.post('/register', async (req, res) => {
    const response = await storeLogin(req)
    res.json(response)
})

module.exports = router