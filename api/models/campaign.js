const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  title: { type: String, required: true },
  description: { type: String },
  emailList: { type: [String], required: true }, // List of emails
  createdAt: { type: Date, default: Date.now },
  coupon: { type: Number }, // Corrected to Number
});

module.exports = mongoose.model('Campaign', campaignSchema);
