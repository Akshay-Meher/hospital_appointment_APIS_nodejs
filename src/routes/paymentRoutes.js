const express = require('express');
const { createOrder, handleWebhook } = require('../controllers/paymentController');
const router = express.Router();

router.post('/create-order', createOrder);
router.post('/webhook', handleWebhook);

module.exports = router;
