/**
 * Generates a dynamic HTML template for email notifications about appointment actions.
 *
 * @param {string} headerTitle - The title to display in the email header (e.g., "Appointment Confirmed").
 * @param {string} mainMessage - The main message body explaining the appointment status (e.g., confirmation, cancellation).
 * @param {string} name - The name of the recipient (e.g., patient or doctor).
 * @param {string} date - The date of the appointment (in a readable format, e.g., "2025-01-06").
 * @param {string} time - The time of the appointment (e.g., "10:00 AM").
 * @param {string} doctor - The name of the doctor associated with the appointment.
 * @returns {string} - A string containing the full HTML email template.
 */
const appointmentTemplate = (headerTitle, mainMessage, name, date, time, doctor) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${headerTitle}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
            color: #333;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            background-color: #4caf50;
            color: white;
            padding: 10px 0;
            border-radius: 8px 8px 0 0;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
        }
        .content p {
            line-height: 1.6;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #777;
        }
        .footer a {
            color: #4caf50;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>${headerTitle}</h1>
        </div>
        <div class="content">
            <p>Dear ${name},</p>
            <p>${mainMessage}</p>
            <p><strong>Date:</strong> ${date}<br>
               <strong>Time:</strong> ${time}<br>
               <strong>Doctor:</strong> Dr. ${doctor}</p>
            <p>If you have any questions, please contact us.</p>
            <p>Thank you for choosing our services!</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Your Clinic. All rights reserved.</p>
            <p><a href="https://yourclinicwebsite.com">Visit our website</a></p>
        </div>
    </div>
</body>
</html>
`;


const otpEmailTemplate = (otp) => `
<!DOCTYPE html>
<html>
<head>
  <title>Verify Your Email</title>
</head>
<body>
  <p>Your OTP for email verification is: <strong>${otp}</strong></p>
  <p>This OTP is valid for 10 minutes.</p>
</body>
</html>
`;

const otpLoginEmailTemplate = (otp) => `
<!DOCTYPE html>
<html>
<head>
  <title>Login with OTP</title>
</head>
<body>
  <p>Your OTP for Login is: <strong>${otp}</strong></p>
  <p>This OTP is valid for 10 minutes.</p>
</body>
</html>
`;

module.exports = { appointmentTemplate, otpEmailTemplate, otpLoginEmailTemplate };













// const appointmentConfirmationTemplate = (name, date, time, doctor) => `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Appointment Confirmation</title>
//     <style>
//         body {
//             font-family: Arial, sans-serif;
//             margin: 0;
//             padding: 0;
//             background-color: #f9f9f9;
//             color: #333;
//         }
//         .email-container {
//             max-width: 600px;
//             margin: 20px auto;
//             background-color: #fff;
//             padding: 20px;
//             border-radius: 8px;
//             box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//         }
//         .header {
//             text-align: center;
//             background-color: #4caf50;
//             color: white;
//             padding: 10px 0;
//             border-radius: 8px 8px 0 0;
//         }
//         .header h1 {
//             margin: 0;
//             font-size: 24px;
//         }
//         .content {
//             padding: 20px;
//         }
//         .content p {
//             line-height: 1.6;
//         }
//         .footer {
//             text-align: center;
//             margin-top: 20px;
//             font-size: 12px;
//             color: #777;
//         }
//         .footer a {
//             color: #4caf50;
//             text-decoration: none;
//         }
//     </style>
// </head>
// <body>
//     <div class="email-container">
//         <div class="header">
//             <h1>Appointment Confirmation</h1>
//         </div>
//         <div class="content">
//             <p>Dear ${name},</p>
//             <p>We are pleased to confirm your appointment with <strong>Dr. ${doctor}</strong>.</p>
//             <p><strong>Date:</strong> ${date}<br>
//                <strong>Time:</strong> ${time}</p>
//             <p>If you have any questions or need to reschedule, please contact us.</p>
//             <p>Thank you for choosing our services!</p>
//         </div>
//         <div class="footer">
//             <p>&copy; ${new Date().getFullYear()} Your Clinic. All rights reserved.</p>
//             <p><a href="https://yourclinicwebsite.com">Visit our website</a></p>
//         </div>
//     </div>
// </body>
// </html>
// `;

// module.exports = { appointmentConfirmationTemplate };
