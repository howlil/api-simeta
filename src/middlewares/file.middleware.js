const fs = require('fs');
const path = require('path');
const multer = require('multer');

const uploadDir = path.join(__dirname, '../../public/files');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.info('Created directory for PDFs: public/files');
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.info(`Preparing to upload file to: ${uploadDir}`);
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const uniqueName = Date.now() + ext;
        console.info(`Saving file as: ${uniqueName}`);
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['application/pdf'];
    if (!allowedTypes.includes(file.mimetype)) {
        console.warn(`Invalid file type: ${file.mimetype}`);
        return cb(new Error('Only PDF files are allowed!'), false);
    }
    console.info(`File accepted: ${file.originalname}`);
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }  // 10MB
});

const uploadPDF = upload.single('attachment_url');

module.exports = {
    uploadPDF
};