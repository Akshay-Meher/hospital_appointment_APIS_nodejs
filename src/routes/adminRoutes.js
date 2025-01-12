const express = require('express');
const { loginPatientRules, validateAdmin, updateAdminRules } = require('../validations/authValidation');
const checkValidationMidd = require('../middleware/checkValidationMiddleware');
const { checkAdminExist } = require('../middleware/patientExistMiddleware');
const isLoginMiddleware = require('../middleware/isLoginMiddleware');
const { registerAdmin, loginAdmin, updateAdmin } = require('../controllers/admin/adminController');
const isAdminLoginMiddleware = require('../middleware/isAdminLoginMiddleware');

const router = express.Router();


router.post('/register', validateAdmin, checkValidationMidd, checkAdminExist, registerAdmin);

router.post('/login', loginPatientRules, checkValidationMidd, loginAdmin);

router.patch('/update', updateAdminRules, checkValidationMidd, isAdminLoginMiddleware, updateAdmin);


module.exports = router;