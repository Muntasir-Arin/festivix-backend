const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const upload = require('../middleware/upload');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

router.post('/', verifyToken, checkRole('Manager'), upload, eventController.createEvent);
router.delete('/:id', verifyToken, checkRole('Manager'), eventController.deleteEvent);
router.patch('/:id', verifyToken, checkRole('Manager'), upload, eventController.updateEvent);

module.exports = router;
