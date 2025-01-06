const express = require('express');
const { loginPatientRules, validateDoctor } = require('../validations/authValidation');
const checkValidationMidd = require('../middleware/checkValidationMiddleware');
const { registerDoctor, loginDoctor, getAllDoctors } = require('../controllers/doctor/doctorController');
const { checkDoctorExist } = require('../middleware/patientExistMiddleware');
const isLoginMiddleware = require('../middleware/isLoginMiddleware');


const router = express.Router();

router.post('/register', validateDoctor, checkValidationMidd, checkDoctorExist, registerDoctor);

router.post('/login', loginPatientRules, checkValidationMidd, loginDoctor);

router.get('/getAll', isLoginMiddleware, getAllDoctors);

module.exports = router;