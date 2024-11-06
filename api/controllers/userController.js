require('dotenv').config();
const crypto = require('crypto'); // Add this import for creating the hash
const User = require('../models/User');

// Generate Gravatar URL based on email
function getGravatarUrl(email) {
    // Prepare the email for hashing
    const formattedEmail = email.trim().toLowerCase();
    const hash = crypto.createHash('md5').update(formattedEmail).digest('hex');
    // Return the Gravatar URL
    return `https://www.gravatar.com/avatar/${hash}`;
}

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password -_id -verificationToken -__v');
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Add Gravatar URL to user profile
        const profilePicture = getGravatarUrl(user.email);
        res.json({ ...user.toObject(), profilePicture });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin-only access example
exports.adminAccess = (req, res) => {
    res.json({ message: 'Admin content accessible only to admins' });
};
