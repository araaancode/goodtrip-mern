// models/Notification.js
const mongoose = require('mongoose');

const adminNotificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    reciever: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const AdminNotification = mongoose.model('AdminNotification', adminNotificationSchema);

module.exports = AdminNotification;
