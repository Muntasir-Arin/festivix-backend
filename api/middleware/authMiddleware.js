require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT Token
exports.verifyToken = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No token provided!' });
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

exports.adminOrModerator = async (req, res, next) => {
    try {
        // Extract token from Authorization header
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Access Denied: No token provided' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch the user from the database
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Attach the user object to the request
        req.user = user;

        // Check if the user has the required role
        const isAuthorized = req.user.role.some(userRole =>
            ['Admin', 'Moderator'].includes(userRole)
        );

        if (!isAuthorized) {
            return res.status(403).json({ message: 'Access denied. Admin or Moderator role required.' });
        }

        // Proceed to the next middleware or route
        next();
    } catch (error) {
        console.error(error);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Session expired. Please log in again.' });
        }

        return res.status(400).json({ message: 'Invalid token' });
    }
};

// Role-based access control
exports.checkRole = (...roles) => async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('role');

        if (user && user.role.some(userRole => roles.includes(userRole))) {
            next();
        } else {
            res.status(403).json({ message: 'Access denied: Insufficient permissions' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while verifying role' });
    }
};
