const crypto = require('crypto');

const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

/**
 * Generates a secure random token.
 *
 * @param {number} [length=32] - The length of the random byte array (in bytes).
 * @returns {string} - The generated random token as a hexadecimal string.
 */
function generateCryptoToken(length = 32) {
    if (typeof length !== 'number' || length <= 0) {
        throw new Error('Length must be a positive integer.');
    }
    // Generate the random bytes and convert them to a hexadecimal string
    const buffer = crypto.randomBytes(length);
    return buffer.toString('hex');
}

const calculateExpiration = (minutes = 10) => {
    return new Date(Date.now() + minutes * 60 * 1000); // 10 minutes default
};

module.exports = { generateOTP, generateCryptoToken, calculateExpiration };
