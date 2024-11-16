const mongoose = require('mongoose');

const managerApplicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applicationDate: { type: Date, default: Date.now, required: true },
  applicationReason: { type: String, maxlength: 500, required: true },
  applicationStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Declined'],
    default: 'Pending',
    required: true,
  },
  checkedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  checkDate: { type: Date },
});

module.exports = mongoose.model('ManagerApplication', managerApplicationSchema);
