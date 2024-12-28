const express = require('express');
const router = express.Router();

// Import the controller
const campaignController = require('../controllers/campaignController');

// Route to create a new campaign
router.post('/', campaignController.createCampaign);

// Example route for fetching all campaigns (if needed)
router.get('/', async (req, res) => {
  try {
    // Logic to fetch all campaigns from the database
    const campaigns = await Campaign.find();
    res.json({ campaigns });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
