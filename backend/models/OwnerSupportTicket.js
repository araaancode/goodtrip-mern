const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Support Ticket schema
const OwnerSupportTicketSchema = new Schema({
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
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'Owner',
    required: true
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'Owner'
  },

  comments: [{
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'Owner'
    },
    comment: {
      type: String,
      required: true
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
OwnerSupportTicketSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create the Support Ticket model
const OwnerSupportTicket = mongoose.model('OwnerSupportTicket', OwnerSupportTicketSchema);

module.exports = OwnerSupportTicket;