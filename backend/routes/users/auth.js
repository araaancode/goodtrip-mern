const express = require("express")

const router = express()

const userAuthCtrls = require("../../controllers/users/auth")

router.post('/login', userAuthCtrls.login)
router.post('/register', userAuthCtrls.register)
router.post('/forgot-password', userAuthCtrls.forgotPassword)
router.post('/reset-password', userAuthCtrls.resetPassword)
router.get('/logout', userAuthCtrls.logout)

router.post('/send-otp', userAuthCtrls.sendOtp);
router.post('/verify-otp', userAuthCtrls.verifyOtp);


module.exports = router