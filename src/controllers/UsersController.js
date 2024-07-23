const mysql = require('mysql')
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.DATABASE_PORT || '';
const host = process.env.MYSQL_HOST || '';
const user = process.env.MYSQL_USER || '';
const password = process.env.MYSQL_PASS || '';
const database = process.env.MYSQL_DATABASE || '';

const connection = mysql.createConnection({
  host: host,
  user: user,
  password: password,
  database: database
})

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

async function createUser (name) {

  // SQL query to insert data
  const insertQuery = 'INSERT INTO users SET ?';

  let result = null;

  // Execute the insert query
  connection.query(insertQuery, name, (error, results, fields) => {
    if (error) throw error;
    console.log('Inserted a new row with ID:', results.insertId);
    result = results;
  });
  return result;
}

async function getUser (id) {

  const selectQuery = 'SELECT * FROM users WHERE user_id = ?';

  await connection.query(selectQuery, id.id, (error, results, fields) => {
    if (error) {
        console.error('Error deleting user:', error);
        results.status(500).json({ error: 'Error deleting user' });
        return;
      }
      if (results.affectedRows === 0) {
        results.status(404).json({ error: 'User not found' });
        return;
      }
      console.log('RESULT', results);
      return results;
  })
}

async function getUsers (callback) {


    const selectQuery = 'SELECT * FROM user';
  
    connection.query(selectQuery, (error, results, fields) => {
      if (error) throw error;
      callback(error, results)
    })
}

// Close the connection
module.exports = { getUser, getUsers, createUser };