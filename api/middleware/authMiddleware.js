require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT Token
exports.verifyToken = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user from database
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user; // Pass the full user object to req.user
        next();
    } catch (error) {
        console.error(error);
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({ message: 'Session expired. Please log in again.' });
        } else {
            res.status(400).json({ message: 'Invalid token' });
        }
    }
};

exports.adminOrModerator = (req, res, next) => {
    if (!req.user.role.some(role => ['Admin', 'Moderator'].includes(role))) {
        return res.status(403).json({ message: 'Access denied. Admin or Moderator role required.' });
      }
    next();
  };

// Role-based access control
exports.checkRole = (...roles) => async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('role');

        if (user && roles.includes(user.role)) {
            next();
        } else {
            res.status(403).json({ message: 'Access denied: Insufficient permissions' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error while verifying role' });
    }
};
