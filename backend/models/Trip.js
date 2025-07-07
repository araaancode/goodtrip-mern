const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  bus: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bus',
    required: [true, 'A trip must belong to a bus'],
    validate: {
      validator: async function(value) {
        const bus = await mongoose.model('Bus').findById(value);
        return bus && bus.isActive && bus.isAvailable;
      },
      message: 'Bus is not available or active'
    }
  },
  driver: {
    type: mongoose.Schema.ObjectId,
    ref: 'Driver',
    required: [true, 'A trip must have a driver'],
    validate: {
      validator: async function(value) {
        const driver = await mongoose.model('Driver').findById(value);
        return driver && driver.isActive;
      },
      message: 'Driver is not active'
    }
  },
  departureTime: {
    type: Date,
    required: [true, 'Please provide departure time']
  },
  arrivalTime: {
    type: Date,
    required: [true, 'Please provide arrival time'],
    validate: {
      validator: function(value) {
        return value > this.departureTime;
      },
      message: 'Arrival time must be after departure time'
    }
  },
  price: {
    type: Number,
    required: [true, 'Please provide ticket price'],
    min: [1000, 'Price should be at least 1000']
  },
  availableSeats: {
    type: Number,
    required: true,
    min: [0, 'Available seats cannot be negative']
  },
  isCancelled: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

tripSchema.pre('save', async function(next) {
  if (!this.availableSeats && this.bus) {
    const bus = await mongoose.model('Bus').findById(this.bus);
    this.availableSeats = bus?.capacity || 0;
  }
  next();
});

tripSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'bus',
    select: 'name model capacity options photo'
  }).populate({
    path: 'driver',
    select: 'name phone firstCity lastCity movingDate returningDate startHour endHour'
  });
  next();
});

const Trip = mongoose.model('Trip', tripSchema);
module.exports = Trip;