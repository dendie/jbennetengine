const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // await mongoose.connect('mongodb://localhost:27017/recruiterflow', {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true
        //     // useCreateIndex: true
        // });
        await mongoose.connect('mongodb+srv://dendie:sUtwjNwRaKZANyFL@jbennett.inudh.mongodb.net/', {
            useNewUrlParser: true,
            useUnifiedTopology: true
            // useCreateIndex: true
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

module.exports = connectDB;
