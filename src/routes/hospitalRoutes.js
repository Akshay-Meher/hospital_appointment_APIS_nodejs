const express = require('express');
const { appointmentRules, getAppointmentsRules, confirmAppointmentRules, validateHospitalData, validateHospitalDataUpdate } = require('../validations/authValidation');
const checkValidationMidd = require('../middleware/checkValidationMiddleware');
const isLoginMiddleware = require('../middleware/isLoginMiddleware');

const { createHospital, getAllHospitals, getHospitalById, updateHospital, deleteHospital } = require('../controllers/hostpital/hospitalController');
const isAdminLoginMiddleware = require('../middleware/isAdminLoginMiddleware');
const { addDoctorToHosital, getAllDoctorsFromHospital } = require('../controllers/hostpital/addDoctorsInHospital');


const router = express.Router();

/**
 * @swagger
 * /hospital/create:
 *   post:
 *     tags:
 *       - Hospital  # Adding the Hospital tag
 *     summary: Create a new hospital record
 *     description: This endpoint allows the creation of a new hospital record with details such as name, address, contact number, specializations, capacity, and available beds.
 *     security:
 *       - BearerAuth: []  # Assumes Bearer JWT token for authentication
 *     requestBody:
 *       required: true
 *       content:
 *        application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hospital_name:
 *                 type: string
 *                 description: The name of the hospital.
 *                 example: "City Hospital"
 *               address:
 *                 type: string
 *                 description: The address of the hospital.
 *                 example: "123 Main Street, Springfield"
 *               contact_number:
 *                 type: string
 *                 description: The contact number of the hospital.
 *                 example: "+1234567890"
 *               specializations:
 *                 type: string
 *                 description: The specializations offered by the hospital.
 *                 example: "Cardiology, Neurology, Orthopedics"
 *               capacity:
 *                 type: integer
 *                 description: The total capacity of the hospital in terms of beds.
 *                 example: 150
 *               available_beds:
 *                 type: integer
 *                 description: The number of currently available beds in the hospital.
 *                 example: 25
 *     responses:
 *       201:
 *         description: Successfully created the hospital record
 *         content:
 *          application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message for hospital creation.
 *                   example: "Hospital registered successfully."
 *                 hospital:
 *                   type: object
 *                   description: Details of the created hospital.
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The ID of the hospital.
 *                       example: 1
 *                     hospital_name:
 *                       type: string
 *                       description: The name of the hospital.
 *                       example: "City Hospital"
 *                     address:
 *                       type: string
 *                       description: The address of the hospital.
 *                       example: "123 Main Street, Springfield"
 *                     contact_number:
 *                       type: string
 *                       description: The contact number of the hospital.
 *                       example: "+1234567890"
 *                     specializations:
 *                       type: string
 *                       description: The specializations offered by the hospital.
 *                       example: "Cardiology, Neurology, Orthopedics"
 *                     capacity:
 *                       type: integer
 *                       description: The total capacity of the hospital in terms of beds.
 *                       example: 150
 *                     available_beds:
 *                       type: integer
 *                       description: The number of currently available beds in the hospital.
 *                       example: 25
 *       400:
 *         description: Bad request due to missing or invalid parameters
 *       500:
 *         description: Internal server error
 */

router.post('/create', validateHospitalData, checkValidationMidd, createHospital);


/**
 * @swagger
 * /hospital/getAll:
 *   get:
 *     tags:
 *       - Hospital  # Adding the Hospital tag
 *     summary: Retrieve all hospitals
 *     description: Fetches a list of all hospitals that are not marked as deleted.
 *     security:
 *       - BearerAuth: []  # Assumes Bearer JWT token for authentication
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of hospitals
 *         content:
 *          application/x-www-form-urlencoded:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The ID of the hospital.
 *                     example: 1
 *                   hospital_name:
 *                     type: string
 *                     description: The name of the hospital.
 *                     example: "City Hospital"
 *                   address:
 *                     type: string
 *                     description: The address of the hospital.
 *                     example: "123 Main Street, Springfield"
 *                   contact_number:
 *                     type: string
 *                     description: The contact number of the hospital.
 *                     example: "+1234567890"
 *                   specializations:
 *                     type: string
 *                     description: The specializations offered by the hospital.
 *                     example: "Cardiology, Neurology, Orthopedics"
 *                   capacity:
 *                     type: integer
 *                     description: The total capacity of the hospital in terms of beds.
 *                     example: 150
 *                   available_beds:
 *                     type: integer
 *                     description: The number of currently available beds in the hospital.
 *                     example: 25
 *       500:
 *         description: Internal server error
 */

router.get('/getAll', getAllHospitals);

