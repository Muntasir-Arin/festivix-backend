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

exports.updateProfile = async (req, res) => {
    try {
        const { username, email, country, twoFactorEnabled } = req.body;

        // Check if the user is trying to update email to one that already exists
        if (email) {
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser.id !== req.user.id) {
                return res.status(400).json({ message: 'Email already in use' });
            }
        }

        // Update user profile information
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { username, email, country, twoFactorEnabled },
            { new: true, runValidators: true }  // Ensure the updated data is returned and validate inputs
        );

        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.json({ message:'Profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin-only access example
exports.adminAccess = (req, res) => {
    res.json({ message: 'Admin content accessible only to admins' });
};
