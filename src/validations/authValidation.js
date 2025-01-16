const { body } = require('express-validator');
const { fieldRequired, exceedChar, invalidFormate, passwordFormate, onlyDigits, between10_to15, validGender, validDateFormat, cannotInFuture, mustPresentOrFuture, timeFormate, appDate, appTimeErr, cannotExeed255char, years_of_experience, statusFormat, doctorOrPatient, OTP, validPhone, positiveInteger, exceedCapacity, doctorPatientOrAdmin } = require('../utils/responseMessages');
const { nameValidation, lastNameValidation, emailValidation, passwordValidation, phoneValidation, genderValidation, dobValidation, optionalNameValidation, optionalLastNameValidation, optionalEmailValidation, optionalPhoneValidation, optionalGenderValidation, optionalDOBValidation, optionalAddressValidation, appointment_dateValidatoin, appointment_timeValidation, user_idRules, roleRules, tokenRules } = require('./commonValidations');


const isDevEnv = process.env.NODE_ENV === 'development';

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

const validateAdmin = [
    body('hospital_id')
        .trim()
        .notEmpty()
        .withMessage(fieldRequired('hospital_id')),
    nameValidation, lastNameValidation, emailValidation, passwordValidation];

const updateAdminRules = [optionalNameValidation, optionalLastNameValidation, optionalEmailValidation,
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
];


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


const forgotPasswordSendToken = [emailValidation,
    body('role')
        .trim()
        .notEmpty().withMessage(fieldRequired('role'))
        .custom((value) => {
            if (value !== 'patient' && value !== 'doctor' && value !== 'admin') {
                throw new Error(doctorPatientOrAdmin('role'));
            }
            return true;
        })
];

const forgotPasswordResetRules = [
    body('password')
        .trim()
        .notEmpty().withMessage(fieldRequired('password'))
        .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/)
        .withMessage(passwordFormate("password")),
    body('confirm_password')
        .trim().notEmpty().withMessage(fieldRequired('confirm_password'))
        .custom((value, { req }) => {
            if (value !== req.body.password.trim()) {
                throw new Error("Password and confirm_password do not match.");
            }
            return true;
        })
]


// email varification 

const verifyOTPRules = [body('email').isEmail().withMessage(fieldRequired('email'))];
const verifyLoginOTPRules = [body('email').isEmail().withMessage(fieldRequired('email')), roleRules];

const verifyLoginOTPLenght = [
    body('email')
        .isEmail().withMessage(fieldRequired('email')),
    body('otp')
        .trim()
        .notEmpty().withMessage(fieldRequired('otp'))
        .isLength({ min: 6, max: 6 }).withMessage(OTP('OTP')),
    roleRules
];
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
    body('specializations')
        .notEmpty().withMessage(fieldRequired("specializations"))
        // .isArray().withMessage('specializations must be an array')
        // .custom(value => {
        //     const json = JSON.parse(value);
        //     return !Array.isArray(json);
        // }).withMessage('specializations must be an array')
        .custom(value => {

            const json = JSON.parse(value);
            if (!Array.isArray(json)) {
                throw new Error("specializations must be an array");
            }

            const isValid = json.every(item => typeof item === 'string');
            if (!isValid) {
                throw new Error("Each specialization must be a string!");
            }

            return true;
        }),
    body('hospital_name')
        .notEmpty().withMessage(fieldRequired('hospital_name')),

    body('address')
        .notEmpty().withMessage(fieldRequired('address')),

    body('contact_number')
        .matches(/^\+?[0-9]{7,15}$/).withMessage(validPhone('contact_number')),
    body('capacity')
        .isInt({ min: 0 }).withMessage(positiveInteger("capacity")),

    body('available_beds')
        .isInt({ min: 0 }).withMessage(positiveInteger('available_beds'))
        .custom((value, { req }) => {
            const capacity = parseInt(req.body.capacity, 10);
            const availableBeds = parseInt(value, 10);
            if (availableBeds > capacity) {
                throw new Error(exceedCapacity('available_beds'));
            }
            return true;
        })
];

const validateHospitalDataUpdate = [
    body('specializations')
        .optional()
        .isArray().withMessage('Specializations must be an array')
        .notEmpty().withMessage(fieldRequired("specializations"))
        .custom(value => {
            const json = JSON.parse(value);
            return json.every(item => typeof item === 'string');
        }).withMessage('Each specialization must be a string'),

    body('hospital_name')
        .optional()
        .notEmpty().withMessage(fieldRequired("hospital_name")),

    body('address')
        .optional()
        .notEmpty().withMessage(fieldRequired("address")),

    body('contact_number')
        .optional()
        .matches(/^\+?[0-9]{7,15}$/).withMessage(validPhone('contact_number')),

    body('capacity')
        .optional()
        .isInt({ min: 0 }).withMessage(positiveInteger("capacity")),

    body('available_beds')
        .optional()
        .isInt({ min: 0 }).withMessage(positiveInteger("available_beds"))
        .custom((value, { req }) => {
            const capacity = parseInt(req.body.capacity, 10);
            const availableBeds = parseInt(value, 10);
            if (availableBeds > capacity) {
                throw new Error(exceedCapacity('available_beds'));
            }
            return true;
        })
];



const validateAdmitPatientRules = [
    body('patient_id')
        .notEmpty().withMessage(fieldRequired("patient_id"))
        .isInt({ min: 1 })
        .withMessage(positiveInteger("patient_id")),
    body('doctor_id')
        .notEmpty().withMessage(fieldRequired("doctor_id"))
        .isInt({ min: 1 })
        .withMessage(positiveInteger("doctor_id")),
    body('hospital_id')
        .notEmpty().withMessage(fieldRequired("hospital_id"))
        .isInt({ min: 1 })
        .withMessage(positiveInteger("hospital_id")),
    body('admit_date')
        .trim()
        .notEmpty()
        .withMessage(fieldRequired('admit_date'))
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage(validDateFormat('admit_date')),
    body('status')
        .isLength({ min: 3 })
        .withMessage('Status must be a valid string of at least 3 characters'),
    body('notes')
        .optional()
        .trim()
        .isString()
        .withMessage('Notes must be a string if provided'),
];

const validateCreateOrder = [
    body('orderId')
        .trim()
        .notEmpty().withMessage(fieldRequired('orderId')),

    body('orderAmount')
        .notEmpty().withMessage(fieldRequired('orderAmount'))
        .isFloat({ gt: 0 }).withMessage(positiveInteger('orderAmount')),

    body('customerEmail')
        .trim()
        .notEmpty().withMessage(fieldRequired('customerEmail'))
        .isEmail().withMessage('Invalid email address'),

    body('customerPhone')
        .trim()
        .notEmpty().withMessage(fieldRequired('customerPhone'))
        .matches(/^[6-9]\d{9}$/).withMessage('Customer phone must be a valid 10-digit Indian number'),
];



module.exports = {
    resetRules, loginPatientRules, validatePatient, validateDoctor, appointmentRules, saveTokenRules, getTokenRules,
    getAppointmentsRules, confirmAppointmentRules, verifyOTPRules, verifyOTPLenght, updatePatientRules, validateHospitalData,
    validateHospitalDataUpdate, validateAdmitPatientRules, validateCreateOrder, isDevEnv, verifyLoginOTPLenght, verifyLoginOTPRules,
    validateAdmin, updateAdminRules, forgotPasswordSendToken, forgotPasswordResetRules
};