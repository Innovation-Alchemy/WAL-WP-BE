const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Set storage destination and filename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads'); // Adjusted path
    console.log('Uploading to path:', uploadPath); // Debug log for directory

    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadPath)) {
      console.log('Creating uploads directory:', uploadPath);
      fs.mkdirSync(uploadPath, { recursive: true }); // Create directory recursively
    }
    cb(null, uploadPath); // Save to the correct uploads folder
  },
  filename: function (req, file, cb) {
    console.log('Received file:', file.originalname); // Debug log for the file
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileName = `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`;
    console.log('Generated file name:', fileName); // Debug log for the generated name
    cb(null, fileName); // Save file with the generated name
  },
});

// Filter files by type
const fileFilter = (req, file, cb) => {
  console.log('Filtering file:', file.originalname); // Debug log for file filter
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true); // Accept file
  } else {
    console.error('Invalid file type:', file.mimetype); // Log invalid file type
    cb(new Error('Only images are allowed!')); // Reject file
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: fileFilter,
});

module.exports = upload;