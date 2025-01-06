const express = require('express');
const { appointmentRules, getAppointmentsRules, confirmAppointmentRules, validateHospitalData, validateHospitalDataUpdate } = require('../validations/authValidation');
const checkValidationMidd = require('../middleware/checkValidationMiddleware');
const isLoginMiddleware = require('../middleware/isLoginMiddleware');

const { createHospital, getAllHospitals, getHospitalById, updateHospital } = require('../controllers/hostpital/hospitalController');


const router = express.Router();

router.post('/create', validateHospitalData, checkValidationMidd, createHospital);

router.get('/getAll', getAllHospitals);

router.get('/:id', getHospitalById);

router.patch('/update/:id', validateHospitalDataUpdate, checkValidationMidd, updateHospital);

module.exports = router;