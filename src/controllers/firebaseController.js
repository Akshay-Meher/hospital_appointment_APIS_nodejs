const { executeModelMethod } = require("../services/executeModelMethod");
const { sendResponse } = require("../services/responseHandler");
const { notFound } = require("../utils/responseMessages");


const saveToken = async (req, res) => {
    try {
        const { user_id, token, role, } = req.body;
        await executeModelMethod({
            modelName: "FirebaseToken",
            methodName: "create",
            args: { userId: user_id, token, role }
        });
        return sendResponse(res, "OK");
    } catch (error) {
        logger.error(`Failed to saveToken ${error.message}`);
        console.log("err", error);
        return sendResponse(res, "INTERNAL_SERVER_ERROR");
    }
}


const getToken = async (req, res) => {
    try {
        const { user_id, role } = req.body;

        const token = await executeModelMethod({
            modelName: "FirebaseToken",
            methodName: "findOne",
            args: {
                where: {
                    userId: user_id, role, is_deleted: false
                }
            }
        });

        if (!token) {
            return sendResponse(res, "NOT_FOUND", notFound("FirebaseToken"));
        }

        return sendResponse(res, "OK", null, token);

    } catch (error) {
        logger.error(`Failed to verify OTP: ${error.message}`);
        console.log("err", error);
        return sendResponse(res, "INTERNAL_SERVER_ERROR");
    }
}

module.exports = { getToken, saveToken };