// db.js

const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();
const host = process.env.MYSQL_HOST || '';
const user = process.env.MYSQL_USER || '';
const password = process.env.MYSQL_PASS || '';
const database = process.env.MYSQL_DATABASE || '';

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

module.exports = db;