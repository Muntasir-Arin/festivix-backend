const mongoose = require('mongoose');
require('dotenv').config();
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['Admin', 'Moderator', 'Manager', 'User'], default: 'User' },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, expires: '24h' }, 
});

module.exports = mongoose.model('User', userSchema);
