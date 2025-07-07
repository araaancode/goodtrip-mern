const mongoose = require('mongoose');

// otp schema
const userOTPSchema = new mongoose.Schema(
    {
        phone: {
            type: String,
            validate: {
                validator: function (v) {
                    return /09\d{9}/.test(v);
                },
                message: (props) => `${props.value} is not a valid phone number!`,
            },
            required: [true, "User phone number required"],
            unique: true,
        },
        code: String,
        otpExpiresAt: {
            type: Date,
        }
    }, { timestamps: true }
);




const UserOTP = mongoose.model("userOTP", userOTPSchema);


module.exports = UserOTP