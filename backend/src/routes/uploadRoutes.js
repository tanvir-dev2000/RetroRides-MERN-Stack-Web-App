// backend/src/routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const auth = require('../middleware/auth');
const { protectAdmin } = require('../middleware/adminAuth');

router.post('/', auth, protectAdmin, upload.array('images', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded.' });
  }
  const uploadedImages = req.files.map(file => ({
    url: file.path, // Cloudinary URL (some SDKs use 'path', some 'secure_url')
    public_id: file.filename // Cloudinary public_id
  }));
  res.json({ images: uploadedImages }); // Send back an array of image details
});
module.exports = router;
