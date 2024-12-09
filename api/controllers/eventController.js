const Event = require('../models/Event');
const Ticket = require('../models/Ticket');
const { checkRole } = require('../middleware/authMiddleware');

// Event Management
const eventController = {
    // Create a new event (Admin, Moderator, or User)
    createEvent: async (req, res) => {
        try {
            const { name, description, location, coordinates, category, venueTemplate, startDate, endDate, logoUrl, photoUrl } = req.body;
            const eventManagerId = req.user.id;

            const event = new Event({
                name,
                eventManagerId,
                description,
                location,
                coordinates,
                category,
                venueTemplate,
                startDate,
                endDate,
                logoUrl,
                photoUrl
            });

            await event.save();
            res.status(201).json({ message: 'Event created successfully', event });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error creating event' });
        }
    },

    // Update event details (Admin, Moderator, or User)
    updateEvent: async (req, res) => {
        try {
            const { eventId } = req.params;
            const updateData = req.body;
            const userId = req.user.id; // Assuming req.user.id contains the authenticated user's ID
    
            // Find the event to verify the manager
            const event = await Event.findById(eventId);
    
            if (!event) {
                return res.status(404).json({ message: 'Event not found' });
            }
    
            // Check if the authenticated user is the manager of the event
            if (event.manager.toString() !== userId) {
                return res.status(403).json({ message: 'Access denied: Only the event manager can update this event' });
            }
    
            // Update the event
            const updatedEvent = await Event.findByIdAndUpdate(eventId, updateData, { new: true });
            res.json({ message: 'Event updated successfully', event: updatedEvent });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error updating event' });
        }
    },
    

    // Delete an event (Admin, Moderator, or User)
    deleteEvent: async (req, res) => {
        try {
            const { eventId } = req.params;
            const userId = req.user.id; // Assuming req.user.id contains the authenticated user's ID
    
            // Find the event to verify the manager
            const event = await Event.findById(eventId);
    
            if (!event) {
                return res.status(404).json({ message: 'Event not found' });
            }
    
            // Check if the authenticated user is the manager of the event
            if (event.manager.toString() !== userId) {
                return res.status(403).json({ message: 'Access denied: Only the event manager can delete this event' });
            }
    
            // Delete the event
            await event.deleteOne();
            res.json({ message: 'Event deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error deleting event' });
        }
    },
    

    // Ticket Management
    createTicket: async (req, res) => {
        try {
            const { eventId, highestPrice, lowestPrice, dynamic, ticketNumber, purchasePrice } = req.body;
            const sellerId = req.user.id;

            const ticket = new Ticket({
                eventId,
                sellerId,
                highestPrice,
                lowestPrice,
                dynamic,
                ticketNumber,
                purchasePrice,
                verificationCode: crypto.randomBytes(8).toString('hex') // Unique verification code
            });

            await ticket.save();
            res.status(201).json({ message: 'Ticket created successfully', ticket });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error creating ticket' });
        }
    },

    updateTicket: async (req, res) => {
        try {
            const { ticketId } = req.params;
            const updateData = req.body;

            const ticket = await Ticket.findByIdAndUpdate(ticketId, updateData, { new: true });
            if (!ticket) {
                return res.status(404).json({ message: 'Ticket not found' });
            }

            res.json({ message: 'Ticket updated successfully', ticket });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error updating ticket' });
        }
    },

    deleteTicket: async (req, res) => {
        try {
            const { ticketId } = req.params;

            const ticket = await Ticket.findByIdAndDelete(ticketId);
            if (!ticket) {
                return res.status(404).json({ message: 'Ticket not found' });
            }

            res.json({ message: 'Ticket deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error deleting ticket' });
        }
    }
};

module.exports = eventController;

