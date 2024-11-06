const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  verificationExpires: { type: Date },
  role: { 
    type: String, 
    enum: ['Admin', 'Moderator', 'Manager', 'User'], 
    default: 'User' 
  },
});

module.exports = mongoose.model('User', userSchema);
