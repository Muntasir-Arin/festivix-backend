require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT Token
exports.verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access Denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

// Role-based access control
exports.checkRole = (role) => async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user && user.role === role) {
            next();
        } else {
            res.status(403).json({ message: 'Access denied' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
