const mongoose = require('mongoose');

const ticketPurchaseSchema = new mongoose.Schema({
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true,
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    purchaseDate: {
        type: Date,
        default: Date.now,
    },
    price: {
        type: Number,
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Refunded'],
        default: 'Pending',
    },
    refundRequested: {
        type: Boolean,
        default: false,
    },
    refundStatus: {
        type: String,
        enum: ['Not Requested', 'Requested', 'Approved', 'Rejected'],
        default: 'Not Requested',
    },
    refundDeadline: Date,
}, {
    timestamps: true,
});

const TicketPurchase = mongoose.model('TicketPurchase', ticketPurchaseSchema);
module.exports = TicketPurchase;
