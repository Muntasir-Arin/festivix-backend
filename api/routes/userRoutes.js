require('dotenv').config();
const express = require('express');
const userController = require('../controllers/userController');
const { verifyToken, checkRole, adminOrModerator } = require('../middleware/authMiddleware');

const router = express.Router();

// Example of a protected route
router.get('/profile', verifyToken, userController.getProfile);
router.patch('/updateprofile', verifyToken, userController.updateProfile);

// Example of an admin-only route
router.get('/admin', verifyToken, checkRole('Admin'), userController.adminAccess);
router.get('/all',adminOrModerator, userController.getAllUsers);
router.post('/control/:id/:action', verifyToken, checkRole('Admin'), userController.updateUserRole);
router.post('/suspend/:id', verifyToken, adminOrModerator, userController.suspendUser);


module.exports = router;
