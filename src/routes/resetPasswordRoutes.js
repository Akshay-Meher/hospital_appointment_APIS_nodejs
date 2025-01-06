const express = require('express');
const checkValidationMidd = require('../middleware/checkValidationMiddleware');
const { resetPassword } = require('../controllers/resetPasswordController');
const { resetRules } = require('../validations/authValidation');

const router = express.Router();

router.post('/', resetRules, checkValidationMidd, resetPassword);

module.exports = router;