const express = require("express")

const router = express()

const adminAuthCtrls = require("../../controllers/admins/auth")

router.post('/login', adminAuthCtrls.login)
router.post('/register', adminAuthCtrls.register)
router.post('/forgot-password', adminAuthCtrls.forgotPassword)
router.post('/reset-password', adminAuthCtrls.resetPassword)
// router.get('/logout', adminAuthCtrls.logout)

router.post('/send-otp', adminAuthCtrls.sendOtp);
router.post('/verify-otp', adminAuthCtrls.verifyOtp);

module.exports = router