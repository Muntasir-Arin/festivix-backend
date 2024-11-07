const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    highestPrice: {
        type: Number,
        required: true,
    },
    lowestPrice: {
        type: Number,
        required: true,
    },
    dynamicPricing: {
        type: Boolean,
        default: false,
    },
    ticketNumber: {
        type: String,
        unique: true,
        required: true,
    },
    purchasePrice: Number,
    purchasedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    seatPhotoUrl: String,
    verificationCode: {
        type: String,
        unique: true,
        required: true,
    },
    isRefunded: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;
