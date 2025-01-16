const express = require('express');
const checkValidationMidd = require('../middleware/checkValidationMiddleware');
const { resetRules, forgotPasswordSendToken, forgotPasswordResetRules } = require('../validations/authValidation');
const { sendForgotPasswordToken, setPassword } = require('../controllers/forgotPasswordController');

const router = express.Router();

router.post('/send-token', forgotPasswordSendToken, checkValidationMidd, sendForgotPasswordToken);
router.post('/reset/:userId/:role/:token', forgotPasswordResetRules, checkValidationMidd, setPassword);

module.exports = router;