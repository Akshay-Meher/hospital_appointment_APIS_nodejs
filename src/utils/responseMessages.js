
/**
 * Sends a Dynamic common messages for APIs response.
 * @param {string} name- like Patient or Doctor. 
 * @returns {string} - A Docor/Patient with this email already exists.
 */

const emialExistsMessage = (name) => {
    return `A ${name} with this email already exists.`
};

/**
 * Sends a Dynamic common messages for APIs response.
 * @param {string} name- like Patient or Doctor. 
 * @returns {string} - Doctor/Patient registered successfully..
 */

const registeredSuccessfullyMessage = (name) => {
    return `${name} registered successfully..`
};

/**
 * Sends a Dynamic common messages for APIs response.
 * @param {string} name- like Patient or Doctor. 
 * @returns {string} - No Doctor/Patient found with this email.
 */

const notFoundEmail = (name) => {
    return `No ${name} found with this email.`
};


/**
 * Sends a Dynamic common messages for APIs response. 
 * @returns {string} - Invalid email or password.
 */
const invalidCredential = () => {
    return 'Invalid email or password.';
}

/**
 * Sends a Dynamic common messages for APIs response. 
 * @returns {string} - Login successful..
 */
const loginSuccessful = () => {
    return "Login successful.";
}

/**
 * Sends a Dynamic common messages for APIs response. 
 * @returns {string} - A Duplicate entry of license_number
 */
const licenseDuplicate = () => {
    return "A Duplicate entry of license_number";
}

/**
 * Sends a Dynamic common messages for APIs response. 
 * @param {string} name- like Patient or Doctor. 
 * @returns {string} -'Patient/Doctor does not exist.'
 */
const doestNotExist = (name) => {
    return `a ${name} does not exist.`;
}

/**
 * 
 * @returns {string} -'The selected doctor is already booked at the given time and date.'
 */

const allreadyBooked = () => {
    return 'The selected doctor is already booked at the given time and date.';
}


/**
 * 
 * @returns {string} - 'Appointment booked successfully.'
 */

const appBookSuccess = () => {
    return 'Appointment booked successfully.';
};

const tokenNotProvided = () => {
    return 'Access denied. No token provided.';
}

const invalidToken = () => {
    return 'Invalid or expired token.';
}

// validations messages
const fieldRequired = (field_name) => {
    return `${field_name} is required`;
};


const exceedChar = (field_name) => {
    return `${field_name} cannot exceed 50 characters`;
}

const invalidFormate = (field_name) => {
    return `Invalid ${field_name} format`;
}

const passwordFormate = (field_name) => {
    return `${field_name} must be at least 8 characters long, contain at least one uppercase letter,` +
        'one lowercase letter, one number, and one special character (@, $, !, %, *, ?, &).';
}

const onlyDigits = (field_name) => {
    return `${field_name} must contain only digits`;
}

const between10_to15 = (field_name) => {
    return `${field_name} must be between 10 and 15 digits`
}

const validGender = (field_name) => `${field_name} must be Male, Female, or Other`;
const validDateFormat = (field_name) => `${field_name} must be a valid date in YYYY-MM-DD format`;
const cannotInFuture = (field_name) => `${field_name} cannot be in the future`;
const mustPresentOrFuture = (field_name) => `${field_name} must be in the presend or future`;
const timeFormate = (field_name) => `${field_name} must be in HH:mm in 24hrs time format`;
const appDate = (field_name) => `${field_name} must be provided and valid before checking time`;
const appTimeErr = (field_name) => `${field_name} must be at least 2 hours ahead of the current time if the appointment is for today`

const cannotExeed255char = (field_name) => `${field_name} cannot exceed 255 characters`;
const years_of_experience = (field_name) => `${field_name} must be a non-negative integer or a valid integer`;
const statusFormat = () => `Status must be Pending, Confirmed, or Cancelled`;
const doctorOrPatient = (field_name) => `${field_name} must be either 'patient' or 'doctor'`;
const inccorect = (field_name) => `${field_name} is incorrect.`;
const updatedSuccessfully = (field_name) => `${field_name} updated successfully.`;

// Appointments
const notFound = (field_name) => `${field_name} not found.`;
const notAuthorized = (field_name, type) => `You are not authorized to ${type} this ${field_name}.`
const notAuthorizedLogin = (field_name) => `You are not authorized, please login as a ${field_name}`
const confirmedSuccessfully = (field_name) => `${field_name} confirmed successfully.`;
const cancelledSuccessfully = (field_name) => `${field_name} cancelled successfully.`;
const OTP = (field_name) => `${field_name} must be exactly 6 characters long'`;
const invalidOTP = (field_name) => `Invalid or expired ${field_name}.`;
const validPhone = (field_name) => `${field_name} must be a valid phone number`;
const positiveInteger = (field_name) => `${field_name} must be a positive integer`;
const exceedCapacity = (field_name) => `${field_name} cannot exceed hospital capacity`;




module.exports = {
    emialExistsMessage, registeredSuccessfullyMessage, notFoundEmail, invalidCredential, loginSuccessful, licenseDuplicate,
    doestNotExist, allreadyBooked, appBookSuccess, fieldRequired, tokenNotProvided, invalidToken, exceedChar, invalidFormate,
    passwordFormate, onlyDigits, between10_to15, validGender, validDateFormat, cannotInFuture, mustPresentOrFuture, timeFormate,
    appDate, appTimeErr, cannotExeed255char, years_of_experience, statusFormat, doctorOrPatient, inccorect, updatedSuccessfully,
    notFound, notAuthorized, confirmedSuccessfully, notAuthorizedLogin, cancelledSuccessfully, OTP, invalidOTP, validPhone, positiveInteger, exceedCapacity
};