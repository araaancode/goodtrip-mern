const crypto = require('crypto');
const { promisify } = require('util');
const randKey = require("random-key");
const jwt = require('jsonwebtoken');
const Owner = require('../../models/Owner');
const Token = require('../../models/Token');
const OTP = require("../../models/OTP")
const { StatusCodes } = require("http-status-codes")
const bcrypt = require("bcryptjs")
const { sendEmail, sendSuccessEmail } = require("../../utils/sendMail")
const sendOTPUtil = require("../../utils/sendOTP")

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const sendOTPCode = async (phone, owner, req, res) => {
    const code = randKey.generateDigits(5);
    let otp = await OTP.findOne({ phone })

    if (otp) {
        otp.code = code;
        otp.save().then((data) => {
            if (data) {

                sendOTPUtil(otp.code, phone)
                res.status(StatusCodes.CREATED).json({
                    msg: "کد تایید ارسال شد",
                    data
                })
            }

        }).catch((error) => {
            console.log(error);

            res.status(StatusCodes.BAD_REQUEST).json({
                msg: "کد تایید ارسال نشد",
                error
            })
        })
    } else {
        let newOtp = await OTP.create({
            phone: phone,
            code
        })

        if (newOtp) {
            sendOTPUtil(newOtp.code, phone)

            res.status(StatusCodes.CREATED).json({
                msg: "کد تایید جدید ساخته شد",
                code: newOtp
            })
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({
                msg: "کد تایید ساخته نشد"
            })
        }

    }

};

const createSendToken = (owner, statusCode, statusMsg, msg, req, res) => {
    const token = signToken(owner._id);

    res.cookie('jwt', token, {
        expires: new Date(
            Date.now() + 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    });

    // Remove password from output
    owner.password = undefined;

    res.status(statusCode).json({
        status: statusMsg,
        msg,
        token,
        data: {
            owner
        }
    });
};

exports.register = async (req, res, next) => {
    try {
        let { name, username, phone, email, password } = req.body

        if (!name || !username || !phone || !email || !password) {
            res.status(StatusCodes.BAD_REQUEST).json({
                status: 'failure',
                msg: "همه فیلدها باید وارد شوند!",
            })
        } else {
            let findOwner = await Owner.findOne({ phone: req.body.phone })

            if (findOwner) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    status: 'failure',
                    msg: "کاربر وجود دارد. وارد سایت شوید!",
                })
            } else {
                let newOwner = await Owner.create({
                    name: req.body.name,
                    username: req.body.username,
                    phone: req.body.phone,
                    email: req.body.email,
                    password: req.body.password,
                })

                if (newOwner) {
                    res.status(StatusCodes.CREATED).json({
                        status: 'success',
                        msg: "کاربر با موفقیت ثبت نام شد",
                        _id: newOwner._id,
                        name: newOwner.name,
                        phone: newOwner.phone,
                        email: newOwner.email,
                        username: newOwner.username,
                        avatar: newOwner.avatar,
                        role: newOwner.role,
                    })
                }
            }
        }


    } catch (error) {
        console.error(error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            msg: "خطای داخلی سرور",
            error
        });
    }

}

exports.login = async (req, res, next) => {
    try {
        if (!req.body.phone || !req.body.password) {
            res.status(StatusCodes.BAD_REQUEST).json({ status: 'failure', msg: 'لطفا همه فیلدها را وارد کنید' })
        }


        let owner = await Owner.findOne({ phone: req.body.phone })

        if (owner) {
            if (await owner.matchPassword(req.body.password)) {
                res.status(200).json({
                    status: 'success',
                    msg: 'کاربر با موفقیت وارد سایت شد',
                    _id: owner._id,
                    name: owner.name,
                    phone: owner.phone,
                    email: owner.email,
                    username: owner.username,
                    avatar: owner.avatar,
                    role: owner.role,
                })

            } else {
                res.status(StatusCodes.BAD_REQUEST).json({
                    status: 'failure',
                    msg: 'گذرواژه نادرست است',
                })
            }
        }
        else {
            res.status(StatusCodes.NOT_FOUND).json({
                status: 'failure',
                msg: 'کاربر یافت نشد, ثبت نام کنید',
            })
        }
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            msg: 'خطای داخلی سرور',
            error,
        })
    }
}



