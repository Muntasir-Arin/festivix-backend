const express = require('express');
const router = express.Router();
const { applyForManager, getAllApplications, reviewApplication } = require('../controllers/managerApplicationController');
const { verifyToken, adminOrModerator } = require('../middleware/authMiddleware');

// User applies for manager
router.post('/apply', verifyToken, applyForManager);
// Admin or Moderator reviews applications
router.get('/applications',  getAllApplications);
router.post('/review', verifyToken, adminOrModerator, reviewApplication);

module.exports = router;
