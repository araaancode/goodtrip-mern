const crypto = require('crypto');
const { promisify } = require('util');
const randKey = require("random-key");
const jwt = require('jsonwebtoken');
const Admin = require('../../models/Admin');
const Token = require('../../models/Token');
const OTP = require("../../models/OTP")
const { StatusCodes } = require("http-status-codes")
const bcrypt = require("bcryptjs")
const sendOTPUtil = require("../../utils/sendOTP")


const { sendEmail, sendSuccessEmail } = require("../../utils/sendMail")


const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const sendOTPCode = async (phone, admin, req, res) => {
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

const createSendToken = (admin, statusCode, statusMsg, msg, req, res) => {
    const token = signToken(admin._id);

    res.cookie('jwt', token, {
        expires: new Date(
            Date.now() + 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    });

    // Remove password from output
    admin.password = undefined;

    res.status(statusCode).json({
        status: statusMsg,
        msg,
        token,
        data: {
            admin
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
            let findAdmin = await Admin.findOne({ phone: req.body.phone })

            if (findAdmin) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    status: 'failure',
                    msg: "ادمین وجود دارد. وارد سایت شوید!",
                })
            } else {
                let newAdmin = await Admin.create({
                    name: req.body.name,
                    username: req.body.username,
                    phone: req.body.phone,
                    email: req.body.email,
                    password: req.body.password,
                })

                if (newAdmin) {
                    res.status(StatusCodes.CREATED).json({
                        status: 'success',
                        msg: "ادمین با موفقیت ثبت نام شد",
                        _id: newAdmin._id,
                        name: newAdmin.name,
                        phone: newAdmin.phone,
                        email: newAdmin.email,
                        username: newAdmin.username,
                        avatar: newAdmin.avatar,
                        role: newAdmin.role,
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


        let admin = await Admin.findOne({ phone: req.body.phone })

        if (admin) {
            if (await admin.matchPassword(req.body.password)) {
                res.status(200).json({
                    status: 'success',
                    msg: 'ادمین با موفقیت وارد سایت شد',
                    _id: admin._id,
                    name: admin.name,
                    phone: admin.phone,
                    email: admin.email,
                    adminname: admin.adminname,
                    avatar: admin.avatar,
                    role: admin.role,
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
                msg: 'ادمین یافت نشد, ثبت نام کنید',
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
        let admin = await Admin.findOne({ phone })

        if (admin) {
            await sendOTPCode(phone, admin, req, res)
        }
        else {
            res.status(StatusCodes.BAD_REQUEST).json({
                msg: "ادمین یافت نشد",
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

        let adminOtp = await OTP.findOne({ phone })
        let admin = await Admin.findOne({ phone })

        if (adminOtp.code === code) {
            createSendToken(admin, StatusCodes.OK, 'success', 'کد تایید با موفقیت ارسال شد', req, res)
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
        let admin = await Admin.findOne({ email: req.body.email })

        if (admin) {
            let token = admin.token

            if (token) {
                admin.token = ""
                await admin.save()
            } else {
                let newToken = crypto.randomBytes(32).toString('hex') // raw token
                let hashedToken = await bcrypt.hash(newToken, 12) // cooked token

                let link = `${process.env.currentURL}/admins/reset-password?token=${newToken}&adminId=${admin._id}`
                sendEmail(admin, link)

                admin.token = hashedToken
                await admin.save().then((data) => {
                    if (data) {
                        res.status(201).json({ msg: 'لطفا ایمیل خود را بررسی کنید' })
                    }
                }).catch(err => {
                    res.status(403).json({ msg: 'مشکل در فرستادن ایمیل', err })
                })
            }
        } else {
            res.status(404).json({
                msg: 'چنین ایمیلی وجود ندارد',
            })
        }
    }

    catch (error) {
        console.log(error)
        res.status(403).json({
            msg: 'خطایی وجود دارد، دوباره امتحان کنید',
            error,
            msgCode: 3
        })
    }
}

exports.resetPassword = async (req, res) => {
    let { adminId, token, password, confirmPassword } = req.body

    let findAdmin = await Admin.findOne({ _id: adminId })
    passwordResetToken = findAdmin.token


    if (!passwordResetToken) {
        throw new Error('Invalid or expired password reset token')
    }

    const isValid = await bcrypt.compare(token, passwordResetToken)

    if (!isValid) {
        throw new Error('Invalid or expired password reset token')
    }

    if (password === confirmPassword) {
        const hash = await bcrypt.hash(password, 12)


        await Admin.findByIdAndUpdate(adminId, {
            password: hash,
            token: ""
        }, { new: true }).then((data) => {
            if (data) {
                res.status(StatusCodes.OK).json({
                    msg: 'گذرواژه با موفقیت تغییر کرد',
                })
            }
        }).catch(err => {
            res.status(StatusCodes.BAD_REQUEST).json({ msg: 'خطایی وجود دارد', err })
        })

        let link = `${process.env.currentURL}/admins/login`
        sendSuccessEmail(findAdmin, link)

    }
}