const mongoose = require('mongoose');
require('dotenv').config();
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    country: { type: String},
    role: {
        type: [String], 
        enum: ['Admin', 'Moderator', 'User', 'Manager', 'Affiliate'], 
        default: ['User'], 
      },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, expires: '24h' }, 
    status: { 
        type: String, 
        enum: ['Active', 'Temporarily Suspended', 'Permanently Suspended'], 
        default: 'Active' 
    },
    suspendUntil: { type: Date, default: null },
    suspendHistory: [{ 
        suspendedOn: { type: Date, default: Date.now },
        suspendedUntil: { type: Date },
        reason: { type: String, maxlength: 200 }
    }],
    lastLogin: { type: Date },
    twoFactorEnabled: { type: Boolean, default: false },

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
