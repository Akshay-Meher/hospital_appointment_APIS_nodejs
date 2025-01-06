const express = require('express');
// const { register, login, resetPasswordController } = require('../controllers/authController');
const { loginPatientRules, validatePatient, updatePatientRules } = require('../validations/authValidation');
const checkValidationMidd = require('../middleware/checkValidationMiddleware');
const { registerPatient, loginPatient, getAllPatient, updatePatient } = require('../controllers/patient/patientController');
const { checkPatientExist } = require('../middleware/patientExistMiddleware');
const isLoginMiddleware = require('../middleware/isLoginMiddleware');

const router = express.Router();

router.post('/register', validatePatient, checkValidationMidd, checkPatientExist, registerPatient);

router.post('/login', loginPatientRules, checkValidationMidd, loginPatient);

router.put('/update', updatePatientRules, checkValidationMidd, isLoginMiddleware, updatePatient)

router.get('/getAll', isLoginMiddleware, getAllPatient);


module.exports = router;