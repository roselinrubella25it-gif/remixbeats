const express = require('express');
const router = express.Router();
const {
  getAllImages,
  getImagesByCategory,
  createImage,
  updateImage,
  deleteImage
} = require('../controllers/imageController');
const upload = require('../uploads');

// Public routes
router.get('/', getAllImages);
router.get('/category/:category', getImagesByCategory);

// New route to get images by IDs (for favorites)
router.get('/favorites', async (req, res) => {
  try {
    const ids = req.query.ids ? req.query.ids.split(',') : [];
    if (ids.length === 0) {
      return res.json([]);
    }

    const images = await require('../models/Image').find({ _id: { $in: ids } });
    res.json(images);
  } catch (error) {
    console.error('Error fetching favorite images:', error);
    res.status(500).json({ message: error.message });
  }
});

// Image upload route
router.post('/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Return the uploaded file path
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({
      message: 'File uploaded successfully',
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'File upload failed' });
  }
});

// Admin routes (require authentication middleware in production)
router.post('/', createImage);
router.put('/:id', updateImage);
router.delete('/:id', deleteImage);

module.exports = router;