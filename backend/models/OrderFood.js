const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
    cook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cook",
      required: true,
    },
  },
  { _id: false }
);

const orderFoodSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    deliveryAddress: {
      text: {
        type: String,
        required: true,
      },
      coordinates: {
        lat: {
          type: Number,
          required: true,
        },
        lng: {
          type: Number,
          required: true,
        },
      },
    },
    contactNumber: {
      type: String,
      required: true,
    },
    // paymentMethod: {
    //   type: String,
    //   required: true,
    //   enum: ['Cash', 'Online'],
    //   default: 'Cash'
    // },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
   
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

// Add geospatial index
orderFoodSchema.index({
  "deliveryAddress.coordinates": "2dsphere",
});

const OrderFood = mongoose.model("OrderFood", orderFoodSchema);

module.exports = OrderFood;
