require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, { serverApi: { version: '1', strict: true, deprecationErrors: true } });
        conn.connection.db.admin().command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.error(`Error: ${error.message}`);
        if (error.message.includes("bad auth")) {
            console.error("Authentication failed. Please check your MongoDB credentials.");
        }
        process.exit(1); // Exit process if connection fails
    }
};

module.exports = connectDB;
