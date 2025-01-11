const { body } = require('express-validator');
const { fieldRequired, exceedChar, invalidFormate, passwordFormate, onlyDigits, between10_to15, validGender, validDateFormat, cannotInFuture, mustPresentOrFuture, timeFormate, appDate, appTimeErr, cannotExeed255char, years_of_experience, statusFormat, doctorOrPatient, OTP } = require('../utils/responseMessages');

const nameValidation = body('name')
    .trim()
    .notEmpty()
    .withMessage(fieldRequired('name'))
    .isLength({ max: 50 })
    .withMessage(exceedChar('name'));

const lastNameValidation = body('last_name')
    .trim()
    .notEmpty()
    .withMessage(fieldRequired('last_name'))
    .isLength({ max: 50 })
    .withMessage(exceedChar('last_name'));

// Email Validation
const emailValidation = body('email')
    .trim()
    .notEmpty()
    .withMessage(fieldRequired('email'))
    .isEmail()
    .withMessage(invalidFormate('email'))
    .normalizeEmail();

// Password Validation
const passwordValidation = body('password')
    .trim()
    .notEmpty().withMessage(fieldRequired('password'))
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/)
    .withMessage(passwordFormate("password"))


// Phone Validation
const phoneValidation = body('phone')
    .trim()
    .notEmpty()
    .withMessage(fieldRequired('phone'))
    .isNumeric()
    .withMessage(onlyDigits("phone_number"))
    .isLength({ min: 10, max: 15 })
    .withMessage(between10_to15('phone_number'));

const genderValidation = body('gender')
    .trim()
    .notEmpty()
    .withMessage(fieldRequired('Gender'))
    .isIn(['Male', 'Female', 'Other'])
    .withMessage(validGender('Gender'));

const dobValidation = body('date_of_birth')
    .trim()
    .notEmpty()
    .withMessage(fieldRequired('date_of_birth'))
    .isDate({ format: 'YYYY-MM-DD' })
    .withMessage(validDateFormat('date_of_birth'))
    .custom((value) => {
        const today = new Date();
        const dob = new Date(value);

        if (dob > today) {
            throw new Error(cannotInFuture(date_of_birth));
        }
        return true;
    });


const optionalNameValidation = body('name')
    .trim()
    .optional()
    .notEmpty()
    .withMessage(fieldRequired('name'))
    .isLength({ max: 50 })
    .withMessage(exceedChar('name'));

const optionalLastNameValidation = body('last_name')
    .trim()
    .optional()
    .notEmpty()
    .withMessage(fieldRequired('last_name'))
    .isLength({ max: 50 })
    .withMessage(exceedChar('last_name'));

const optionalEmailValidation = body('email')
    .trim()
    .notEmpty()
    .optional()
    .withMessage(fieldRequired('email'))
    .isEmail()
    .withMessage(invalidFormate('email'))
    .normalizeEmail();

const optionalPhoneValidation = body('phone')
    .optional()
    .trim()
    .notEmpty()
    .withMessage(fieldRequired('phone'))
    .isNumeric()
    .withMessage(onlyDigits("phone_number"))
    .isLength({ min: 10, max: 15 })
    .withMessage(between10_to15('phone_number'))


const optionalGenderValidation = body('gender')
    .optional()
    .trim()
    .notEmpty()
    .withMessage(fieldRequired('Gender'))
    .isIn(['Male', 'Female', 'Other'])
    .withMessage(validGender('Gender'));

const optionalDOBValidation = body('date_of_birth')
    .optional()
    .trim()
    .notEmpty()
    .withMessage(fieldRequired('date_of_birth'))
    .isDate({ format: 'YYYY-MM-DD' })
    .withMessage(validDateFormat('date_of_birth'))
    .custom((value) => {
        const today = new Date();
        const dob = new Date(value);

        if (dob > today) {
            throw new Error(cannotInFuture(date_of_birth));
        }
        return true;
    });

const optionalAddressValidation = body('address')
    .optional()
    .trim()
    .notEmpty()
    .withMessage(fieldRequired('address'))
    .isLength({ max: 255 })
    .withMessage(cannotExeed255char('address'))


const appointment_dateValidatoin = body('appointment_date')
    .trim()
    .notEmpty()
    .withMessage(fieldRequired('appointment_date'))
    .isDate({ format: 'YYYY-MM-DD' })
    .withMessage(validDateFormat('appointment_date'))
    .custom((value) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const date_of_app = new Date(value);
        date_of_app.setHours(0, 0, 0, 0);


        if (date_of_app < today) {
            throw new Error(mustPresentOrFuture('appointment_date'));
        }
        return true;
    });

const appointment_timeValidation = body('appointment_time')
    .notEmpty()
    .withMessage(fieldRequired('appointment_time'))
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage(timeFormate('appointment_time'))
    .custom((value, { req }) => {
        const { appointment_date } = req.body;

        // Check if appointment_date exists and is valid
        if (!appointment_date || !/^\d{4}-\d{2}-\d{2}$/.test(appointment_date)) {
            throw new Error(appDate('appointment_time'));
        }

        const currentDate = new Date();
        const appointmentDate = new Date(appointment_date);

        // Normalize both dates to compare only the day
        currentDate.setHours(0, 0, 0, 0);
        appointmentDate.setHours(0, 0, 0, 0);

        if (appointmentDate.getTime() === currentDate.getTime()) {
            // Parse the time into hours and minutes
            const [hours, minutes] = value.split(':').map(Number);
            const appointmentDateTime = new Date();
            appointmentDateTime.setHours(hours, minutes, 0, 0);

            // Current time + 2 hours
            const minimumTime = new Date();
            minimumTime.setHours(minimumTime.getHours() + 2);

            if (appointmentDateTime < minimumTime) {
                throw new Error(appTimeErr('appointment_time'));
            }
        }

        return true;
    });

const user_idRules = body('user_id')
    .trim()
    .notEmpty().withMessage(fieldRequired('user_id'));

const tokenRules = body('token')
    .trim()
    .notEmpty().withMessage(fieldRequired('token'));

const roleRules = body('role')
    .trim()
    .notEmpty().withMessage(fieldRequired('role'))
    .custom((value) => {
        if (value !== 'patient' && value !== 'doctor') {
            throw new Error(doctorOrPatient('role'));
        }
        return true;
    });


const hospitalSpecializationsRules = body('specializations')
    .isArray().withMessage('Specializations must be an array')
    .notEmpty().withMessage('Specializations cannot be empty')
    .custom(value => {
        return value.every(item => typeof item === 'string');
    }).withMessage('Each specialization must be a string');


const validateHospitalData = [
    body('specializations')
        .isArray().withMessage('Specializations must be an array')
        .notEmpty().withMessage('Specializations cannot be empty')
        .custom(value => {
            return value.every(item => typeof item === 'string');
        }).withMessage('Each specialization must be a string'),
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
            if (value > req.body.capacity) {
                throw new Error('Available beds cannot exceed hospital capacity');
            }
            return true;
        })
];




module.exports = {
    nameValidation, lastNameValidation, emailValidation, passwordValidation, phoneValidation, genderValidation,
    dobValidation, optionalNameValidation, optionalLastNameValidation, optionalEmailValidation, optionalPhoneValidation, optionalGenderValidation, optionalDOBValidation, optionalAddressValidation, appointment_dateValidatoin, appointment_timeValidation, user_idRules, tokenRules,
    roleRules
};