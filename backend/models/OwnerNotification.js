// models/Notification.js
const mongoose = require('mongoose');

const OwnerNotificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    reciever: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const OwnerNotification = mongoose.model('OwnerNotification', OwnerNotificationSchema);

module.exports = OwnerNotification;