exports.sendOtp = async (req, res) => {
    try {
        let { phone } = req.body
        let owner = await Owner.findOne({ phone })

        if (owner) {
            await sendOTPCode(phone, owner, req, res)
        }
        else {
            res.status(StatusCodes.BAD_REQUEST).json({
                msg: "کاربر یافت نشد",
            })
        }
    } catch (error) {
        console.error(error.message);
        // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        //   status: 'failure',
        //   msg: "خطای داخلی سرور",
        //   error
        // });
    }
}

exports.verifyOtp = async (req, res) => {
    try {
        let { phone, code } = req.body

        let ownerOtp = await OTP.findOne({ phone })
        let owner = await Owner.findOne({ phone })

        if (ownerOtp.code === code) {
            createSendToken(owner, StatusCodes.OK, 'success', 'کد تایید با موفقیت ارسال شد', req, res)
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({
                msg: "کد وارد شده اشتباه است!"
            })
        }
    } catch (error) {
        console.error(error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            msg: "خطای داخلی سرور",
            error
        });
    }
}

exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ status: 'success' });
};


exports.forgotPassword = async (req, res) => {
    try {
        console.log(req.body.email);
        
        let owner = await Owner.findOne({ email: req.body.email });
    
        if (!owner) {
            return res.status(404).json({ msg: 'چنین ایمیلی وجود ندارد' });
        }
    
        if (owner.token) { 
            owner.token = "";
            await owner.save();
            // return res.status(400).json({ msg: 'توکن قبلی باطل شد، لطفا دوباره تلاش کنید' });
        }else{
            const newToken = crypto.randomBytes(32).toString('hex');
            const hashedToken = await bcrypt.hash(newToken, 12);
        
            const link = `${process.env.currentURL}/owners/reset-password?token=${encodeURIComponent(newToken)}&ownerId=${encodeURIComponent(owner._id)}`;
            sendEmail(owner, link);
        
            owner.token = hashedToken;
            const saved = await owner.save();
        
            if (saved) {
                return res.status(200).json({ msg: 'لطفا ایمیل خود را بررسی کنید' });
            }
        
            return res.status(500).json({ msg: 'مشکلی در ذخیره‌سازی اطلاعات پیش آمد' });
        }
    
    
    } catch (error) {
        console.log(error);
        return res.status(403).json({
            msg: 'خطایی وجود دارد، دوباره امتحان کنید',
            error,
            msgCode: 3
        });
    }
    
}

exports.resetPassword = async (req, res) => {
    let { ownerId, token, password, confirmPassword } = req.body

    let findOwner = await Owner.findOne({ _id: ownerId })
    passwordResetToken = findOwner.token

    if (!passwordResetToken) {
        throw new Error('Invalid or expired password reset token')
    }

    const isValid = await bcrypt.compare(token, passwordResetToken)

    if (!isValid) {
        throw new Error('Invalid or expired password reset token')
    }

    if (password === confirmPassword) {
        const hash = await bcrypt.hash(password, 12)

        await Owner.findByIdAndUpdate(ownerId, {
            password: hash,
            token: ""
        }, { new: true }).then((data) => {
            if (data) {
                res.status(StatusCodes.OK).json({
                    msg: 'گذرواژه با موفقیت تغییر کرد',
                })
            }
        }).catch(err => {
            console.log(err)
            res.status(StatusCodes.BAD_REQUEST).json({ msg: 'خطایی وجود دارد', err })
        })

        let link = `${process.env.currentURL}/owners/login`
        sendSuccessEmail(findOwner, link)
    }
}