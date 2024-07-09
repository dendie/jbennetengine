// index.js

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.DATABASE_PORT || '';
const host = process.env.MYSQL_HOST || '';
const user = process.env.MYSQL_USER || '';
const password = process.env.MYSQL_PASS || '';
const database = process.env.MYSQL_DATABASE || '';

const app = express();
// const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

// Routes
app.use('/users', require('./routes/users'));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});