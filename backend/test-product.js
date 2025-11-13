const mongoose = require('mongoose');
const Image = require('./models/Image');
require('dotenv').config();

async function testProductStorage() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/beatsby');
    console.log('Connected to MongoDB');

    // Create a test product with all new fields
    const testProduct = new Image({
      title: 'Test Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      imageUrl: 'https://example.com/test-headphones.jpg',
      category: 'headphones',
      altText: 'Test headphones image',
      order: 1,
      isActive: true,
      price: 299.99,
      brand: 'Beats by Dre',
      color: 'Black',
      specifications: 'Bluetooth 5.0, 30-hour battery, Active Noise Cancellation',
      stock: 50,
      weight: '250g',
      dimensions: '20x18x8 cm',
      warranty: '2 years',
      tags: ['wireless', 'bluetooth', 'noise-cancelling', 'premium']
    });

    // Save to database
    const savedProduct = await testProduct.save();
    console.log('Test product saved successfully!');
    console.log('Product ID:', savedProduct._id);
    console.log('Full product data:', JSON.stringify(savedProduct, null, 2));

    // Retrieve and verify all fields are stored
    const retrievedProduct = await Image.findById(savedProduct._id);
    console.log('\nRetrieved product fields:');
    console.log('- Title:', retrievedProduct.title);
    console.log('- Price:', retrievedProduct.price);
    console.log('- Brand:', retrievedProduct.brand);
    console.log('- Color:', retrievedProduct.color);
    console.log('- Specifications:', retrievedProduct.specifications);
    console.log('- Stock:', retrievedProduct.stock);
    console.log('- Weight:', retrievedProduct.weight);
    console.log('- Dimensions:', retrievedProduct.dimensions);
    console.log('- Warranty:', retrievedProduct.warranty);
    console.log('- Tags:', retrievedProduct.tags);

    // Clean up - delete test product
    await Image.findByIdAndDelete(savedProduct._id);
    console.log('\nTest product deleted successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testProductStorage();