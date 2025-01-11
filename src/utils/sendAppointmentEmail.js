const { sendEmail } = require('../services/email/emailSender');
const { appointmentTemplate, otpEmailTemplate, otpLoginEmailTemplate } = require('./emailTemplates');
const logger = require('./logger'); // Assuming you have a logger utility
const { sendResponse } = require('../services/responseHandler');

/**
 * Send an appointment-related email (confirmation, booking, or cancellation) to the recipient.
 * 
 * @param {string} recipient - The email address of the recipient.
 * @param {string} name - The name of the recipient.
 * @param {string} date - The date of the appointment (e.g., 'March 15, 2024').
 * @param {string} time - The time of the appointment (e.g., '10:00 AM').
 * @param {string} doctor - The name of the doctor (e.g., 'Dr. Smith').
 * @param {string} type - The type of email ('confirmation', 'booking', 'cancellation').
 * @param {object} res - The Express response object to send the response.
 * @returns {Promise<void>} A promise that resolves when the email is sent successfully or rejects if there is an error.
 */
const sendAppointmentEmail = async (recipient, name, date, time, doctor, type, res) => {
    try {
        let subject, mainMessage;

        switch (type) {
            case 'confirmation':
                subject = 'Appointment Confirmation';
                mainMessage = `We are pleased to confirm your appointment with the details below.`;
                break;
            case 'booking':
                subject = 'Appointment Booking';
                mainMessage = `Your appointment has been successfully booked. Please find the details below.`;
                break;
            case 'cancellation':
                subject = 'Appointment Cancellation';
                mainMessage = `We regret to inform you that your appointment has been canceled. We apologize for any inconvenience caused.`;
                break;
            default:
                throw new Error('Invalid email type specified.');
        }

        const text = `Dear ${name}, ${mainMessage} Date: ${date}, Time: ${time}, Doctor: Dr. ${doctor}.`;
        const html = appointmentTemplate(subject, mainMessage, name, date, time, doctor);

        await sendEmail(recipient, subject, text, html);

        logger.info(`Email (${type}) sent successfully to ${recipient}`);
        // return sendResponse(res, "OK", null, `${type.charAt(0).toUpperCase() + type.slice(1)} email sent to ${recipient}.`);
    } catch (error) {
        logger.error(`Failed to send ${type} email to ${recipient}: ${error.message}`, { error });
        return sendResponse(res, 500, false, `Unable to send ${type} email. Please try again later.`);
    }
};



const sendOTPEmail = async (recipient, otp) => {
    const subject = 'Email Verification OTP';
    const text = `Your OTP is: ${otp}`;
    const html = otpEmailTemplate(otp);

    await sendEmail(recipient, subject, text, html);
};

const sendLoginOTPEmail = async (recipient, otp) => {
    const subject = 'Login OTP';
    const text = `Your OTP is: ${otp}`;
    const html = otpLoginEmailTemplate(otp);

    await sendEmail(recipient, subject, text, html);
};

module.exports = { sendAppointmentEmail, sendOTPEmail, sendLoginOTPEmail };























// const { sendEmail } = require('../services/email/emailSender');
// const { appointmentConfirmationTemplate } = require('./emailTemplates');
// const logger = require('../utils/logger'); // Assuming you have a logger utility
// const { sendResponse } = require('../services/responseHandler');
// // const { sendResponse } = require('../utils/responseHandler'); // Assuming you have a custom sendResponse utility

// /**
//  * Send an appointment confirmation email to the recipient.
//  *
//  * @param {string} recipient - The email address of the recipient.
//  * @param {string} name - The name of the recipient.
//  * @param {string} date - The date of the appointment (e.g., 'March 15, 2024').
//  * @param {string} time - The time of the appointment (e.g., '10:00 AM').
//  * @param {string} doctor - The name of the doctor (e.g., 'Dr. Smith').
//  * @param {object} res - The Express response object to send the response.
//  * @returns {Promise<void>} A promise that resolves when the email is sent successfully or rejects if there is an error.
//  */
// const sendAppointmentConfirmation = async (recipient, name, date, time, doctor, res) => {
//     try {
//         const subject = 'Appointment Confirmation';
//         const text = `Dear ${name}, your appointment with Dr. ${doctor} is confirmed for ${date} at ${time}.`;
//         const html = appointmentConfirmationTemplate(name, date, time, doctor);

//         await sendEmail(recipient, subject, text, html);

//         logger.info(`Email sent successfully to ${recipient}`);
//         // return sendResponse(res, "OK", null, `Appointment confirmation email sent to ${recipient}.`);
//     } catch (error) {
//         logger.error(`Failed to send appointment confirmation email to ${recipient}: ${error.message}`, { error });
//         // return sendResponse(res, 500, false, 'Unable to send appointment confirmation email. Please try again later.');
//     }
// };

// module.exports = { sendAppointmentConfirmation };
