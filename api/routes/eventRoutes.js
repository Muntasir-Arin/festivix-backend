const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const upload = require('../middleware/upload');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

router.post('/',  upload, eventController.createEvent);
router.delete('/:id',  eventController.deleteEvent);
router.patch('/:id',  upload, eventController.updateEvent);

module.exports = router;
