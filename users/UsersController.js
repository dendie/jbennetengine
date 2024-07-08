const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'jbennett'
})

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

async function createUser (name) {

  // SQL query to insert data
  const insertQuery = 'INSERT INTO user SET ?';

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


  const selectQuery = 'SELECT * FROM user WHERE id = ?';

  connection.query(selectQuery, id, (error, results, fields) => {
    if (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Error deleting user' });
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json({ message: 'User deleted successfully' });
  })
}

async function getUsers (callback) {


    const selectQuery = 'SELECT * FROM user';
  
    connection.query(selectQuery, (error, results, fields) => {
      if (error) throw error;
      callback(error, results)
    })
}
// console.log('USERS', users);

// Close the connection
module.exports = { getUser, getUsers, createUser };
// connection.end();

// var pool = mysql.createPool({
//   connectionLimit : 10,
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'jbennett'
// });

// pool.on('acquire', function (connection) {
//   console.log('Connection %d acquired', connection.threadId);
// });

// pool.on('connection', function (connection) {
//   connection.query('SET SESSION auto_increment_increment=1')
// });

// async function getUser () {
//   const result = await pool.query(
//     'SELECT * FROM user'
//   )
//   console.log('RESULT', result)
//   return result
// }

// async function createUser (name) {
//   const result = await pool.query(
//     'INSERT INTO user (name) VALUES (?)', [name]
//   )
//   console.log('RESULT', result)
//   return result
// }

// // const create = createUser("John");
// const user = getUser();
// console.log(user);

// pool.query('SELECT * AS user', function (error, results, fields) {
//   if (error) throw error;
//   console.log('The user is: ', results);
// });
 
// pool.getConnection(function(err, connection) {
//   if (err) throw err; // not connected!
 
//   // Use the connection
//   connection.query('SELECT * FROM user', function (error, results, fields) {
//     // When done with the connection, release it.
//     connection.release();
 
//     // Handle error after the release.
//     if (error) throw error;
 
//     // Don't use the connection here, it has been returned to the pool.
//   });
// });