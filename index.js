const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.DATABASE_PORT;
const { createUser, getUsers, getUser } = require('./users/UsersController');

const myLogger = function (req, res, next) {
    console.log('LOGGED')
    next()
}

app.use(myLogger)

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/users', (req, res) => {
  
  getUsers(function(err, data) {
    if (err) {
      console.log("ERROR", err);
    } else {
      res.json(data);
    }
  });

})

app.get('/users/:id', (req, res) => {
  
  const users = getUser(req.params);
  res.send(users);

})

app.post('/users/:id', (req, res) => {
  
  const users = createUser(req.params, req.body);
  res.send(users);

})

app.put('/users/:id', (req, res) => {

  const users = updateUser(req.params, req.body);
  
  res.send(users);

})

app.delete('/users/:id', (req, res) => {

  const users = deleteUser(req.params);
  
  res.send(users);
  
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = { app }
