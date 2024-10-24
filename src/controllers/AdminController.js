const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const ApiResponseAdmin = require('../models/apiResponseAdmin');
const ApiResponseSendEmail = require('../models/apiResponseSendEmail');

async function getListUsers (req, res)
{
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
    const searchQuery = req.query.search || '';

    const skip = (page - 1) * limit; // Calculate the number of documents to skip

    const searchCondition = searchQuery ? { $or: [{ user: { $regex: searchQuery.trim(), $options: 'i' } }, { email: { $regex: searchQuery.trim(), $options: 'i' } }, { 'client.name': { $regex: searchQuery.trim(), $options: 'i' } }] } : {};
    
    const users = await ApiResponseAdmin.find(searchCondition).skip(skip).limit(limit);
    // Get the total count of items in the collection
    const totalItems = await ApiResponseAdmin.countDocuments();
    // return users
    return {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      users
    }
  } catch (error) {
      console.log(error);
      return { status: 500, error: 'Failed to fetch items' }
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
      const apiResponse = new ApiResponseAdmin({ user: user, email: email, password: hashedPassword, client: client });
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

// Update Password (Authenticated User)
async function updatePassword (request)
{
    const { currentPassword, newPassword } = request.body;
    
    try {
      const user = await User.findById(request.user.id);
  
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Current password is incorrect' });
      }
  
      user.password = newPassword;
      await user.save();
  
    //   res.json({ msg: 'Password updated successfully' });
      return { msg: 'Password updated successfully' };
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
};
  
  // Forgot Password
async function forgotPassword (request) {
    const { email } = request.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ msg: 'No user found with this email' });
      }
  
      const resetToken = user.getResetPasswordToken();
      await user.save();
  
      const resetUrl = `${request.protocol}://${request.get('host')}/api/users/resetpassword/${resetToken}`;
  
      const message = `
        You are receiving this email because you (or someone else) has requested the reset of a password.
        Please make a PUT request to: \n\n ${resetUrl}
      `;
  
      // Send email using nodemailer
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Password Reset Token',
        text: message,
      };
  
      await transporter.sendMail(mailOptions);
  
      res.json({ msg: 'Email sent' });
    } catch (error) {
      console.error(error.message);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      res.status(500).send('Server error');
    }
};
  
  // Reset Password
async function resetPassword (request)
{
    const resetPasswordToken = crypto.createHash('sha256').update(request.params.token).digest('hex');
  
    try {
      const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      });
  
      if (!user) {
        return res.status(400).json({ msg: 'Invalid or expired token' });
      }
  
      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
  
      await user.save();
  
      res.json({ msg: 'Password reset successful' });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
};

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
        const isSetEmail = await ApiResponseSendEmail.find();
        if (isSetEmail.length === 0) {
            const user = { email: request.body.email };
            const apiResponse = new ApiResponseSendEmail(user);
            await apiResponse.save();
            return { status: 201, message: 'Success' }
        }
        return { status: 500, message: 'Set email already exists, you can only edit it' }
    } catch (error) {
        console.log(error);
        return { status: 500, message: error.message }
    }
}

async function updateEmailTo (request)
{
    try {
        const emails = await ApiResponseSendEmail.findById(request.params.id);
        const result = await emails.updateOne(
            { $set: { email: request.body.email } },
            { new: true }
        );
        return { status: 201, message: `Updated ${result.modifiedCount} document(s)` }
    } catch (error) {
        console.log(error);
        return { status: 500, message: error.message }
    }
}

module.exports = { getListUsers, storeLogin, deleteUser, getEmailTo, setEmailTo, updateEmailTo }
