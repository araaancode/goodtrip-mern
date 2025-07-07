const express = require("express")

const router = express()

const ownerAuthCtrls = require("../../controllers/owners/auth")

router.post('/login', ownerAuthCtrls.login)
router.post('/register', ownerAuthCtrls.register)
router.get('/logout', ownerAuthCtrls.logout)

router.post('/send-otp', ownerAuthCtrls.sendOtp);
router.post('/verify-otp', ownerAuthCtrls.verifyOtp);

router.post('/forgot-password', ownerAuthCtrls.forgotPassword)
router.post('/reset-password', ownerAuthCtrls.resetPassword)


module.exports = router