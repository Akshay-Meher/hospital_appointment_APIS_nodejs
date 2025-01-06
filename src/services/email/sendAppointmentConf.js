const { appointmentConfirmationTemplate } = require("../../utils/emailTemplates");
const { sendEmail } = require("./emailSender");

/**
 * Send an appointment confirmation email to the recipient.
 * 
 * @param {string} recipient - The email address of the recipient.
 * @param {string} name - The name of the recipient.
 * @param {string} date - The date of the appointment (e.g., 'March 15, 2024').
 * @param {string} time - The time of the appointment (e.g., '10:00 AM').
 * @param {string} doctor - The name of the doctor (e.g., 'Dr. Smith').
 * @returns {Promise<void>} A promise that resolves when the email is sent successfully or rejects if there is an error.
 */
const sendAppointmentConfirmation = async (recipient, name, date, time, doctor) => {

    const subject = 'Appointment Confirmation';
    const text = `Dear ${name}, your appointment with Dr. ${doctor} is confirmed for ${date} at ${time}.`;
    const html = appointmentConfirmationTemplate(name, date, time, doctor);
    await sendEmail(recipient, subject, text, html);
};

module.exports = { sendAppointmentConfirmation };
