// const { createCashfreeOrder } = require('../services/paymentService');
const { createCashfreeOrder } = require("../services/paymentService");
const { sendResponse } = require("../services/responseHandler");

// Create payment order
const createOrder = async (req, res) => {
    try {
        const { orderId, orderAmount, customerEmail, customerPhone } = req.body;
        const paymentLink = await createCashfreeOrder(orderId, orderAmount, customerEmail, customerPhone);
        sendResponse(res, "OK", null, paymentLink);
        // res.status(200).json({ paymentLink });
    } catch (error) {
        console.log("error", error);
        return sendResponse(res, "INTERNAL_SERVER_ERROR");
    }
};

// Handle payment webhook
const handleWebhook = (req, res) => {
    const data = req.body;

    if (data.txStatus === 'SUCCESS') {
        console.log('Payment successful:', data);

    } else {
        console.error('Payment failed:', data);
    }
    res.sendStatus(200);
};

module.exports = { createOrder, handleWebhook };
