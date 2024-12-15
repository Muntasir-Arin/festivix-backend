const Event = require('../models/Event'); // Import Event model
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Utility function to upload a file to Supabase storage
async function uploadToSupabase(file, bucketName = 'events') {
  const { filename, buffer, mimetype } = file;

  const filePath = `${bucketName}/${filename}`;
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, buffer, { contentType: mimetype });

  if (error) {
    throw new Error('File upload to Supabase failed: ' + error.message);
  }

  const { publicUrl } = supabase.storage.from(bucketName).getPublicUrl(filePath);
  return publicUrl;
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
    const { manager, ...eventData } = req.body;

    // Check for file uploads
    let imageUrl = '';
    let logoUrl = '';
    if (req.files?.image) {
      const file = {
        filename: `event/${req.files.image[0].originalname}`,
        buffer: req.files.image[0].buffer,
        mimetype: req.files.image[0].mimetype,
      };
      imageUrl = await uploadToSupabase(file);
    }
    if (req.files?.logo) {
      const file = {
        filename: `event/${req.files.logo[0].originalname}`,
        buffer: req.files.logo[0].buffer,
        mimetype: req.files.logo[0].mimetype,
      };
      logoUrl = await uploadToSupabase(file);
    }

    const event = new Event({
      ...eventData,
      manager, // User creating the event
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
    const { id } = req.params;
    const user = req.user; // Assuming req.user is populated from authentication middleware
    const updateData = req.body;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    if (!isAuthorized(user, event.manager)) {
      return res.status(403).json({ message: 'You are not authorized to update this event.' });
    }

    // Handle file uploads
    if (req.files?.image) {
      const file = {
        filename: `event/${req.files.image[0].originalname}`,
        buffer: req.files.image[0].buffer,
        mimetype: req.files.image[0].mimetype,
      };
      updateData.imageUrl = await uploadToSupabase(file);
    }
    if (req.files?.logo) {
      const file = {
        filename: `event/${req.files.logo[0].originalname}`,
        buffer: req.files.logo[0].buffer,
        mimetype: req.files.logo[0].mimetype,
      };
      updateData.logoUrl = await uploadToSupabase(file);
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ message: 'Event updated successfully!', event: updatedEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update event.', error: error.message });
  }
};
