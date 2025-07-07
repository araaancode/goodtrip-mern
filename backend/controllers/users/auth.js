const crypto = require("crypto");
const { promisify } = require("util");
const randKey = require("random-key");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const Token = require("../../models/Token");
const OTP = require("../../models/OTP");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const { sendEmail, sendSuccessEmail } = require("../../utils/sendMail");
const sendOTPUtil = require("../../utils/sendOTP");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const sendOTPCode = async (phone, user, req, res) => {
  const code = randKey.generateDigits(5);
  let otp = await OTP.findOne({ phone });

  if (otp) {
    otp.code = code;
    otp
      .save()
      .then((data) => {
        if (data) {
          sendOTPUtil(otp.code, phone);
          res.status(StatusCodes.CREATED).json({
            msg: "کد تایید ارسال شد",
            data,
          });
        }
      })
      .catch((error) => {
        console.log(error);

        res.status(StatusCodes.BAD_REQUEST).json({
          msg: "کد تایید ارسال نشد",
          error,
        });
      });
  } else {
    let newOtp = await OTP.create({
      phone: phone,
      code,
    });

    if (newOtp) {
      sendOTPUtil(newOtp.code, phone);

      res.status(StatusCodes.CREATED).json({
        msg: "کد تایید جدید ساخته شد",
        code: newOtp,
      });
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({
        msg: "کد تایید ساخته نشد",
      });
    }
  }
};

const createSendToken = (user, statusCode, statusMsg, msg, req, res) => {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: statusMsg,
    msg,
    token,
    data: {
      user,
    },
  });
};

exports.register = async (req, res, next) => {
  try {
    let { name, username, phone, email, password } = req.body;

    if (!name || !username || !phone || !email || !password) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: "fail",
        msg: "همه فیلدها باید وارد شوند!",
      });
    } else {
      let findUser = await User.findOne({ phone: req.body.phone });

      if (findUser) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: "fail",
          msg: "کاربر وجود دارد. وارد سایت شوید!",
        });
      } else {
        let newUser = await User.create({
          name: req.body.name,
          username: req.body.username,
          phone: req.body.phone,
          email: req.body.email,
          password: req.body.password,
        });

        if (newUser) {
          res.status(StatusCodes.CREATED).json({
            status: "success",
            msg: "کاربر با موفقیت ثبت نام شد",
            _id: newUser._id,
            name: newUser.name,
            phone: newUser.phone,
            email: newUser.email,
            username: newUser.username,
            avatar: newUser.avatar,
            role: newUser.role,
          });
        }
      }
    }
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "fail",
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    if (!req.body.phone || !req.body.password) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ status: "fail", msg: "لطفا همه فیلدها را وارد کنید" });
    }

    let user = await User.findOne({ phone: req.body.phone });

    if (user) {
      if (await user.matchPassword(req.body.password)) {
        res.status(200).json({
          status: "success",
          msg: "کاربر با موفقیت وارد سایت شد",
          _id: user._id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
          role: user.role,
        });
      } else {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: "fail",
          msg: "گذرواژه نادرست است",
        });
      }
    } else {
      res.status(StatusCodes.NOT_FOUND).json({
        status: "fail",
        msg: "کاربر یافت نشد, ثبت نام کنید",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "fail",
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

exports.sendOtp = async (req, res) => {
  try {
    let { phone } = req.body;
    let user = await User.findOne({ phone });

    if (user) {
      await sendOTPCode(phone, user, req, res);
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({
        msg: "کاربر یافت نشد",
      });
    }
  } catch (error) {
    console.error(error.message);
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    //   status: 'fail',
    //   msg: "خطای داخلی سرور",
    //   error
    // });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    let { phone, code } = req.body;

    let userOtp = await OTP.findOne({ phone });
    let user = await User.findOne({ phone });

    if (userOtp.code === code) {
      createSendToken(
        user,
        StatusCodes.OK,
        "success",
        "کد تایید با موفقیت ارسال شد",
        req,
        res
      );
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({
        msg: "کد وارد شده اشتباه است!",
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "fail",
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

exports.forgotPassword = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (user) {
      let token = user.token;

      if (token) {
        user.token = "";
        await user.save();
      } else {
        let newToken = crypto.randomBytes(32).toString("hex"); // raw token
        let hashedToken = await bcrypt.hash(newToken, 12); // cooked token

        let link = `${process.env.currentURL}/reset-password?token=${newToken}&userId=${user._id}`;
        sendEmail(user, link);

        user.token = hashedToken;
        await user
          .save()
          .then((data) => {
            if (data) {
              res.status(201).json({ msg: "لطفا ایمیل خود را بررسی کنید" });
            }
          })
          .catch((err) => {
            res.status(403).json({ msg: "مشکل در فرستادن ایمیل", err });
          });
      }
    } else {
      res.status(404).json({
        msg: "چنین ایمیلی وجود ندارد",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(403).json({
      msg: "خطایی وجود دارد، دوباره امتحان کنید",
      error,
      msgCode: 3,
    });
  }
};

exports.resetPassword = async (req, res) => {
  let { userId, token, password, confirmPassword } = req.body;

  let findUser = await User.findOne({ _id: userId });
  passwordResetToken = findUser.token;

  if (!passwordResetToken) {
    throw new Error("Invalid or expired password reset token");
  }

  const isValid = await bcrypt.compare(token, passwordResetToken);

  if (!isValid) {
    throw new Error("Invalid or expired password reset token");
  }

  if (password === confirmPassword) {
    const hash = await bcrypt.hash(password, 12);

    await User.findByIdAndUpdate(
      userId,
      {
        password: hash,
        token: "",
      },
      { new: true }
    )
      .then((data) => {
        if (data) {
          res.status(StatusCodes.OK).json({
            msg: "گذرواژه با موفقیت تغییر کرد",
          });
        }
      })
      .catch((err) => {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ msg: "خطایی وجود دارد", err });
      });

    let link = `${process.env.currentURL}/login`;
    sendSuccessEmail(findUser, link);
  }
};
