const mongoose = require('mongoose');

// house booking
const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'Owner',
        required: true,
    },
    house: {
        type: mongoose.Schema.ObjectId,
        ref: 'House',
        required: true,
    },
    price: {
        type: Number,
    },
    checkIn: {
        type: Date,
    },
    checkOut: {
        type: Date,
    },
    guests: {
        type: Number,
        default: 0
    },
    isConfirmed: {
        type: Boolean,
        default:false
        
    },

}, { timestamps: true });


const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;