const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const { uploadDocumentValidator, verifyDocsValidation } = require('../validations/commonValidations');
const { uploadDocuments, verifyDocs } = require('../controllers/doctorDocumentController');
const checkValidationMidd = require('../middleware/checkValidationMiddleware');
const { checkAdminLogin } = require('../middleware/passportLoginMiddleware');

// Upload documents route
router.post('/upload', upload.fields([
    { name: 'aadhaar_card', maxCount: 1 },
    { name: 'certificate', maxCount: 1 },
]), uploadDocumentValidator, checkValidationMidd, uploadDocuments);

router.post('/verify', verifyDocsValidation, checkValidationMidd, checkAdminLogin, verifyDocs);

module.exports = router;
