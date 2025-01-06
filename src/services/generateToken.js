const jwt = require('jsonwebtoken');

/**
 * Generates a JWT token for the provided payload.
 * @param {Object} payload - The data to include in the token (e.g., user ID, email).
 * @param {string} secret - The secret key for signing the token.
 * @param {string} expiresIn - The expiration time for the token (e.g., '1d', '2h').
 * @returns {string} - The generated JWT token.
 */
const generateToken = (payload, secret = process.env.JWT_SECRET, expiresIn = '1d') => {
    try {
        return jwt.sign(payload, secret, { expiresIn });
    } catch (err) {
        console.error("Error generating token:", err);
        throw new Error("Failed to generate token.");
    }
};

module.exports = generateToken;
