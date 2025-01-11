const bcrypt = require('bcryptjs');



const SALT_ROUNDS = 10;

/**
 * Hashes a plain text password using bcrypt.
 * @param {string} password - The plain text password to hash.
 * @returns {Promise<string>} The hashed password.
 */
async function hashPassword(password) {
    try {
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (err) {
        console.error('Error hashing password:', err);
        throw new Error('Failed to hash password');
    }
}



/**
 * Compares a plain-text password with a hashed password.
 * @param {string} plainPassword - The plain-text password provided by the user.
 * @param {string} hashedPassword - The hashed password stored in the database.
 * @returns {Promise<boolean>} - Returns true if the passwords match, otherwise false.
 */
const comparePassword = async (plainPassword, hashedPassword) => {
    try {
        return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (err) {
        console.error("Error comparing passwords:", err);
        throw new Error("Password comparison failed.");
    }
};

module.exports = { comparePassword, hashPassword };
