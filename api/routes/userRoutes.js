require('dotenv').config();
const express = require('express');
const userController = require('../controllers/userController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Example of a protected route
router.get('/profile', verifyToken, userController.getProfile);

// Example of an admin-only route
router.get('/admin', verifyToken, checkRole('Admin'), userController.adminAccess);

module.exports = router;
