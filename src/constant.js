const dotenv = require('dotenv');
dotenv.config();

CONST_API = process.env.API_KEY
CONST_URL = 'https://recruiterflow.com/api'

CONST_EMAIL_NAME = process.env.EMAIL_NAME
CONST_EMAIL_KEY = process.env.EMAIL_KEY

module.exports = { CONST_API, CONST_URL, CONST_EMAIL_NAME, CONST_EMAIL_KEY }