// api/controllers/userController.js
const User = require('../models/User');

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin-only access example
exports.adminAccess = (req, res) => {
    res.json({ message: 'Admin content accessible only to admins' });
};
