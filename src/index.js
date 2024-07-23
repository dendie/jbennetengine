// index.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/database');

const app = express();

connectDB();

// Middleware
app.use(bodyParser.json());
// CORS is enabled for the selected origins
let corsOptions = {
  origin: [ 'http://localhost:3000', 'http://localhost:3001' ],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions))


// Routes
app.use('/users', require('./routes/users'));

// Routes
app.use('/recruiter', require('./routes/recruiterflow'));

// Global error handling middleware
app.use((err, req, res, next) => {
  if (!res.headersSent) {
    res.status(500).json({ error: err.message });
  } else {
    next(err); // Pass to default error handler if headers are already sent
  }
});

module.exports = app