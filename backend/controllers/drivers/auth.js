const crypto = require('crypto');
const { promisify } = require('util');
const randKey = require("random-key");
const jwt = require('jsonwebtoken');
const Driver = require('../../models/Driver');
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

const sendOTPCode = async (phone, driver, req, res) => {
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

const createSendToken = (driver, statusCode, statusMsg, msg, req, res) => {
    const token = signToken(driver._id);

    res.cookie('jwt', token, {
        expires: new Date(
            Date.now() + 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    });

    // Remove password from output
    driver.password = undefined;

    res.status(statusCode).json({
        status: statusMsg,
        msg,
        token,
        data: {
            driver
        }
    });
};

exports.register = async (req, res, next) => {
    try {
        let { name, username, phone, email, password,firstCity,lastCity,movingDate,returingDate } = req.body

        if (!name || !username || !phone || !email || !password) {
            res.status(StatusCodes.BAD_REQUEST).json({
                status: 'failure',
                msg: "همه فیلدها باید وارد شوند!",
            })
        } else {
            let findDriver = await Driver.findOne({ phone: req.body.phone })

            if (findDriver) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    status: 'failure',
                    msg: "کاربر وجود دارد. وارد سایت شوید!",
                })
            } else {
                let newDriver = await Driver.create({
                    name: req.body.name,
                    username: req.body.username,
                    phone: req.body.phone,
                    email: req.body.email,
                    password: req.body.password,
                    firstCity: req.body.firstCity,
                    lastCity: req.body.lastCity,
                    movingDate: req.body.movingDate,
                    returningDate: req.body.returningDate,
                })

                if (newDriver) {
                    res.status(StatusCodes.CREATED).json({
                        status: 'success',
                        msg: "کاربر با موفقیت ثبت نام شد",
                        _id: newDriver._id,
                        name: newDriver.name,
                        phone: newDriver.phone,
                        email: newDriver.email,
                        username: newDriver.username,
                        avatar: newDriver.avatar,
                        role: newDriver.role,
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


        let driver = await Driver.findOne({ phone: req.body.phone })

        if (driver) {
            if (await driver.matchPassword(req.body.password)) {
                res.status(200).json({
                    status: 'success',
                    msg: 'کاربر با موفقیت وارد سایت شد',
                    _id: driver._id,
                    name: driver.name,
                    phone: driver.phone,
                    email: driver.email,
                    username: driver.username,
                    avatar: driver.avatar,
                    role: driver.role,
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
        let driver = await Driver.findOne({ phone })

        if (driver) {
            await sendOTPCode(phone, driver, req, res)
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

        let driverOtp = await OTP.findOne({ phone })
        let driver = await Driver.findOne({ phone })

        if (driverOtp.code === code) {
            createSendToken(driver, StatusCodes.OK, 'success', 'کد تایید با موفقیت ارسال شد', req, res)
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
        let driver = await Driver.findOne({ email: req.body.email })

        if (driver) {
            let token = driver.token


            if (token) {
                driver.token = ""
                await driver.save()
            } else {
                let newToken = crypto.randomBytes(32).toString('hex') // raw token
                let hashedToken = await bcrypt.hash(newToken, 12) // cooked token

                let link = `${process.env.currentURL}/drivers/reset-password?token=${newToken}&driverId=${driver._id}`
                sendEmail(driver, link)

                driver.token = hashedToken
                await driver.save().then((data) => {
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
    let { driverId, token, password, confirmPassword } = req.body

    let findDriver = await Driver.findOne({ _id: driverId })
    passwordResetToken = findDriver.token

    if (!passwordResetToken) {
        throw new Error('Invalid or expired password reset token')
    }

    const isValid = await bcrypt.compare(token, passwordResetToken)

    if (!isValid) {
        throw new Error('Invalid or expired password reset token')
    }

    if (password === confirmPassword) {
        const hash = await bcrypt.hash(password, 12)


        await Driver.findByIdAndUpdate(driverId, {
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

        let link = `${process.env.currentURL}/drivers/login`
        sendSuccessEmail(findDriver, link)

    }
}