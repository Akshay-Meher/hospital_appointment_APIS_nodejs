const express = require('express');
// const authRoutes = require('./authRoutes');
const patientRoutes = require('./patientsRoutes');
const doctorRoutes = require('./doctorsRoutes');
const appointmentRoutes = require('./appointmentRoutes');
const resetPasswordRoutes = require('./resetPasswordRoutes');
const emailVerificationRoutes = require('./emailVerificationRoutes');
const firebaseRoutes = require('./firebaseRoutes');
const hospitalRoutes = require('./hospitalRoutes');
const admitRoutes = require('./admitRoutes');
const paymentRoutes = require('./paymentRoutes');
const otpLoginRoutes = require('./otpLoginRoutes');
const adminRoutes = require('./adminRoutes');

const { swaggerUi, specs } = require('../swagger/swagger');
const { isDevEnv } = require('../validations/authValidation');

const router = express.Router();

if (isDevEnv) {
    router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}

router.use('/admin', adminRoutes);
router.use('/patient', patientRoutes);
router.use('/doctor', doctorRoutes);
router.use('/appointment', appointmentRoutes);
router.use('/reset-password', resetPasswordRoutes);
router.use('/email', emailVerificationRoutes);
router.use('/firebase', firebaseRoutes);
router.use('/hospital', hospitalRoutes);
router.use('/admit', admitRoutes);
router.use('/payment', paymentRoutes);
router.use('/otp-login', otpLoginRoutes);


module.exports = router;
