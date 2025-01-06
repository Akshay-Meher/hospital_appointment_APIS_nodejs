const { body } = require('express-validator');
const { fieldRequired, exceedChar, invalidFormate, passwordFormate, onlyDigits, between10_to15, validGender, validDateFormat, cannotInFuture, mustPresentOrFuture, timeFormate, appDate, appTimeErr, cannotExeed255char, years_of_experience, statusFormat, doctorOrPatient, OTP } = require('../utils/responseMessages');
const { nameValidation, lastNameValidation, emailValidation, passwordValidation, phoneValidation, genderValidation, dobValidation, optionalNameValidation, optionalLastNameValidation, optionalEmailValidation, optionalPhoneValidation, optionalGenderValidation, optionalDOBValidation, optionalAddressValidation, appointment_dateValidatoin, appointment_timeValidation, user_idRules, roleRules, tokenRules } = require('./commonValidations');

// const nameValidation = body('name')
//     .trim()
//     .notEmpty()
//     .withMessage(fieldRequired('name'))
//     .isLength({ max: 50 })
//     .withMessage(exceedChar('name'));

// const lastNameValidation = body('last_name')
//     .trim()
//     .notEmpty()
//     .withMessage(fieldRequired('last_name'))
//     .isLength({ max: 50 })
//     .withMessage(exceedChar('last_name'));

// // Email Validation
// const emailValidation = body('email')
//     .trim()
//     .notEmpty()
//     .withMessage(fieldRequired('email'))
//     .isEmail()
//     .withMessage(invalidFormate('email'))
//     .normalizeEmail();

// // Password Validation
// const passwordValidation = body('password')
//     .trim()
//     .notEmpty().withMessage(fieldRequired('password'))
//     .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/)
//     .withMessage(passwordFormate("password"))


// // Phone Validation
// const phoneValidation = body('phone')
//     .trim()
//     .notEmpty()
//     .withMessage(fieldRequired('phone'))
//     .isNumeric()
//     .withMessage(onlyDigits("phone_number"))
//     .isLength({ min: 10, max: 15 })
//     .withMessage(between10_to15('phone_number'));

// const genderValidation = body('gender')
//     .trim()
//     .notEmpty()
//     .withMessage(fieldRequired('Gender'))
//     .isIn(['Male', 'Female', 'Other'])
//     .withMessage(validGender('Gender'));

// const dobValidation = body('date_of_birth')
//     .trim()
//     .notEmpty()
//     .withMessage(fieldRequired('date_of_birth'))
//     .isDate({ format: 'YYYY-MM-DD' })
//     .withMessage(validDateFormat('date_of_birth'))
//     .custom((value) => {
//         const today = new Date();
//         const dob = new Date(value);

//         if (dob > today) {
//             throw new Error(cannotInFuture(date_of_birth));
//         }
//         return true;
//     });


// const optionalNameValidation = body('name')
//     .trim()
//     .optional()
//     .notEmpty()
//     .withMessage(fieldRequired('name'))
//     .isLength({ max: 50 })
//     .withMessage(exceedChar('name'));

// const optionalLastNameValidation = body('last_name')
//     .trim()
//     .optional()
//     .notEmpty()
//     .withMessage(fieldRequired('last_name'))
//     .isLength({ max: 50 })
//     .withMessage(exceedChar('last_name'));

// const optionalEmailValidation = body('email')
//     .trim()
//     .notEmpty()
//     .optional()
//     .withMessage(fieldRequired('email'))
//     .isEmail()
//     .withMessage(invalidFormate('email'))
//     .normalizeEmail();

// const optionalPhoneValidation = body('phone')
//     .optional()
//     .trim()
//     .notEmpty()
//     .withMessage(fieldRequired('phone'))
//     .isNumeric()
//     .withMessage(onlyDigits("phone_number"))
//     .isLength({ min: 10, max: 15 })
//     .withMessage(between10_to15('phone_number'))


// const optionalGenderValidation = body('gender')
//     .optional()
//     .trim()
//     .notEmpty()
//     .withMessage(fieldRequired('Gender'))
//     .isIn(['Male', 'Female', 'Other'])
//     .withMessage(validGender('Gender'));

// const optionalDOBValidation = body('date_of_birth')
//     .optional()
//     .trim()
//     .notEmpty()
//     .withMessage(fieldRequired('date_of_birth'))
//     .isDate({ format: 'YYYY-MM-DD' })
//     .withMessage(validDateFormat('date_of_birth'))
//     .custom((value) => {
//         const today = new Date();
//         const dob = new Date(value);

//         if (dob > today) {
//             throw new Error(cannotInFuture(date_of_birth));
//         }
//         return true;
//     });

// const optionalAddressValidation = body('address')
//     .optional()
//     .trim()
//     .notEmpty()
//     .withMessage(fieldRequired('address'))
//     .isLength({ max: 255 })
//     .withMessage(cannotExeed255char('address'))


// const appointment_dateValidatoin = body('appointment_date')
//     .trim()
//     .notEmpty()
//     .withMessage(fieldRequired('appointment_date'))
//     .isDate({ format: 'YYYY-MM-DD' })
//     .withMessage(validDateFormat('appointment_date'))
//     .custom((value) => {
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);
//         const date_of_app = new Date(value);
//         date_of_app.setHours(0, 0, 0, 0);

//         // console.log("today", today);
//         // console.log("date_of_app", date_of_app);

//         if (date_of_app < today) {
//             throw new Error(mustPresentOrFuture('appointment_date'));
//         }
//         return true;
//     });

// const appointment_timeValidation = body('appointment_time')
//     .notEmpty()
//     .withMessage(fieldRequired('appointment_time'))
//     .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
//     .withMessage(timeFormate('appointment_time'))
//     .custom((value, { req }) => {
//         const { appointment_date } = req.body;

