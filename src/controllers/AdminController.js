const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const ApiResponseAdmin = require('../models/apiResponseAdmin');
const ApiResponseSendEmail = require('../models/apiResponseSendEmail');

async function storeLogin (request)
{
    try {
        const hashedPassword = await bcrypt.hash(request.body.password, 10)
        const user = { user: request.body.user, password: hashedPassword, email: request.body.email, client: request.body.client }
        const apiResponse = new ApiResponseAdmin(user);
        await apiResponse.save();
        return { status: 201, message: 'Success' }
    } catch (error) {
        console.log(error);
        return { status: 500 }
    }
}

async function setEmailTo (request)
{
    try {
        const user = { user: request.body.user, email: request.body.email };
        const apiResponse = new ApiResponseSendEmail(user);
        await apiResponse.save();
        return { status: 201, message: 'Success' }
    } catch (error) {
        console.log(error);
        return { status: 500 }
    }
}

module.exports = { storeLogin, setEmailTo }
