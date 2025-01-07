const express = require('express');
const { appointmentRules, getAppointmentsRules, confirmAppointmentRules } = require('../validations/authValidation');
const checkValidationMidd = require('../middleware/checkValidationMiddleware');
const { bookAppointment, getAppointments } = require('../controllers/appointments/appointmentsController');
const isLoginMiddleware = require('../middleware/isLoginMiddleware');
const { confirmAppointment } = require('../controllers/appointments/confirmAppointmentController');
const { cancelAppointment } = require('../controllers/appointments/cancelAppointmentController');

const router = express.Router();


/**
 * @swagger
 * /appointment/book:
 *   post:
 *     tags:
 *       - appointment  # Adding the appointment tag here
 *     summary: Book an appointment with a doctor
 *     description: This endpoint allows a patient to book an appointment with a doctor by providing the appointment details.
 *     security:
 *       - BearerAuth: []  # Assumes Bearer JWT token for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               patient_id:
 *                 type: integer
 *                 description: ID of the patient booking the appointment.
 *               doctor_id:
 *                 type: integer
 *                 description: ID of the doctor being booked for the appointment.
 *               appointment_date:
 *                 type: string
 *                 format: date
 *                 description: Date of the appointment (in YYYY-MM-DD format).
 *               appointment_time:
 *                 type: string
 *                 format: time
 *                 description: Time of the appointment (in HH:mm format).
 *               status:
 *                 type: string
 *                 description: Status of the appointment (e.g., 'pending', 'confirmed'). Defaults to 'pending'.
 *     responses:
 *       201:
 *         description: Appointment successfully booked
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Appointment booked successfully"
 *                 appointment:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: ID of the appointment
 *                     patient_id:
 *                       type: integer
 *                       description: ID of the patient
 *                     doctor_id:
 *                       type: integer
 *                       description: ID of the doctor
 *                     appointment_date:
 *                       type: string
 *                       format: date
 *                       description: Date of the appointment
 *                     appointment_time:
 *                       type: string
 *                       format: time
 *                       description: Time of the appointment
 *                     status:
 *                       type: string
 *                       description: Status of the appointment
 *       400:
 *         description: Bad request due to missing or incorrect parameters
 *       404:
 *         description: Patient or Doctor not found
 *       409:
 *         description: Appointment already booked for the selected time and date
 *       500:
 *         description: Internal server error
 */

router.post('/book', appointmentRules, checkValidationMidd, isLoginMiddleware, bookAppointment);

/**
 * @swagger
 * /appointment/confirm:
 *   post:
 *     tags:
 *       - appointment  # Adding the appointment tag here
 *     summary: Confirm an appointment
 *     description: This endpoint allows a doctor to confirm an appointment.
 *     security:
 *       - BearerAuth: []  # Assumes Bearer JWT token for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               appointment_id:
 *                 type: integer
 *                 description: ID of the appointment to be confirmed.
 *     responses:
 *       200:
 *         description: Appointment successfully confirmed
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Appointment confirmed successfully"
 *                 appointment:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: ID of the confirmed appointment
 *                     patient_id:
 *                       type: integer
 *                       description: ID of the patient
 *                     doctor_id:
 *                       type: integer
 *                       description: ID of the doctor
 *                     appointment_date:
 *                       type: string
 *                       format: date
 *                       description: Date of the appointment
 *                     appointment_time:
 *                       type: string
 *                       format: time
 *                       description: Time of the appointment
 *                     status:
 *                       type: string
 *                       description: Status of the appointment (e.g., 'confirmed').
 *       400:
 *         description: Bad request due to missing or incorrect parameters
 *       404:
 *         description: Appointment not found
 *       403:
 *         description: Forbidden, if the user is not a doctor or not authorized to confirm the appointment
 *       500:
 *         description: Internal server error
 */


router.post('/confirm', confirmAppointmentRules, checkValidationMidd, isLoginMiddleware, confirmAppointment);

/**
 * @swagger
 * /appointment/cancle:
 *   post:
 *     tags:
 *       - appointment  # Adding the appointment tag here
 *     summary: Cancel an appointment
 *     description: This endpoint allows a patient or doctor to cancel an appointment.
 *     security:
 *       - BearerAuth: []  # Assumes Bearer JWT token for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               appointment_id:
 *                 type: integer
 *                 description: ID of the appointment to be cancelled.
 *     responses:
 *       200:
 *         description: Appointment successfully cancelled
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Appointment cancelled successfully"
 *                 appointment:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: ID of the cancelled appointment
 *                     patient_id:
 *                       type: integer
 *                       description: ID of the patient
 *                     doctor_id:
 *                       type: integer
 *                       description: ID of the doctor
 *                     appointment_date:
 *                       type: string
 *                       format: date
 *                       description: Date of the appointment
 *                     appointment_time:
 *                       type: string
 *                       format: time
 *                       description: Time of the appointment
 *                     status:
 *                       type: string
 *                       description: Status of the appointment (e.g., 'cancelled').
 *       400:
 *         description: Bad request due to missing or incorrect parameters
 *       404:
 *         description: Appointment or Firebase token not found
 *       403:
 *         description: Forbidden if the user is not authorized to cancel the appointment
 *       500:
 *         description: Internal server error
 */

router.post('/cancle', confirmAppointmentRules, checkValidationMidd, isLoginMiddleware, cancelAppointment);

/**
 * @swagger
 * /appointment/get-details:
 *   get:
 *     tags:
 *       - appointment  # Adding the appointment tag here
 *     summary: Get appointments for patient or doctor
 *     description: This endpoint allows fetching appointment details for a specific patient or doctor, based on the provided `role` and `id`.
 *     security:
 *       - BearerAuth: []  # Assumes Bearer JWT token for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: ['patient', 'doctor']
 *                 description: The role of the user (patient or doctor).
 *               id:
 *                 type: integer
 *                 description: The ID of the user (either patient or doctor).
 *     responses:
 *       200:
 *         description: Successfully retrieved appointment details
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 role:
 *                   type: string
 *                   description: Role of the user (patient or doctor).
 *                 appointments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID of the appointment.
 *                       appointment_date:
 *                         type: string
 *                         format: date
 *                         description: Date of the appointment.
 *                       appointment_time:
 *                         type: string
 *                         format: time
 *                         description: Time of the appointment.
 *                       status:
 *                         type: string
 *                         description: Status of the appointment (e.g., 'confirmed', 'pending').
 *                       patientDetails:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             description: Name of the patient.
 *                           email:
 *                             type: string
 *                             description: Email of the patient.
 *                       doctorDetails:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             description: Name of the doctor.
 *                           email:
 *                             type: string
 *                             description: Email of the doctor.
 *       400:
 *         description: Bad request due to missing or incorrect parameters.
 *       404:
 *         description: Appointments not found for the provided user.
 *       500:
 *         description: Internal server error.
 */

router.get('/get-details', getAppointmentsRules, checkValidationMidd, getAppointments);


module.exports = router;