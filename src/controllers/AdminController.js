const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const ApiResponseAdmin = require('../models/apiResponseAdmin');
const ApiResponseSendEmail = require('../models/apiResponseSendEmail');

async function getListUsers (req, res)
{
    try {
        const users = await ApiResponseAdmin.find();
        return users
    } catch (error) {
        console.log(error);
        return { status: 500 }
    }
}

async function storeLogin (request)
{
    const { user, email, password, client } = request.body;
    try {
        let dataUser = await ApiResponseAdmin.findOne({ email });
        if (dataUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const apiResponse = new ApiResponseAdmin({ user, email, hashedPassword, client });
        await apiResponse.save();
        return { status: 201, message: 'User registered successfully' }
    } catch (error) {
        console.log(error);
        return { status: 500 }
    }
}

async function updateLogin (request)
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

async function deleteUser (request)
{
    try {
        await ApiResponseAdmin.findByIdAndDelete(request.params.id);
        return { status: 200, message: 'User deleted successfully' }
    } catch (error) {
        console.log(error);
        return { status: 500 }
    }
}

async function getEmailTo ()
{
    try {
        const apiResponse = await ApiResponseSendEmail.find();
        return apiResponse
    } catch (error) {
        console.log(error);
        return { status: 500 }
    }
}

async function setEmailTo (request)
{
    try {
        const user = { email: request.body.email };
        const apiResponse = new ApiResponseSendEmail(user);
        await apiResponse.save();
        return { status: 201, message: 'Success' }
    } catch (error) {
        console.log(error);
        return { status: 500 }
    }
}

module.exports = { getListUsers, storeLogin, deleteUser, getEmailTo, setEmailTo }
