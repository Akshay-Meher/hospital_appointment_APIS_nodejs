const { Patient, Doctor } = require('../models');
const { generateOTP, calculateExpiration } = require('../utils/otpGenerator');
const logger = require('../utils/logger');
const { Op, where } = require('sequelize');
const { executeModelMethod } = require('../services/executeModelMethod');
const { sendResponse } = require('../services/responseHandler');
const { sendOTPEmail } = require('../utils/sendAppointmentEmail');
const { invalidOTP } = require('../utils/responseMessages');

const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const role = req?.user?.role;
        const modelName = role === 'patient' ? "Patient" : "Doctor";

        const user = await executeModelMethod({
            modelName,
            methodName: "findOne",
            args: {
                where: { email, is_deleted: false }
            }
        });

        if (!user) {
            return sendResponse(res, "NOT_FOUND");
        }

        const otp = generateOTP();
        const otpExpiration = calculateExpiration();

        await executeModelMethod({
            modelName,
            methodName: "update",
            args: [
                { otp, otp_expiration: otpExpiration },
                { where: { email, is_deleted: false } }
            ]
        })

        sendOTPEmail(email, otp);

        return sendResponse(res, "OK");

    } catch (error) {
        logger.error(`Failed to send OTP: ${error.message}`);
        console.log("error", error);
        return sendResponse(res, "INTERNAL_SERVER_ERROR");

    }
};

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const role = req?.user?.role;
        const modelName = role === 'patient' ? "Patient" : "Doctor";

        const user = await executeModelMethod({
            modelName,
            methodName: "findOne",
            args: {
                where: {
                    email,
                    is_deleted: false,
                    otp,
                    otp_expiration: { [Op.gt]: new Date() }
                }
            }
        });

        if (!user) {
            return sendResponse(res, "BAD_REQUEST", invalidOTP("OTP"));
        }



        await user.update({ is_email_verified: true, otp: null, otp_expiration: null });

        await executeModelMethod({
            modelName,
            methodName: "update",
            args: [
                { is_email_verified: true, otp: null, otp_expiration: null },
                { where: { email, is_deleted: false } }
            ]
        })

        // res.status(200).json({ message: `${userType} email verified successfully.` });
        return sendResponse(res, "OK", "email verified successfully");
    } catch (error) {
        logger.error(`Failed to verify OTP: ${error.message}`);
        console.log("err", error);
        return sendResponse(res, "INTERNAL_SERVER_ERROR");
        // res.status(500).json({ error: 'Failed to verify OTP. Please try again later.' });

    }
};

module.exports = { sendOTP, verifyOTP };
