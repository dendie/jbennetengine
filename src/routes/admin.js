const express = require('express');
const router = express.Router();
const { getListUsers, storeLogin, deleteUser, getEmailTo, setEmailTo, updateEmailTo } = require('../controllers/AdminController');

// Get all users (protected route)
router.get('/', async (req, res) => {
    const response = await getListUsers()
    res.send(response)
});

// Delete a user (protected route)
router.delete('/:id', async (req, res) => {
    const response = await deleteUser(req)
    res.send(response)
});

router.post('/register', async (req, res) => {
    const response = await storeLogin(req)
    res.send(response)
})

router.get('/get-email', async (req, res) => {
    const response = await getEmailTo()
    res.send(response)
})

router.post('/set-email', async (req, res) => {
    const response = await setEmailTo(req)
    res.send(response)
})

router.put('/update-email/:id', async (req, res) => {
    const response = await updateEmailTo(req)
    res.send(response)
})

module.exports = router