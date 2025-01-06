const { sequelize } = require('../models');

/**
 * Dynamically calls a Sequelize model's method.
 * @param {string} modelName - The name of the model (e.g., 'User').
 * @param {string} methodName - The name of the method to call (e.g., 'findOne').
 * @param {object|array|null} args - Arguments to pass to the method, or null if none are needed.
 * @returns {Promise<any>} - The response from the model method.
 * @throws {Error} - If the model or method doesn't exist, or if the method call fails.
 */
const executeModelMethod = async ({ modelName, methodName, args = null }) => {
    try {

        const model = sequelize.models[modelName];
        if (!model) {
            throw new Error(`Model "${modelName}" not found.`);
        }

        if (typeof model[methodName] !== 'function') {
            throw new Error(`Method "${methodName}" not found on model "${modelName}".`);
        }

        // const result = args ? await model[methodName](args) : await model[methodName]();
        let result = null;

        // if (!args) {
        //     return await model[methodName]();
        // } else if (Array.isArray(args)) {
        //     return await model[methodName](...args);
        // } else {
        //     return await model[methodName](args)
        // }

        // Handle both array and object arguments without altering them
        if (Array.isArray(args)) {
            return await model[methodName](...args); // Spread array for multiple arguments
        } else if (args && typeof args === 'object') {
            return await model[methodName](args); // Pass object directly
        } else {
            return await model[methodName](); // No arguments
        }

        // return result;
    } catch (error) {
        console.error(`Error in executeModelMethod: ${error.message}`);
        throw error;
    }
};

module.exports = { executeModelMethod };
