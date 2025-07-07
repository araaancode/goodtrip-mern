const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Support Ticket schema
const cookSupportTicketSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Closed'],
    default: 'Open'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  cook: {
    type: Schema.Types.ObjectId,
    ref: 'Cook',
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'Cook'
  },

  comments: [{
    cook: {
      type: Schema.Types.ObjectId,
      ref: 'Cook'
    },
    comment: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],

  isRead: {
    type: Boolean,
    default: false
  },

  images: [{
    type: String,
  }]
});

// Middleware to update the `updatedAt` field on save
cookSupportTicketSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create the Support Ticket model
const CookSupportTicket = mongoose.model('CookSupportTicket', cookSupportTicketSchema);

module.exports = CookSupportTicket;