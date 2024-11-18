const express = require('express');
const router = express.Router();
const User = require('../models/apiResponseUserJB');
const SendEmail = require('../models/apiResponseSendEmail');
// const sendEmail = require('../controllers/SendEmailController');
const sendMail = require('../controllers/SendEmailGoogleController');

// Create (POST) - Add a new user
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    const sentEmail = await SendEmail.find();
    const parametersEmail = await { ...req.body, sendTo: sentEmail[0].email };
    // const isSent = await sendEmail(parametersEmail);
    const isSent = await sendMail(parametersEmail);
    console.log('Email is sent: ' + isSent);
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Read (GET) - Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Read (GET) - Get a single user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update (PUT) - Update a user by ID
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete (DELETE) - Delete a user by ID
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router