// models/Notification.js
const mongoose = require('mongoose');

const driverNotificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    reciever: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const DriverNotification = mongoose.model('DriverNotification', driverNotificationSchema);

module.exports = DriverNotification;
