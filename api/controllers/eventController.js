const Event = require('../models/Event'); // Import Event model
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Utility function to upload a file to Supabase storage
async function uploadToSupabase(file, bucketName = 'festivix') {
  const { filename, buffer, mimetype } = file;

  try {
  const uniqueFilename = `${Date.now()}-${uuidv4()}-${filename}`;
  const filePath = `${bucketName}/${uniqueFilename}`;
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, buffer, { contentType: mimetype });

  if (error) {
    throw new Error('File upload to Supabase failed: ' + error.message);
  }

  const publicUrl = supabase.storage.from(bucketName).getPublicUrl(filePath);
  return publicUrl.data.publicUrl;
} 
  catch (err) {
  console.error('Error uploading file to Supabase:', err.message);
  throw err;
}
}

// Helper function to check user authorization
function isAuthorized(user, managerId) {
  return (
    user.role.includes('Admin') ||
    user.role.includes('Moderator') ||
    user.id === managerId.toString()
  );
}

// Create an event
exports.createEvent = async (req, res) => {
  try {
    const manager = req.user.id;
    const {...eventData } = req.body;
    // Check for file uploads
    let imageUrl = '';
    let logoUrl = '';
    if (req.files?.image) {
      const file = {
        filename: `${req.files.image[0].originalname}`,
        buffer: req.files.image[0].buffer,
        mimetype: req.files.image[0].mimetype,
      };
      imageUrl = await uploadToSupabase(file);
      
    }
    if (req.files?.logo) {
      const file = {
        filename: `${req.files.logo[0].originalname}`,
        buffer: req.files.logo[0].buffer,
        mimetype: req.files.logo[0].mimetype,
      };
      logoUrl = await uploadToSupabase(file);
    }


    const event = new Event({
      ...eventData,
      manager, 
      imageUrl,
      logoUrl,
    });

    const savedEvent = await event.save();
    res.status(201).json({ message: 'Event created successfully!', event: savedEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create event.', error: error.message });
  }
};

exports.viewEvent = async (req, res) => {
  try {
    const eventId = req.params.id.toString();

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: 'Invalid event ID format.' });
    }

    // Find the event by ID
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    res.status(200).json({ message: 'Event retrieved successfully!', event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve event.', error: error.message });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user; // Assuming req.user is populated from authentication middleware

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    if (!isAuthorized(user, event.manager)) {
      return res.status(403).json({ message: 'You are not authorized to delete this event.' });
    }

    await Event.findByIdAndDelete(id);
    res.status(200).json({ message: 'Event deleted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete event.', error: error.message });
  }
};

// Update an event
exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const user = req.user;
    const { ...updatedData } = req.body;

    let imageUrl = '';
    let logoUrl = '';
    if (req.files?.image) {
      const file = {
        filename: `${req.files.image[0].originalname}`,
        buffer: req.files.image[0].buffer,
        mimetype: req.files.image[0].mimetype,
      };
      imageUrl = await uploadToSupabase(file);
      updatedData.imageUrl = imageUrl;
      
    }
    if (req.files?.logo) {
      const file = {
        filename: `${req.files.logo[0].originalname}`,
        buffer: req.files.logo[0].buffer,
        mimetype: req.files.logo[0].mimetype,
      };
      logoUrl = await uploadToSupabase(file);
      updatedData.logoUrl = logoUrl; 
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    if (!isAuthorized(user, event.manager)) {
      return res.status(403).json({ message: 'You are not authorized to update this event.' });
    }
    const updatedEvent = await Event.findByIdAndUpdate(eventId, updatedData, { new: true });


    res.status(200).json({ message: 'Event updated successfully!', event: updatedEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update event.', error: error.message });
  }
};


exports.getUserEvents = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from the authenticated user object

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format.' });
    }

    // Fetch all events created by the user and sort by creation date (descending)
    const userEvents = await Event.find({ manager: userId }).sort({ createdAt: -1 });

    if (!userEvents || userEvents.length === 0) {
      return res.status(404).json({ message: 'No events found for this user.' });
    }

    res.status(200).json({ 
      message: 'User events retrieved successfully!', 
      events: userEvents 
    });
  } catch (error) {
    console.error('Error fetching user events:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve events.', 
      error: error.message 
    });
  }
};