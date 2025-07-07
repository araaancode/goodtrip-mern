const express = require("express")

const router = express()

const cookAuthCtrls = require("../../controllers/cooks/auth")

router.get('/logout', cookAuthCtrls.logout)
router.post('/login', cookAuthCtrls.login)
router.post('/register', cookAuthCtrls.register)

router.post('/send-otp', cookAuthCtrls.sendOtp);
router.post('/verify-otp', cookAuthCtrls.verifyOtp);

router.post('/forgot-password', cookAuthCtrls.forgotPassword)
router.post('/reset-password', cookAuthCtrls.resetPassword)


module.exports = router