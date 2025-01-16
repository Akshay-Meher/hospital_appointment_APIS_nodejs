const { executeModelMethod } = require("../services/executeModelMethod");

/**
 * Utility function to check if a record exists in the database.
 * @param {number|string} id - The ID of the record to check.
 * @param {string} modelName - The Sequelize model to query.
 * @param {object} [options={}] - Optional parameters for the WHERE condition.
 * @returns {Promise<boolean>} - Returns true if the record exists, false otherwise.
 */
const isRecordExists = async (id, modelName, options = {}) => {
    try {

        const condition = {
            where: {
                id,
                ...options, // Add any additional conditions dynamically
            },
        };

        // const record = await modelName.findOne(condition);
        const record = await executeModelMethod({
            modelName, methodName: "findOne",
            args: {
                where: {
                    id,
                    ...options,
                    is_deleted: false
                },
            }
        });
        return record !== null; // Return true if record exists, false otherwise
    } catch (error) {
        console.error("Error in isRecordExists:", error);
        throw new Error("Error while checking record existence");
    }
};

module.exports = { isRecordExists };
