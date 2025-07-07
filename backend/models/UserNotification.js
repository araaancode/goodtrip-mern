// models/Notification.js
const mongoose = require('mongoose');

const userNotificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    reciever: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const UserNotification = mongoose.model('UserNotification', userNotificationSchema);

module.exports = UserNotification;
