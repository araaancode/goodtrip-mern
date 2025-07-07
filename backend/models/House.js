const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const houseSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: "Owner",
      required: true,
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },

    name: {
      type: String,
      required: [true, "Please tell house name!"],
      trim: true,
      maxlength: [
        25,
        "A house name must have less or equal then 25 characters",
      ],
      minlength: [6, "A house name must have more or equal then 6 characters"],
      unique: true,
    },

    houseOwner: {
      type: String,
      required: [true, "Please tell house owner name!"],
      trim: true,
      maxlength: [
        25,
        "A house owner name must have less or equal then 25 characters",
      ],
      minlength: [
        6,
        "A house owner name must have more or equal then 6 characters",
      ],
      unique: true,
    },

    province: {
      type: String,
      trim: true,
      required: true,
    },

    city: {
      type: String,
      trim: true,
      required: true,
    },

    postalCode: {
      type: String,
    },

    housePhone: {
      type: String,
    },

    meters: {
      type: Number,
    },

    description: {
      type: String,
    },

    year: {
      type: Number,
    },

    capacity: {
      type: Number,
      default: 1,
    },

    startDay: {
      type: Date,
    },

    endDay: {
      type: Date,
    },

    cover: {
      type: String,
    },

    images: [{ type: String }],

    houseRoles: [
      {
        type: String,
      },
    ],

    critrias: [
      {
        type: String,
      },
    ],

    houseType: {
      type: String,
    },

    checkIn: Number,
    checkOut: Number,

    lat: {
      type: Number,
      default: 0,
    },

    lng: {
      type: Number,
      default: 0,
    },

    floor: {
      type: Number,
      default: 0,
    },

    options: [
      {
        type: String,
      },
    ],

    heating: [
      {
        type: String,
      },
    ],

    cooling: [
      {
        type: String,
      },
    ],

    parking: {
      type: Number,
      default: 0,
    },

    bill: [
      {
        type: String,
      },
    ],

    price: {
      type: Number,
      required: true,
    },

    address: {
      type: String,
    },

    houseNumber: {
      type: String,
    },

    hobbies: [
      {
        type: String,
      },
    ],

    reservationRoles: [
      {
        type: String,
      },
    ],

    enviornment: {
      type: [String],

      default: [],
    },

    ownerType: {
      type: String,
    },

    rooms: {
      type: String,
    },

    freeDates: [
      {
        type: String,
      },
    ],

    // مدارک ملک
    document: [
      {
        type: String,
      },
    ],

    // نوع کف ملک
    floorType: [
      {
        type: String,
      },
    ],

    // تجهیزات آشپزخانه
    kitchenOptions: [
      {
        type: String,
      },
    ],

    // امکانات اتاق خواب
    bedRoomOptions: [
      {
        type: String,
      },
    ],

    // تخفیف ملک
    discount: {
      type: Number,
      default: 1,
    },

    // change by admin
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },

    // change by house owner
    isAvailable: {
      type: Boolean,
      default: true,
      required: true,
    },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

const House = mongoose.model("House", houseSchema);

module.exports = House;
