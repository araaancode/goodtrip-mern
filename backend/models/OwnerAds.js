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

const ownerAdsSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Owner',
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

const OwnerAds = mongoose.model("OwnerAds", ownerAdsSchema);

module.exports = OwnerAds