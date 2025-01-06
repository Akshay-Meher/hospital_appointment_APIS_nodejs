const { executeModelMethod } = require('../services/executeModelMethod');
const { sendResponse } = require('../services/responseHandler');
const logger = require('../utils/logger');
const bcrypt = require('bcryptjs');
const { inccorect, updatedSuccessfully } = require('../utils/responseMessages');

/**
 * Controller for resetting the password after verifying the old password.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
const resetPassword = async (req, res) => {
    const { email, old_password, new_password, role } = req.body;

    try {

        const modelName = role === 'patient' ? 'Patient' : 'Doctor';

        const modelWithMethod = {
            modelName: modelName,
            methodName: "findOne",
            args: { where: { email, is_deleted: false } }
        };


        const user = await executeModelMethod(modelWithMethod);
        if (!user) {
            return sendResponse(res, "NOT_FOUND");
        }

        const isPasswordValid = await bcrypt.compare(old_password, user.password);
        if (!isPasswordValid) {
            return sendResponse(res, "UNAUTHORIZED", false, inccorect('old_password'));
        }

        const hashedNewPassword = await bcrypt.hash(new_password, 10);

        await executeModelMethod({
            modelName,
            methodName: 'update',
            args: [
                { password: hashedNewPassword },
                { where: { email } },
            ]
        });

        logger.info(`Password updated successfully for ${role} with email: ${email}`);
        return sendResponse(res, "OK", true, updatedSuccessfully('Password'));
    } catch (error) {
        logger.error('Failed to update password', { error });
        return sendResponse(res, "INTERNAL_SERVER_ERROR");
    }
};

module.exports = { resetPassword };
