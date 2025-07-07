
const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        min: 4,
        max: 50,
        required: true
    },
    phone: {
        type: String,
        validate: {
            validator: function (v) {
                return /09\d{9}/.test(v);
            },
            message: (props) => `${props.value} یک شماره تلفن معتبر نیست!`,
        },
        required: [true, "شماره باید وارد شود"],
    },
    address: {
        type: String,
    },
})

const driverAdsSchema = new mongoose.Schema(
    {
        driver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Driver',
            required: true,
        },
        company: companySchema,
        title: String,
        description: String,
        price: Number,
        photo: String,
        photos: [
            {
                type: String
            }
        ],
        isActive: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true });

const DriverAds = mongoose.model("DriverAds", driverAdsSchema);

module.exports = DriverAds