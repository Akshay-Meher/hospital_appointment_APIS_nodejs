const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const { uploadDocumentValidator, verifyDocsValidation } = require('../validations/commonValidations');
const { uploadDocuments, verifyDocs } = require('../controllers/doctorDocumentController');
const checkValidationMidd = require('../middleware/checkValidationMiddleware');
const isAdminLoginMiddleware = require('../middleware/isAdminLoginMiddleware');

// Upload documents route
router.post('/upload', upload.fields([
    { name: 'aadhaar_card', maxCount: 1 },
    { name: 'certificate', maxCount: 1 },
]), uploadDocumentValidator, checkValidationMidd, uploadDocuments);

router.post('/verify', verifyDocsValidation, checkValidationMidd, isAdminLoginMiddleware, verifyDocs);

module.exports = router;
