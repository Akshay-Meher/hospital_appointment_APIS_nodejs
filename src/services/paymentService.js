const axios = require('axios');

const createCashfreeOrder = async (orderId, orderAmount, customerEmail, customerPhone) => {
    const payload = {
        order_id: orderId,
        order_amount: orderAmount,
        order_currency: 'INR',
        customer_details: {
            customer_id: `CUST_${orderId}`,
            customer_email: customerEmail,
            customer_phone: customerPhone,
        },
    };
    try {
        const CASHFREE_BASE_URL = process.env.CASHFREE_BASE_URL;
        const response = await axios.post(
            `${CASHFREE_BASE_URL}/pg/orders`,
            payload,
            {
                headers: {
                    'x-client-id': process.env.CASHFREE_APP_ID,
                    'x-client-secret': process.env.CASHFREE_SECRET_KEY,
                    'Content-Type': 'application/json',
                    'x-api-version': '2025-01-01'
                },
            }
        );


        console.log('Payment link:', response.data);

        return response?.data?.payment_link;

    } catch (err) {

        console.error('Error response:', err.response?.data || err.message);


        throw new Error(err.response?.data?.message || 'Failed to create order');

    }

};

module.exports = { createCashfreeOrder };
