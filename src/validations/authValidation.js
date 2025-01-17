const { body } = require('express-validator');
const { fieldRequired, exceedChar, invalidFormate, passwordFormate, onlyDigits, between10_to15, validGender, validDateFormat, cannotInFuture, mustPresentOrFuture, timeFormate, appDate, appTimeErr, cannotExeed255char, years_of_experience, statusFormat, doctorOrPatient, OTP } = require('../utils/responseMessages');
const { nameValidation, lastNameValidation, emailValidation, passwordValidation, phoneValidation, genderValidation, dobValidation, optionalNameValidation, optionalLastNameValidation, optionalEmailValidation, optionalPhoneValidation, optionalGenderValidation, optionalDOBValidation, optionalAddressValidation, appointment_dateValidatoin, appointment_timeValidation, user_idRules, roleRules, tokenRules } = require('./commonValidations');

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


const saveTokenRules = [user_idRules, roleRules, tokenRules];

const getTokenRules = [user_idRules, roleRules];

// Hospital 

const validateHospitalData = [
    // body('specializations')
    //     .notEmpty().withMessage('Specializations cannot be empty')
    //     .custom(value => {
    //         return value.every(item => typeof item === 'string');
    //     }).withMessage('Each specialization must be a string'),
    body('hospital_name')
        .notEmpty().withMessage('Hospital name is required'),

    body('address')
        .notEmpty().withMessage('Address is required'),

    body('contact_number')
        .matches(/^\+?[0-9]{7,15}$/).withMessage('Contact number must be a valid phone number'),
    body('capacity')
        .isInt({ min: 0 }).withMessage('Capacity must be a positive integer'),

    body('available_beds')
        .isInt({ min: 0 }).withMessage('Available beds must be a positive integer')
        .custom((value, { req }) => {
            console.log("req.body.capacity", req.body.capacity);
            console.log("req.body.capacity", value);
            const capacity = parseInt(req.body.capacity, 10);
            const availableBeds = parseInt(value, 10);
            if (availableBeds > capacity) {
                throw new Error('Available beds cannot exceed hospital capacity');
            }
            return true;
        })
];

const validateHospitalDataUpdate = [
    body('specializations')
        .optional()
        .isArray().withMessage('Specializations must be an array')
        .notEmpty().withMessage('Specializations cannot be empty')
        .custom(value => {
            return value.every(item => typeof item === 'string');
        }).withMessage('Each specialization must be a string'),

    body('hospital_name')
        .optional()
        .notEmpty().withMessage('Hospital name is required'),

    body('address')
        .optional()
        .notEmpty().withMessage('Address is required'),

    body('contact_number')
        .optional()
        .matches(/^\+?[0-9]{7,15}$/).withMessage('Contact number must be a valid phone number'),

    body('capacity')
        .optional()
        .isInt({ min: 0 }).withMessage('Capacity must be a positive integer'),

    body('available_beds')
        .optional()
        .isInt({ min: 0 }).withMessage('Available beds must be a positive integer')
        .custom((value, { req }) => {
            if (value > req.body.capacity) {
                throw new Error('Available beds cannot exceed hospital capacity');
            }
            return true;
        })
];


module.exports = {
    resetRules, loginPatientRules, validatePatient, validateDoctor, appointmentRules, saveTokenRules, getTokenRules,
    getAppointmentsRules, confirmAppointmentRules, verifyOTPRules, verifyOTPLenght, updatePatientRules, validateHospitalData,
    validateHospitalDataUpdate
};