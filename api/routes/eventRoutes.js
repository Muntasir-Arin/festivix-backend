const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// Public routes
router.get('/', eventController.listEvents); // List events with filters
router.get('/:id', eventController.getEventById); // View event details
router.get('/:eventId/tickets', eventController.listTickets); // List tickets for an event

// Protected event routes
router.post('/', verifyToken, checkRole('Admin', 'Moderator', 'User'), eventController.createEvent); // Create event (Manager only)
router.put('/:id', verifyToken, checkRole('Admin', 'Moderator', 'User'), eventController.updateEvent); // Update event (Manager only)
router.delete('/:id', verifyToken, checkRole('Admin', 'Moderator', 'User'), eventController.deleteEvent); // Delete event (Manager only)

// Ticket-related protected routes
router.post('/:eventId/tickets', verifyToken, checkRole('Admin', 'Moderator', 'User'), eventController.addTickets); // Add tickets (Seller only)
router.put('/:eventId/tickets/:ticketId', verifyToken, checkRole('Admin', 'Moderator', 'User'), eventController.updateTicket); // Update ticket (Seller only)
router.delete('/:eventId/tickets/:ticketId', verifyToken, checkRole('Admin', 'Moderator', 'User'), eventController.deleteTicket); // Delete ticket (Seller only)

module.exports = router;
