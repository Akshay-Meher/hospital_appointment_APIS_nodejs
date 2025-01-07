const express = require('express');
const checkValidationMidd = require('../middleware/checkValidationMiddleware');
const { resetPassword } = require('../controllers/resetPasswordController');
const { resetRules } = require('../validations/authValidation');

const router = express.Router();

/**
 * @swagger
 * /reset-password:
 *   post:
 *     tags:
 *       - reset/password  # Adding the tag here
 *     summary: Reset password for patient or doctor
 *     description: This endpoint allows a patient or doctor to reset their password by providing the email, old password, and new password.
 *     security:
 *       - BearerAuth: []  # Assumes Bearer JWT token for authentication
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
 *                 description: The email address of the user whose password is being reset.
 *               old_password:
 *                 type: string
 *                 description: The user's current password to verify identity.
 *               new_password:
 *                 type: string
 *                 description: The new password that the user wants to set.
 *               role:
 *                 type: string
 *                 enum: ['patient', 'doctor']
 *                 description: The role of the user (either 'patient' or 'doctor').
 *     responses:
 *       200:
 *         description: Successfully updated the password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password updated successfully
 *       400:
 *         description: Bad request due to missing or incorrect parameters.
 *       401:
 *         description: Unauthorized due to incorrect old password.
 *       404:
 *         description: User not found for the provided email.
 *       500:
 *         description: Internal server error.
 */



router.post('/', resetRules, checkValidationMidd, resetPassword);

module.exports = router;