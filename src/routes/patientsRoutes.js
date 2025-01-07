const express = require('express');
// const { register, login, resetPasswordController } = require('../controllers/authController');
const { loginPatientRules, validatePatient, updatePatientRules } = require('../validations/authValidation');
const checkValidationMidd = require('../middleware/checkValidationMiddleware');
const { registerPatient, loginPatient, getAllPatient, updatePatient } = require('../controllers/patient/patientController');
const { checkPatientExist } = require('../middleware/patientExistMiddleware');
const isLoginMiddleware = require('../middleware/isLoginMiddleware');

const router = express.Router();
const multer = require('multer');
const upload = multer();


/**
 * @swagger
 * /patient/register:
 *   post:
 *     summary: Register a new patient
 *     description: Endpoint to register a new patient with the provided details.
 *     tags:
 *       - Patients
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - last_name
 *               - email
 *               - password
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 description: First name of the patient.
 *                 example: John
 *               last_name:
 *                 type: string
 *                 description: Last name of the patient.
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the patient.
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 description: Password for the patient account.
 *                 example: P@ssw0rd
 *               phone:
 *                 type: string
 *                 description: Contact number of the patient.
 *                 example: '+1234567890'
 *               gender:
 *                 type: string
 *                 description: Gender of the patient.
 *                 example: Male
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *                 description: Date of birth of the patient.
 *                 example: 1990-01-01
 *               address:
 *                 type: string
 *                 description: Residential address of the patient.
 *                 example: 123 Main St, Springfield
 *     responses:
 *       201:
 *         description: Patient registered successfully.
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Patient registered successfully.
 *                 patient:
 *                 
 *       400:
 *         description: Invalid input, object invalid.
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid input data.
 *       500:
 *         description: Internal server error.
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */
router.post('/register', upload.none(), validatePatient, checkValidationMidd, checkPatientExist, registerPatient);


/**
 * @swagger
 * /patient/login:
 *   post:
 *     summary: Patient login
 *     description: Allows a patient to log in using their email and password.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: patient@example.com
 *                 description: The patient's email address.
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *                 description: The patient's password.
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                       description: JWT token for authentication.
 *       404:
 *         description: Patient not found
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: NOT_FOUND
 *                 message:
 *                   type: string
 *                   example: Patient with the given email not found.
 *       401:
 *         description: Unauthorized access
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: UNAUTHORIZED
 *                 message:
 *                   type: string
 *                   example: Invalid email or password.
 *       500:
 *         description: Internal server error
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: INTERNAL_SERVER_ERROR
 *                 message:
 *                   type: string
 *                   example: INTERNAL SERVER ERROR
 */

router.post('/login', loginPatientRules, checkValidationMidd, loginPatient);


/**
 * @swagger
 * /patient/update:
 *   patch:
 *     summary: Update patient details
 *     description: Updates the details of a patient. The patient must be logged in to perform this action.
 *     tags:
 *       - Patient
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *                 description: The ID of the patient to update.
 *               name:
 *                 type: string
 *                 example: John Doe
 *                 description: The name of the patient.
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *                 description: The email of the patient.
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *                 description: The phone number of the patient.
 *               address:
 *                 type: string
 *                 example: "123 Main Street, City, Country"
 *                 description: The address of the patient.
 *     responses:
 *       200:
 *         description: Successfully updated patient details
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 message:
 *                   type: string
 *                   example: Patient updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *                     phone:
 *                       type: string
 *                       example: "+1234567890"
 *                     address:
 *                       type: string
 *                       example: "123 Main Street, City, Country"
 *       400:
 *         description: Validation errors
 *         content:
 *           application/x-www-form-urlencoded:
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
 *       404:
 *         description: Patient not found
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: NOT_FOUND
 *                 message:
 *                   type: string
 *                   example: Patient not found
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: UNAUTHORIZED
 *                 message:
 *                   type: string
 *                   example: Unauthorized access
 *       500:
 *         description: Internal server error
 *         content:
 *           application/x-www-form-urlencoded:
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

router.patch('/update', updatePatientRules, checkValidationMidd, isLoginMiddleware, updatePatient);


/**
 * @swagger
 * /patient/getAll:
 *   get:
 *     summary: Get all patients
 *     description: Fetches a list of all patients who are not marked as deleted. Requires the user to be logged in.
 *     tags:
 *       - Patient
 *     requestBody:
 *       required: false
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *     responses:
 *       200:
 *         description: Successfully fetched all patients
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
 *                   example: Successfully fetched all patients
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
 *                         example: John Doe
 *                       email:
 *                         type: string
 *                         example: johndoe@example.com
 *                       phone:
 *                         type: string
 *                         example: "+1234567890"
 *                       address:
 *                         type: string
 *                         example: "123 Main Street, City, Country"
 *       401:
 *         description: Unauthorized access
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
 *                   example: Unauthorized access
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


router.get('/getAll', isLoginMiddleware, getAllPatient);


module.exports = router;