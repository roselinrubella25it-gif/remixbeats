const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  imageUrl: {
    type: String,
    required: true
  },
  category: {
   type: String,
   required: true,
   enum: ['headphones', 'earbuds', 'speakers', 'accessories', 'hero', 'logo', 'product-showcase']
 },
  altText: {
    type: String
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  price: {
    type: Number,
    default: 0
  },
  brand: {
    type: String,
    default: 'Beats by Dre'
  },
  color: {
    type: String
  },
  specifications: {
    type: String
  },
  stock: {
    type: Number,
    default: 0
  },
  weight: {
    type: String
  },
  dimensions: {
    type: String
  },
  warranty: {
    type: String
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Image', imageSchema);