/**
 * @swagger
 * /hospital/{id}:
 *   get:
 *     tags:
 *       - Hospital  # Adding the Hospital tag
 *     summary: Retrieve a hospital by ID
 *     description: Fetches the details of a specific hospital by its ID, if not marked as deleted.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the hospital to retrieve.
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - BearerAuth: []  # Assumes Bearer JWT token for authentication
 *     responses:
 *       200:
 *         description: Successfully retrieved the hospital details
 *         content:
 *          application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the hospital.
 *                   example: 1
 *                 hospital_name:
 *                   type: string
 *                   description: The name of the hospital.
 *                   example: "City Hospital"
 *                 address:
 *                   type: string
 *                   description: The address of the hospital.
 *                   example: "123 Main Street, Springfield"
 *                 contact_number:
 *                   type: string
 *                   description: The contact number of the hospital.
 *                   example: "+1234567890"
 *                 specializations:
 *                   type: string
 *                   description: The specializations offered by the hospital.
 *                   example: "Cardiology, Neurology, Orthopedics"
 *                 capacity:
 *                   type: integer
 *                   description: The total capacity of the hospital in terms of beds.
 *                   example: 150
 *                 available_beds:
 *                   type: integer
 *                   description: The number of currently available beds in the hospital.
 *                   example: 25
 *       404:
 *         description: Hospital not found
 *         content:
 *          application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hospital not found"
 *       500:
 *         description: Internal server error
 */

router.get('/:id', getHospitalById);


/**
 * @swagger
 * /hospital/update/{id}:
 *   patch:
 *     tags:
 *       - Hospital  # Adding the Hospital tag
 *     summary: Update hospital details
 *     description: Updates the details of a hospital by its ID, if the hospital is not marked as deleted.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the hospital to update.
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *        application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               hospital_name:
 *                 type: string
 *                 description: The name of the hospital.
 *                 example: "Updated City Hospital"
 *               address:
 *                 type: string
 *                 description: The address of the hospital.
 *                 example: "456 Elm Street, Springfield"
 *               contact_number:
 *                 type: string
 *                 description: The contact number of the hospital.
 *                 example: "+1234567891"
 *               specializations:
 *                 type: string
 *                 description: The specializations offered by the hospital.
 *                 example: "Cardiology, Neurology"
 *               capacity:
 *                 type: integer
 *                 description: The total capacity of the hospital in terms of beds.
 *                 example: 200
 *               available_beds:
 *                 type: integer
 *                 description: The number of currently available beds in the hospital.
 *                 example: 50
 *     security:
 *       - BearerAuth: []  # Assumes Bearer JWT token for authentication
 *     responses:
 *       200:
 *         description: Successfully updated the hospital details
 *         content:
 *          application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hospital updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The ID of the updated hospital.
 *                       example: 1
 *                     hospital_name:
 *                       type: string
 *                       description: The updated name of the hospital.
 *                       example: "Updated City Hospital"
 *                     address:
 *                       type: string
 *                       description: The updated address of the hospital.
 *                       example: "456 Elm Street, Springfield"
 *                     contact_number:
 *                       type: string
 *                       description: The updated contact number.
 *                       example: "+1234567891"
 *                     specializations:
 *                       type: string
 *                       description: The updated specializations.
 *                       example: "Cardiology, Neurology"
 *                     capacity:
 *                       type: integer
 *                       description: The updated capacity.
 *                       example: 200
 *                     available_beds:
 *                       type: integer
 *                       description: The updated number of available beds.
 *                       example: 50
 *       404:
 *         description: Hospital not found
 *         content:
 *          application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hospital not found"
 *       400:
 *         description: Validation error
 *         content:
 *          application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation error: Invalid data"
 *       500:
 *         description: Internal server error
 */

router.patch('/update/:id', validateHospitalDataUpdate, checkValidationMidd, updateHospital);



/**
 * @swagger
 *  /hospital/delete/{id}:
 *   delete:
 *     tags:
 *       - Hospital  # Adding the Hospital tag
 *     summary: Soft delete a hospital
 *     description: Marks a hospital as deleted by setting the `is_deleted` flag to `true`.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the hospital to delete.
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - BearerAuth: []  # Assumes Bearer JWT token for authentication
 *     responses:
 *       200:
 *         description: Successfully marked the hospital as deleted.
 *         content:
 *          application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hospital deleted successfully."
 *       404:
 *         description: Hospital not found
 *         content:
 *          application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hospital not found"
 *       500:
 *         description: Internal server error
 *         content:
 *          application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

router.delete('/delete/:id', deleteHospital);


router.post('/add-doctors', isAdminLoginMiddleware, addDoctorToHosital);

router.get('/getAllDoctors/:id', getAllDoctorsFromHospital);

module.exports = router;