const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");

const busTicketSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.ObjectId,
      ref: "Driver",
      required: true,
    },
    passengers: [
      {
        name: { type: String, required: true },
        nationalCode: { type: Number, required: true },
        price: { type: Number, required: true },
        age: { type: Number, required: true },
        gender: { type: String, required: true },
        ticketOwner: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "User",
        },
      },
    ],
    bus: {
      type: mongoose.Schema.ObjectId,
      ref: "Bus",
      required: true,
    },
    // ticket owner
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    movingDate: {
      type: Date,
      default: Date.now(),
    },
    returningDate: {
      type: Date,
      default: Date.now(),
    },
    startHour: {
      type: Date,
      default: Date.now(),
    },
    endHour: {
      type: Date,
      default: Date.now(),
    },
    firstCity: {
      type: String,
      required: true,
    },
    lastCity: {
      type: String,
      required: true,
    },
    ticketPrice: {
      type: Number,
      required: true,
    },
    seatNumbers: [
      {
        type: Number,
      },
    ],
    isCanceled: {
      type: Boolean,
      default: false,
      required: true,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
      required: true,
    },
    ticketType: {
      type: String,
      enum: ["oneSide", "twoSide"],
      default: false,
    },

    ticketNumber: {
      type: String,
      required: true,
      unique: true,
    },

    count: {
      type: Number,
      default: 0,
      required: true,
    },

    isValid: {
      type: Boolean,
      default: true,
      required: true,
    },
    isExpired: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

const BusTicket = mongoose.model("BusTicket", busTicketSchema);

module.exports = BusTicket;
