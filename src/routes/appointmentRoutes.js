const express = require('express');
const { appointmentRules, getAppointmentsRules, confirmAppointmentRules } = require('../validations/authValidation');
const checkValidationMidd = require('../middleware/checkValidationMiddleware');
const { bookAppointment, getAppointments } = require('../controllers/appointments/appointmentsController');
const isLoginMiddleware = require('../middleware/isLoginMiddleware');
const { confirmAppointment } = require('../controllers/appointments/confirmAppointmentController');
const { cancelAppointment } = require('../controllers/appointments/cancelAppointmentController');

const router = express.Router();

router.post('/book', appointmentRules, checkValidationMidd, isLoginMiddleware, bookAppointment);

router.post('/confirm', confirmAppointmentRules, checkValidationMidd, isLoginMiddleware, confirmAppointment);

router.post('/cancle', confirmAppointmentRules, checkValidationMidd, isLoginMiddleware, cancelAppointment);

router.get('/get-details', getAppointmentsRules, checkValidationMidd, getAppointments)


module.exports = router;