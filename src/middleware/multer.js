const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Temporary folder for uploads

const tempDir = path.join(__dirname, '../../public/temp');

if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tempDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images (JPEG/PNG) and PDFs are allowed.'));
    }
};

const upload = multer({
    storage,
    // fileFilter,
    // limits: {
    //     fileSize: 2 * 1024 * 1024, // Limit file size to 2 MB
    // },
});

module.exports = upload;
