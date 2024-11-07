require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT Token
exports.verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No token provided' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({ message: 'Session expired. Please log in again.' });
        } else {
            res.status(400).json({ message: 'Invalid token' });
        }
    }
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
