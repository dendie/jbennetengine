const dotenv = require('dotenv');
dotenv.config();

CONST_API = process.env.API_KEY
CONST_URL = 'https://recruiterflow.com/api'

module.exports = { CONST_API, CONST_URL }