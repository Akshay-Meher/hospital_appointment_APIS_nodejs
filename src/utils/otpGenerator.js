const crypto = require('crypto');

const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

const calculateExpiration = (minutes = 10) => {
    return new Date(Date.now() + minutes * 60 * 1000); // 10 minutes default
};

module.exports = { generateOTP, calculateExpiration };
