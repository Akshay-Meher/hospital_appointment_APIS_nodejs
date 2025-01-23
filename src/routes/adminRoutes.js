const express = require('express');
const { loginPatientRules, validateAdmin, updateAdminRules } = require('../validations/authValidation');
const checkValidationMidd = require('../middleware/checkValidationMiddleware');
const { checkAdminExist } = require('../middleware/patientExistMiddleware');
const isLoginMiddleware = require('../middleware/isLoginMiddleware');
const { registerAdmin, loginAdmin, updateAdmin, passportAdminLogin } = require('../controllers/admin/adminController');
const isAdminLoginMiddleware = require('../middleware/isAdminLoginMiddleware');
const { passportAdminLoginMiddleware, checkAdminLogin } = require('../middleware/passportLoginMiddleware');
const logger = require('../utils/logger');
const { passportLoginController } = require('../controllers/passportAuthController');

const router = express.Router();


router.post('/register', validateAdmin, checkValidationMidd, checkAdminExist, registerAdmin);

// router.post('/login', loginPatientRules, checkValidationMidd, loginAdmin);
// Login
router.post('/login', loginPatientRules, checkValidationMidd, passportLoginController);

// router.patch('/update', updateAdminRules, checkValidationMidd, isAdminLoginMiddleware, updateAdmin);
router.patch('/update', updateAdminRules, checkValidationMidd, checkAdminLogin, updateAdmin);


module.exports = router;