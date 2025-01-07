const express = require('express');
const { sendOTP, verifyOTP } = require('../controllers/otpController');
const isLoginMiddleware = require('../middleware/isLoginMiddleware');
const { verifyOTPRules, verifyOTPLenght } = require('../validations/authValidation');
const checkValidationMidd = require('../middleware/checkValidationMiddleware');
const router = express.Router();



/**
 * @swagger
 * /email/send-otp:
 *   post:
 *     tags:
 *       - emailVerification  # Adding the emailVerification tag here
 *     summary: Send OTP for email verification
 *     description: This endpoint sends an OTP (One-Time Password) to the user's email for verification purposes.
 *     security:
 *       - BearerAuth: []  # Assumes Bearer JWT token for authentication
 *     requestBody:
 *       required: true
 *       content:
 *        application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user requesting OTP.
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *          application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OTP sent successfully"
 *       400:
 *         description: Bad request due to invalid parameters
 *       404:
 *         description: User not found with the provided email
 *       500:
 *         description: Internal server error
 */

router.post('/send-otp', verifyOTPRules, checkValidationMidd, isLoginMiddleware, sendOTP);


/**
 * @swagger
 * /email/verify-otp:
 *   post:
 *     tags:
 *       - emailVerification  # Adding the emailVerification tag here
 *     summary: Verify OTP for email verification
 *     description: This endpoint verifies the OTP (One-Time Password) sent to the user's email for email verification.
 *     security:
 *       - BearerAuth: []  # Assumes Bearer JWT token for authentication
 *     requestBody:
 *       required: true
 *       content:
 *        application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user whose OTP is being verified.
 *                 example: "user@example.com"
 *               otp:
 *                 type: string
 *                 description: The OTP sent to the user's email.
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *          application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "email verified successfully"
 *       400:
 *         description: Bad request due to invalid OTP or expired OTP
 *       404:
 *         description: User not found with the provided email or OTP
 *       500:
 *         description: Internal server error
 */


router.post('/verify-otp', verifyOTPLenght, checkValidationMidd, isLoginMiddleware, verifyOTP);

module.exports = router;
