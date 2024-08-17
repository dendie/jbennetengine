const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const ApiResponseLogin = require('../models/apiResponseLogin');

async function fetchLogin (request)
{
    const user = await ApiResponseLogin.find({ user: request.body.user });
    if (user == null) {
        return { status: 400, message: 'Cannot find user' }
    }
    try {
        if(await bcrypt.compare(request.body.password, user[0].password)) {
            const accessToken = jwt.sign(request.body.user, process.env.ACCESS_TOKEN_SECRET)
            const result = await user[0].updateOne({ $set: { token: accessToken }});
            console.log('result: ' + result)
            if (result) {
                return { message: 'Success', token: accessToken }
            } else {
                return { message: 'Not Allowed' }
            }
        } else {
            return { message: 'Not Allowed' }
        }
    } catch (error) {
        console.log(error);
        return { status: 500 }
    }
}

async function storeLogin (request)
{
    try {
        const hashedPassword = await bcrypt.hash(request.body.password, 10)
        const user = { user: request.body.user, password: hashedPassword }
        const apiResponse = new ApiResponseLogin(user);
        await apiResponse.save();
        return { status: 201, message: 'Success' }
    } catch (error) {
        console.log(error);
        return { status: 500 }
    }
}

module.exports = { fetchLogin, storeLogin }
