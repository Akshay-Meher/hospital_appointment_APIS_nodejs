const express = require('express');
const { body, param } = require('express-validator');
const { giveFeedback, getFeedbacksByPatient, getFeedbacksByDoctor } = require('../controllers/feedback/doctorFeedbackController');
const { feedbackValidation, patientsFeedbacks, patientsFeedbacksValidations } = require('../validations/commonValidations');
const checkValidationMidd = require('../middleware/checkValidationMiddleware');
// const doctorFeedbackController = require('../controllers/doctorFeedbackController');

const router = express.Router();

// 1. Route to give feedback to a doctor
router.post('/give-feedback', feedbackValidation, checkValidationMidd, giveFeedback);

// 2. Route to fetch all feedbacks for a patient (with doctor info)
router.get('/patient/:patient_id', patientsFeedbacksValidations, checkValidationMidd, getFeedbacksByPatient);

// 3. Route to fetch all feedbacks for a doctor (with patient info)
router.get('/doctor/:doctor_id', [param('doctor_id').isInt().withMessage('Doctor ID must be an integer')], getFeedbacksByDoctor);

module.exports = router;
