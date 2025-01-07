const express = require('express');
const { loginPatientRules, validateDoctor } = require('../validations/authValidation');
const checkValidationMidd = require('../middleware/checkValidationMiddleware');
const { registerDoctor, loginDoctor, getAllDoctors } = require('../controllers/doctor/doctorController');
const { checkDoctorExist } = require('../middleware/patientExistMiddleware');
const isLoginMiddleware = require('../middleware/isLoginMiddleware');


const router = express.Router();

/**
 * @swagger
 * /doctor/register:
 *   post:
 *     summary: Register a new doctor
 *     description: Registers a new doctor by providing necessary details like name, email, password, etc.
 *     tags:
 *       - Doctor
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John
 *                 description: The first name of the doctor.
 *               last_name:
 *                 type: string
 *                 example: Doe
 *                 description: The last name of the doctor.
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *                 description: The email of the doctor.
 *               password:
 *                 type: string
 *                 example: securePassword123
 *                 description: The password for the doctor's account.
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *                 description: The phone number of the doctor.
 *               gender:
 *                 type: string
 *                 example: Male
 *                 description: The gender of the doctor.
 *               specialization:
 *                 type: string
 *                 example: Cardiologist
 *                 description: The specialization of the doctor.
 *               license_number:
 *                 type: string
 *                 example: LIC-123456789
 *                 description: The medical license number of the doctor.
 *               years_of_experience:
 *                 type: integer
 *                 example: 10
 *                 description: The number of years of experience the doctor has.
 *     responses:
 *       201:
 *         description: Successfully registered the doctor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: CREATED
 *                 message:
 *                   type: string
 *                   example: Doctor registered successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: John
 *                     last_name:
 *                       type: string
 *                       example: Doe
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *                     phone:
 *                       type: string
 *                       example: "+1234567890"
 *                     gender:
 *                       type: string
 *                       example: Male
 *                     specialization:
 *                       type: string
 *                       example: Cardiologist
 *                     license_number:
 *                       type: string
 *                       example: LIC-123456789
 *                     years_of_experience:
 *                       type: integer
 *                       example: 10
 *       400:
 *         description: Validation errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: BAD_REQUEST
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         example: email
 *                       message:
 *                         type: string
 *                         example: Invalid email format
 *       409:
 *         description: Doctor already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: CONFLICT
 *                 message:
 *                   type: string
 *                   example: Doctor with this email already exists
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: INTERNAL_SERVER_ERROR
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

router.post('/register', validateDoctor, checkValidationMidd, checkDoctorExist, registerDoctor);


/**
 * @swagger
 * /doctor/login:
 *   post:
 *     summary: Doctor login
 *     description: Allows a doctor to log in with their email and password.
 *     tags:
 *       - Doctor
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: doctor@example.com
 *                 description: The email of the doctor.
 *               password:
 *                 type: string
 *                 example: securePassword123
 *                 description: The password of the doctor.
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 message:
 *                   type: string
 *                   example: Doctor logged in successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: "jwt-token-example"
 *       400:
 *         description: Validation errors (e.g., missing email or password)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: BAD_REQUEST
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         example: email
 *                       message:
 *                         type: string
 *                         example: Email is required
 *       401:
 *         description: Unauthorized (invalid email or password)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: UNAUTHORIZED
 *                 message:
 *                   type: string
 *                   example: Invalid credentials
 *       404:
 *         description: Doctor not found (email does not exist)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: NOT_FOUND
 *                 message:
 *                   type: string
 *                   example: Doctor with this email not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: INTERNAL_SERVER_ERROR
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

router.post('/login', loginPatientRules, checkValidationMidd, loginDoctor);

/**
 * @swagger
 * /doctor/getAll:
 *   get:
 *     summary: Get all doctors
 *     description: Retrieves a list of all doctors that are not deleted.
 *     tags:
 *       - Doctor
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved list of doctors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 message:
 *                   type: string
 *                   example: Doctors retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Dr. John Doe"
 *                       last_name:
 *                         type: string
 *                         example: "Doe"
 *                       email:
 *                         type: string
 *                         example: "doctor@example.com"
 *                       phone:
 *                         type: string
 *                         example: "+1234567890"
 *                       gender:
 *                         type: string
 *                         example: "Male"
 *                       specialization:
 *                         type: string
 *                         example: "Cardiology"
 *                       license_number:
 *                         type: string
 *                         example: "ABC123456"
 *                       years_of_experience:
 *                         type: integer
 *                         example: 10
 *       401:
 *         description: Unauthorized access (if the user is not logged in or does not have access)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: UNAUTHORIZED
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: INTERNAL_SERVER_ERROR
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

router.get('/getAll', isLoginMiddleware, getAllDoctors);

module.exports = router;