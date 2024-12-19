const mongoose = require('mongoose');

// Define Event Schema
const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String, // Could use ISO time string or custom format
    required: true,
  },
  coordinates: {
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
  },
  imageUrl: {
    type: String,
    required: false, // Optional image for event
  },
  ageRestriction: {
    type: String,
    required: true,
    enum: ['Allow All', '13+', '18+']
  },
  ticketSellStart: {
    type: Date,
    required: true,
  },
  ticketSellEnd: {
    type: Date,
    required: true
  },
  earlyBirdEnabled: {
    type: Boolean,
    default: false
  },
  earlyBirdStart: {
    type: Date,
  },
  earlyBirdEnd: {
    type: Date,
  },
  earlyBirdDiscount: {
    type: Number, // Percentage discount (e.g., 20 for 20%)
    min: 0,
    max: 100,
    default: 0, // Default no discount
  },
  themeColor: {
    type: String, // Hex color for event branding
    default: '#000000',
  },
  logoUrl: {
    type: String,
    required: false, // Optional logo for event branding
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the user managing the event
    required: true,
  },
  dynamicPricingEnabled: {
    type: Boolean,
    default: false,
  },
  dynamicPriceAdjustment: {
    type: Number, 
    default: 0,
  },
  venueLayout: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true
  },
  refundPercentage: {
    type: Number,
    required: true,
    min: 50,
    max: 100
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to auto-update `updatedAt` field
eventSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Export the Event model
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
