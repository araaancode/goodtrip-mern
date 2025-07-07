// models/Notification.js
const mongoose = require('mongoose');

const CookNotificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    reciever: { type: mongoose.Schema.Types.ObjectId, ref: 'Cook', required: true },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const CookNotification = mongoose.model('CookNotification', CookNotificationSchema);

module.exports = CookNotification;
