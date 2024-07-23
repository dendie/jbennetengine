var mysql = require('mysql');
var migration = require('mysql-migrations');
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.DATABASE_PORT || '';
const host = process.env.MYSQL_HOST || '';
const user = process.env.MYSQL_USER || '';
const password = process.env.MYSQL_PASS || '';
const database = process.env.MYSQL_DATABASE || '';

var connection = mysql.createPool({
  connectionLimit : 10,
  host: host,
  user: user,
  password: password,
  database: database
});

migration.init(connection, __dirname + '/migrations', function() {
    console.log("finished running migrations");
});