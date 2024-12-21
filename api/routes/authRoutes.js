require('dotenv').config();
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Register route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

// Verify account route
router.get('/verify/:token', authController.verifyAccount);
router.get('/verifyrole', authController.verifyRole);
router.post('/verify2fa', authController.verify2FA);
router.post('/verifyreset', authController.resetPassword);
router.post('/reset-request', authController.requestPasswordReset);


module.exports = router;
