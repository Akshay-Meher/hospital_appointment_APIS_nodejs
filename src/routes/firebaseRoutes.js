const express = require('express');
const { saveToken, getToken } = require('../controllers/firebaseController');
const { saveTokenRules, getTokenRules } = require('../validations/authValidation');
const checkValidationMidd = require('../middleware/checkValidationMiddleware');

const router = express.Router();

router.post('/save-token', saveTokenRules, checkValidationMidd, saveToken);
router.post('/get-token', getTokenRules, checkValidationMidd, getToken);

module.exports = router;