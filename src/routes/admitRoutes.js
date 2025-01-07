const express = require('express');
const { admitPatient } = require('../controllers/admit/admitPatientController');
const checkValidationMidd = require('../middleware/checkValidationMiddleware');
const { validateAdmitPatientRules } = require('../validations/authValidation');


const router = express.Router();

/**
 * @swagger
 * /admit/admitPatient:
 *   post:
 *     tags:
 *       - Admit  # Adding the Admit tag
 *     summary: Admit a patient to a hospital
 *     description: Creates an admission record for a patient, decreases the hospital's available beds by one, and links the patient with a doctor and hospital.
 *     requestBody:
 *       required: true
 *       content:
 *        application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               patient_id:
 *                 type: integer
 *                 description: The unique ID of the patient.
 *                 example: 123
 *               doctor_id:
 *                 type: integer
 *                 description: The unique ID of the doctor treating the patient.
 *                 example: 456
 *               hospital_id:
 *                 type: integer
 *                 description: The unique ID of the hospital.
 *                 example: 789
 *               admit_date:
 *                 type: string
 *                 format: date
 *                 description: The date of admission.
 *                 example: "2025-01-07"
 *               status:
 *                 type: string
 *                 description: The current status of the admission.
 *                 example: "Admitted"
 *               notes:
 *                 type: string
 *                 description: Additional notes about the admission.
 *                 example: "Patient admitted for observation."
 *     responses:
 *       201:
 *         description: Patient admitted successfully.
 *         content:
 *          application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Patient admitted successfully."
 *                 data:
 *                   type: object
 *                   description: The admission record.
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The unique ID of the admission record.
 *                       example: 1
 *                     patient_id:
 *                       type: integer
 *                       description: The ID of the patient.
 *                       example: 123
 *                     doctor_id:
 *                       type: integer
 *                       description: The ID of the doctor.
 *                       example: 456
 *                     hospital_id:
 *                       type: integer
 *                       description: The ID of the hospital.
 *                       example: 789
 *                     admit_date:
 *                       type: string
 *                       format: date
 *                       example: "2025-01-07"
 *                     status:
 *                       type: string
 *                       example: "Admitted"
 *                     notes:
 *                       type: string
 *                       example: "Patient admitted for observation."
 *       400:
 *         description: No available beds in the hospital.
 *         content:
 *          application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No available beds in the hospital."
 *       404:
 *         description: Hospital not found.
 *         content:
 *          application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hospital not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *          application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error."
 */

// console.log('validateAdmitPatient', validateAdmitPatient);
router.post('/admitPatient', admitPatient);


module.exports = router;
