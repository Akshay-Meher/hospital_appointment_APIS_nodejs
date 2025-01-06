const express = require('express');
const { sendOTP, verifyOTP } = require('../controllers/otpController');
const isLoginMiddleware = require('../middleware/isLoginMiddleware');
const { verifyOTPRules, verifyOTPLenght } = require('../validations/authValidation');
const checkValidationMidd = require('../middleware/checkValidationMiddleware');
const router = express.Router();


router.post('/send-otp', verifyOTPRules, checkValidationMidd, isLoginMiddleware, sendOTP);
router.post('/verify-otp', verifyOTPLenght, checkValidationMidd, isLoginMiddleware, verifyOTP);

module.exports = router;
