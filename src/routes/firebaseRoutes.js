const express = require('express');
const { saveToken, getToken } = require('../controllers/firebaseController');
const { saveTokenRules, getTokenRules } = require('../validations/authValidation');
const checkValidationMidd = require('../middleware/checkValidationMiddleware');

const router = express.Router();

/**
 * @swagger
 * /firebase/save-token:
 *   post:
 *     tags:
 *       - FirebaseNotification  # Adding the FirebaseNotification tag here
 *     summary: Save Firebase token for push notifications
 *     description: This endpoint saves the Firebase token for a user to enable push notifications.
 *     security:
 *       - BearerAuth: []  # Assumes Bearer JWT token for authentication
 *     requestBody:
 *       required: true
 *       content:
 *        application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: The ID of the user to whom the Firebase token belongs.
 *                 example: 1
 *               token:
 *                 type: string
 *                 description: The Firebase token to be saved for push notifications.
 *                 example: "fcm_token_example"
 *               role:
 *                 type: string
 *                 description: The role of the user (e.g., 'patient', 'doctor').
 *                 example: "patient"
 *     responses:
 *       200:
 *         description: Firebase token successfully saved
 *         content:
 *          application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token saved successfully"
 *       400:
 *         description: Bad request due to missing or incorrect parameters
 *       500:
 *         description: Internal server error
 */
router.post('/save-token', saveTokenRules, checkValidationMidd, saveToken);


/**
 * @swagger
 * /firebase/get-token:
 *   post:
 *     tags:
 *       - FirebaseNotification  # Adding the FirebaseNotification tag here
 *     summary: Get Firebase token for push notifications
 *     description: This endpoint retrieves the Firebase token for a specific user to enable push notifications.
 *     security:
 *       - BearerAuth: []  # Assumes Bearer JWT token for authentication
 *     requestBody:
 *       required: true
 *       content:
 *        application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: The ID of the user whose Firebase token is being retrieved.
 *                 example: 1
 *               role:
 *                 type: string
 *                 description: The role of the user (e.g., 'patient', 'doctor').
 *                 example: "patient"
 *     responses:
 *       200:
 *         description: Successfully retrieved the Firebase token
 *         content:
 *          application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: The Firebase token associated with the user.
 *                   example: "fcm_token_example"
 *       400:
 *         description: Bad request due to missing or incorrect parameters
 *       404:
 *         description: Firebase token not found for the provided user and role
 *       500:
 *         description: Internal server error
 */

router.post('/get-token', getTokenRules, checkValidationMidd, getToken);

module.exports = router;