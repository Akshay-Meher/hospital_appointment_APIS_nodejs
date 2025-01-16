const { hashPassword } = require("../services/comparePassword");
const { sendEmail } = require("../services/email/emailSender");
const { executeModelMethod } = require("../services/executeModelMethod");
const { sendResponse } = require("../services/responseHandler");
const { generateCryptoToken, calculateExpiration } = require("../utils/otpGenerator");
const { notFound, resetSuccessfully, emailSentSuccessfully, InvalidOrExpired } = require("../utils/responseMessages");
const { Op } = require('sequelize');


const sendForgotPasswordToken = async (req, res) => {
    const { email, role } = req.body;
    try {

        let modelName;

        if (role == 'patient') {
            modelName = "Patient"
        } else if (role == 'doctor') {
            modelName = "Doctor"
        } else if (role == 'admin') {
            modelName = "Admin"
        }

        if (!modelName) return sendResponse(res, "BAD_REQUEST");

        const user = await executeModelMethod({
            modelName,
            methodName: "findOne",
            args: { email, role, is_deleted: false }
        });

        if (!user) {
            return sendResponse(res, "NOT_FOUND", notFound("User"));
        }

        const checkTokenExists = await executeModelMethod({
            modelName: "ForgotPasswordToken",
            methodName: "findOne",
            args: { where: { userId: user.id, role, is_deleted: false } }
        });

        const token = generateCryptoToken();
        const tokenExipiration = calculateExpiration();

        // Save token in database
        if (checkTokenExists) {
            const checkTokenExists = await executeModelMethod({
                modelName: "ForgotPasswordToken",
                methodName: "update",
                args: [
                    { userId: user.id, role, token, tokenExipiration },
                    { where: { userId: user.id, role, is_deleted: false } }
                ]
            });
        } else {

            await executeModelMethod({
                modelName: "ForgotPasswordToken",
                methodName: "create",
                args: {
                    userId: user.id,
                    role, token, tokenExipiration
                }
            });
        }

        // const link = `http://${req.get('host')}/forgot-password/reset/${user.id}/${role}/${token}`;
        const link = `http://${req.get('host')}/forgot-password/reset?uId=${user.id}&role=${role}&token=${token}`;

        const to = email;
        const subject = "Password Reset";
        const text = "reset-password link";
        const html = `
        <p>Hello,</p>
        <p>You requested to reset your password. Please click the link below to reset it:</p>
        <a href="${link}">${link}</a>
        <p>This link will expire in 10 minutes.</p>`;

        sendEmail(to, subject, text, html);

        return sendResponse(res, "OK", emailSentSuccessfully('Password reset'));

    } catch (err) {
        console.error(`Forgot Password Error: ${err.message}`);
        return sendResponse(res, "INTERNAL_SERVER_ERROR");
    }
}


const setPassword = async (req, res) => {
    const { userId, role, token } = req.params;
    let { password } = req.body;

    try {

        let modelName;
        if (role == 'patient') {
            modelName = "Patient"
        } else if (role == 'doctor') {
            modelName = "Doctor"
        } else if (role == 'admin') {
            modelName = "Admin"
        }


        if (!modelName || !userId) return sendResponse(res, "BAD_REQUEST");

        const user = await executeModelMethod({
            modelName,
            methodName: "findOne",
            args: { where: { id: userId, is_deleted: false } }
        });

        if (!user) {
            return sendResponse(res, "NOT_FOUND", notFound("user"));
        }

        // Find the token in the database
        const resetToken = await executeModelMethod({
            modelName: "ForgotPasswordToken",
            methodName: "findOne",
            args: {
                where: {
                    userId: user.id,
                    role,
                    token,
                    tokenExipiration: { [Op.gt]: new Date() },
                },
            }
        });

        if (!resetToken) {
            return sendResponse(res, "BAD_REQUEST", InvalidOrExpired('token'));
        }
        password = await hashPassword(password);
        user.password = password;
        await user.save();

        await resetToken.destroy();

        await executeModelMethod({
            modelName: "LoginFailed",
            methodName: "destroy",
            args: { where: { userId: user.id, role, is_deleted: false } }

        });

        return sendResponse(res, "OK", resetSuccessfully("password"));

    } catch (err) {
        console.error(`Reset Password Error: ${err.message}`);
        return sendResponse(res, "INTERNAL_SERVER_ERROR");
    }
};


module.exports = { sendForgotPasswordToken, setPassword };