//         // Check if appointment_date exists and is valid
//         if (!appointment_date || !/^\d{4}-\d{2}-\d{2}$/.test(appointment_date)) {
//             throw new Error(appDate('appointment_time'));
//         }

//         const currentDate = new Date();
//         const appointmentDate = new Date(appointment_date);

//         // Normalize both dates to compare only the day
//         currentDate.setHours(0, 0, 0, 0);
//         appointmentDate.setHours(0, 0, 0, 0);

//         if (appointmentDate.getTime() === currentDate.getTime()) {
//             // Parse the time into hours and minutes
//             const [hours, minutes] = value.split(':').map(Number);
//             const appointmentDateTime = new Date();
//             appointmentDateTime.setHours(hours, minutes, 0, 0);

//             // Current time + 2 hours
//             const minimumTime = new Date();
//             minimumTime.setHours(minimumTime.getHours() + 2);

//             if (appointmentDateTime < minimumTime) {
//                 throw new Error(appTimeErr('appointment_time'));
//             }
//         }

//         return true;
//     });

// const user_idRules = body('user_id')
//     .trim()
//     .notEmpty().withMessage(fieldRequired('user_id'));

// const tokenRules = body('token')
//     .trim()
//     .notEmpty().withMessage(fieldRequired('token'));

// const roleRules = body('role')
//     .trim()
//     .notEmpty().withMessage(fieldRequired('role'))
//     .custom((value) => {
//         if (value !== 'patient' && value !== 'doctor') {
//             throw new Error(doctorOrPatient('role'));
//         }
//         return true;
//     });


const validatePatient = [
    nameValidation, lastNameValidation,
    emailValidation, passwordValidation, phoneValidation, genderValidation, dobValidation,
    // Address Validation
    body('address')
        .trim()
        .notEmpty()
        .withMessage(fieldRequired('address'))
        .isLength({ max: 255 })
        .withMessage(cannotExeed255char('address'))
];

const updatePatientRules = [optionalNameValidation, optionalLastNameValidation, optionalEmailValidation, optionalPhoneValidation,
    optionalGenderValidation, optionalDOBValidation, optionalAddressValidation,

    body('id')
        .trim()
        .notEmpty()
        .withMessage(fieldRequired('id')),

    body('password')
        .optional()
        .trim()
        .custom((vaue) => {
            throw new Error("password can't update please reset password");
        })
]



const loginPatientRules = [emailValidation, passwordValidation];


const validateDoctor = [
    nameValidation, lastNameValidation, emailValidation, passwordValidation, phoneValidation, genderValidation,
    body('specialization')
        .trim()
        .notEmpty().withMessage(fieldRequired('specialization'))
        .isLength({ min: 1 }).withMessage(fieldRequired('specialization')),

    body('license_number')
        .trim()
        .notEmpty().withMessage(fieldRequired('license_number'))
        .isLength({ min: 1 }).withMessage(fieldRequired('license_number')),

    body('years_of_experience')
        .optional()
        .trim()
        .toInt()
        .isInt({ min: 0 }).withMessage(years_of_experience('years_of_experience'))
    // .isInt().withMessage('Years of experience must be an integer')
    // .isInt({ min: 0 }).withMessage('Years of experience cannot be negative'),

];



// 
const appointmentRules = [
    body('patient_id')
        .notEmpty()
        .withMessage(fieldRequired('patient_id')),

    body('doctor_id')
        .notEmpty()
        .withMessage(fieldRequired('doctor_id')),

    appointment_dateValidatoin,
    appointment_timeValidation,
    body('status')
        .optional()
        .isIn(['Pending', 'Confirmed', 'Cancelled'])
        .withMessage(statusFormat()),
];

const confirmAppointmentRules = [
    body('appointment_id')
        .notEmpty()
        .withMessage(fieldRequired('appointment_id'))
]


const getAppointmentsRules = [
    body('id')
        .trim()
        .notEmpty().withMessage(fieldRequired('id')),

    body('role')
        .trim()
        .notEmpty().withMessage(fieldRequired('role'))
        .custom((value) => {
            if (value !== 'patient' && value !== 'doctor') {
                throw new Error(doctorOrPatient('role'));
            }
            return true;
        })
]



const resetRules = [
    body('email').isEmail().withMessage(fieldRequired('email')),
    body('old_password')
        .trim()
        .notEmpty().withMessage(fieldRequired('old_password'))
        .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/)
        .withMessage(passwordFormate("old_password")),
    body('new_password')
        .trim()
        .notEmpty().withMessage(fieldRequired('new_password'))
        .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/)
        .withMessage(passwordFormate("new_password")),
    body('role')
        .trim()
        .notEmpty().withMessage(fieldRequired('role'))
        .custom((value) => {
            if (value !== 'patient' && value !== 'doctor') {
                throw new Error(doctorOrPatient('role'));
            }
            return true;
        })
]


// email varification 

const verifyOTPRules = [body('email').isEmail().withMessage(fieldRequired('email'))];

const verifyOTPLenght = [
    body('email')
        .isEmail().withMessage(fieldRequired('email')),
    body('otp')
        .trim()
        .notEmpty().withMessage(fieldRequired('otp'))
        .isLength({ min: 6, max: 6 }).withMessage(OTP('OTP'))
];


const saveTokenRules = [user_idRules, roleRules, tokenRules]

const getTokenRules = [user_idRules, roleRules]


module.exports = {
    resetRules, loginPatientRules, validatePatient, validateDoctor, appointmentRules, saveTokenRules, getTokenRules,
    getAppointmentsRules, confirmAppointmentRules, verifyOTPRules, verifyOTPLenght, updatePatientRules
};