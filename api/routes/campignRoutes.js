const express = require('express');
const { createCampaign } = require('../controllers/campaignController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', authMiddleware, createCampaign);

module.exports = router;
