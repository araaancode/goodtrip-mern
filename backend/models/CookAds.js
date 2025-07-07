const mongoose = require("mongoose");
const validator = require('validator');

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
    address:{
        type:String,
    },
})

const cookAdsSchema = new mongoose.Schema(
    {
        cook: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cook',
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

const CookAds = mongoose.model("CookAds", cookAdsSchema);

module.exports = CookAds