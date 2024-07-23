const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all users
router.get('/', (req, res) => {
  let sql = 'SELECT * FROM users';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Get user by ID
router.get('/:id', (req, res) => {
  console.log('ID', req.params.id);
  let sql = `SELECT * FROM users WHERE user_id = ${req.params.id}`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result[0]);
  });
});

// Create a new user
router.post('/', (req, res) => {
  console.log('BODY', req.body)
  const { username, email, message } = req.body;
  let sql = `INSERT INTO users (username, email, message) VALUES ('${username}', '${email}', '${message}')`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.json({ message: 'User created', id: result.insertId });
  });
});

// Update user by ID
router.put('/:id', (req, res) => {
  const { username, email, message } = req.body;
  let sql = `UPDATE users SET username = '${username}', email = '${email}', message = '${message}'  WHERE user_id = ${req.params.id}`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.json({ message: 'User updated', id: req.params.id });
  });
});

// Delete user by ID
router.delete('/:id', (req, res) => {
  let sql = `DELETE FROM users WHERE user_id = ${req.params.id}`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.json({ message: 'User deleted', id: req.params.id });
  });
});

module.exports = router;