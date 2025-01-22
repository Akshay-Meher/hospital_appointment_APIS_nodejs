const express = require('express');
const { loginPatientRules, validateAdmin, updateAdminRules } = require('../validations/authValidation');
const checkValidationMidd = require('../middleware/checkValidationMiddleware');
const { checkAdminExist } = require('../middleware/patientExistMiddleware');
const isLoginMiddleware = require('../middleware/isLoginMiddleware');
const { registerAdmin, loginAdmin, updateAdmin, passportAdminLogin } = require('../controllers/admin/adminController');
const isAdminLoginMiddleware = require('../middleware/isAdminLoginMiddleware');
const passport = require('passport');
const { passportAdminLoginMiddleware } = require('../middleware/passportLoginMiddleware');

const router = express.Router();


router.post('/register', validateAdmin, checkValidationMidd, checkAdminExist, registerAdmin);

// router.post('/login', loginPatientRules, checkValidationMidd, loginAdmin);
// Login
router.post('/login', loginPatientRules, checkValidationMidd, passportAdminLoginMiddleware);

router.patch('/update', updateAdminRules, checkValidationMidd, isAdminLoginMiddleware, updateAdmin);


module.exports = router;