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

const { swaggerUi, specs } = require('../swagger/swagger');

const router = express.Router();

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

router.use('/patient', patientRoutes);
router.use('/doctor', doctorRoutes);
router.use('/appointment', appointmentRoutes);
router.use('/reset-password', resetPasswordRoutes);
router.use('/email', emailVerificationRoutes);
router.use('/firebase', firebaseRoutes);
router.use('/hospital', hospitalRoutes);
router.use('/admit', admitRoutes);


module.exports = router;
