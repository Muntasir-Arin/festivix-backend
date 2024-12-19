const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const upload = require('../middleware/upload');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

router.post('/', verifyToken, upload, eventController.createEvent);
router.delete('/delete/:id', verifyToken, eventController.deleteEvent);
router.patch('/patch/:id', verifyToken, upload, eventController.updateEvent);
router.get('/get/:id',  upload, eventController.viewEvent);
router.get('/user', verifyToken, eventController.getUserEvents);

module.exports = router;
