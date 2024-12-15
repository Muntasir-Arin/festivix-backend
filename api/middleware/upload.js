const multer = require('multer');

// Set up Multer for handling file uploads
const storage = multer.memoryStorage(); // Files stored in memory for processing
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
});

// Middleware to handle image and logo uploads
module.exports = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'logo', maxCount: 1 },
]);
