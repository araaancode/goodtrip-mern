// models/food.js
const mongoose = require("mongoose");

// Define review schema
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Create the main food schema
const foodSchema = new mongoose.Schema(
  {
    cook: {
      type: mongoose.Schema.ObjectId,
      ref: "Cook",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },
    cookName: {
      type: String,
      required: true,
      trim: true,
    },
    foodCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "پیش غذا",
        "غذای اصلی",
        "دسر و نوشیدنی",
        "ایتالیایی",
        "ایرانی",
        "ساندویچ",
        "فست فود",
        "سوپ",
        "آش",
      ],
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    count: {
      type: Number,
      required: true,
      default: 0,
    },
    cookDate: [
      {
        type: String,
        required: true,
      },
    ],
    cookHour: {
      type: String,
      required: true,
    },
    photo: String,
    photos: [
      {
        type: String,
      },
    ],
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    numReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Food = mongoose.model("Food", foodSchema);

module.exports = Food;
