const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    description: String,
    location: String,
    coordinates: {
        latitude: Number,
        longitude: Number,
    },
    category: {
        type: String,
        enum: ['Concert', 'Conference', 'Sports', 'Theatre', 'Festival'], 
    },
    venueTemplate: String,
    startDate: {
        type: Date,
        required: true,
    },
    endDate: Date,
    logoUrl: String,
    photoUrl: String,
}, {
    timestamps: true,
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
