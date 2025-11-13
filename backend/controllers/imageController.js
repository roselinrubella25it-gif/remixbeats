const Image = require('../models/Image');

// Get all images with optional search
const getAllImages = async (req, res) => {
  try {
    let query = {};

    // Add search functionality - only return results if search term is provided
    if (req.query.search && req.query.search.trim()) {
      const searchTerm = req.query.search.trim();
      if (searchTerm.length > 0) {
        // Create exact match for starts with search term
        const startsWithRegex = new RegExp(`^${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');
        const containsRegex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

        query = {
          $or: [
            { title: { $regex: startsWithRegex } },
            { brand: { $regex: startsWithRegex } },
            { category: { $regex: startsWithRegex } },
            { color: { $regex: startsWithRegex } },
            { title: { $regex: containsRegex } },
            { description: { $regex: containsRegex } },
            { brand: { $regex: containsRegex } },
            { tags: { $elemMatch: { $regex: containsRegex } } }
          ]
        };
      }
    } else if (req.query.search !== undefined) {
      // If search parameter is provided but empty, return empty array
      return res.json([]);
    }

    const images = await Image.find(query).sort({ order: 1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get images by category
const getImagesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const images = await Image.find({ category, isActive: true }).sort({ order: 1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new image
const createImage = async (req, res) => {
  try {
    const image = new Image(req.body);
    const savedImage = await image.save();
    res.status(201).json(savedImage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update image
const updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedImage = await Image.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedImage) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.json(updatedImage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete image
const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedImage = await Image.findByIdAndDelete(id);
    if (!deletedImage) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllImages,
  getImagesByCategory,
  createImage,
  updateImage,
  deleteImage
};