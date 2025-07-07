const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const cookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "نام و نام خانوادگی آشپز باید وارد شود"],
      trim: true,
      min: 6,
      max: 50,
    },
    username: {
      type: String,
      trim: true,
      required: [true, " نام کاربری آشپز باید وارد شود"],
      min: 3,
      max: 20,
    },

    nationalCode: {
      type: String,
      trim: true,
      min: 10,
      max: 10,
    },
    gender: {
      type: String,
    },
    city: {
      type: String,
    },
    province: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
      validate: [validator.isEmail, "لطفا یک ایمیل معتبر وارد کنید"],
    },
    phone: {
      type: String,
      validate: {
        validator: function (v) {
          return /09\d{9}/.test(v);
        },
        message: (props) => `${props.value} یک شماره تلفن معتبر نیست!`,
      },
      required: [true, "شماره همراه آشپز باید وارد شود"],
      unique: true,
    },
    avatar: {
      type: String,
      default: "default.jpg",
    },
    role: {
      type: String,
      default: "cook",
    },

    password: {
      type: String,
      required: [true, "گذرواژه باید وارد شود"],
      minlength: 8,
    },

    token: {
      type: String,
    },

    lat: {
      type: String,
    },

    lng: {
      type: String,
    },

    position: [Number],

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

    isActive: {
      type: Boolean,
      default: true,
    },

    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "House",
      },
    ],

    // cook date
    cookDate: [
      {
        type: String,
      },
    ],

    // cook hour
    cookHour: {
      type: String,
    },

    // address
    address: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
  },
 
  },
  { timestamps: true }
);

cookSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

cookSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

cookSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

cookSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

cookSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

cookSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const Cook = mongoose.model("Cook", cookSchema);

module.exports = Cook;
