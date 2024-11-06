// api/routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Register route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

// Verify account route
router.get('/verify/:token', authController.verifyAccount);

module.exports = router;
