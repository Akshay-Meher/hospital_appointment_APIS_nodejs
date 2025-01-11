const express = require('express');
const { sendOTP, verifyOTP } = require('../controllers/otpController');
const isLoginMiddleware = require('../middleware/isLoginMiddleware');
const { verifyOTPRules, verifyOTPLenght, verifyLoginOTPRules, verifyLoginOTPLenght } = require('../validations/authValidation');
const checkValidationMidd = require('../middleware/checkValidationMiddleware');
const { sendLoginOTP, verifyLoginOTP } = require('../controllers/otpLoginController');
const router = express.Router();


router.post('/send-otp', verifyLoginOTPRules, checkValidationMidd, sendLoginOTP);

router.post('/verify-otp', verifyLoginOTPLenght, checkValidationMidd, verifyLoginOTP);

module.exports = router;