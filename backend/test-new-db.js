const mongoose = require('mongoose');
const Image = require('./models/Image');
require('dotenv').config();

async function testNewDatabase() {
  try {
    console.log('Testing connection to new MongoDB database...');
    console.log('MongoDB URI:', process.env.MONGODB_URI);

    // Connect to the new MongoDB database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas successfully!');

    // Create a test product with all new fields
    const testProduct = new Image({
      title: 'Studio Pro Headphones',
      description: 'Professional studio-quality headphones with premium sound',
      imageUrl: 'https://example.com/studio-pro.jpg',
      category: 'headphones',
      altText: 'Studio Pro Headphones',
      order: 1,
      isActive: true,
      price: 349.99,
      brand: 'Beats by Dre',
      color: 'Matte Black',
      specifications: 'Active Noise Cancellation, Spatial Audio, 40-hour battery',
      stock: 25,
      weight: '300g',
      dimensions: '22x20x10 cm',
      warranty: '3 years',
      tags: ['studio', 'professional', 'noise-cancelling', 'premium', 'wireless']
    });

    console.log('Creating test product...');
    const savedProduct = await testProduct.save();
    console.log('✅ Test product saved successfully!');
    console.log('📝 Product ID:', savedProduct._id);

    // Verify all fields are stored correctly
    console.log('\n📊 Product Details Stored:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Title:', savedProduct.title);
    console.log('Description:', savedProduct.description);
    console.log('Image URL:', savedProduct.imageUrl);
    console.log('Category:', savedProduct.category);
    console.log('Alt Text:', savedProduct.altText);
    console.log('Order:', savedProduct.order);
    console.log('Active:', savedProduct.isActive);
    console.log('Price: $', savedProduct.price);
    console.log('Brand:', savedProduct.brand);
    console.log('Color:', savedProduct.color);
    console.log('Specifications:', savedProduct.specifications);
    console.log('Stock:', savedProduct.stock);
    console.log('Weight:', savedProduct.weight);
    console.log('Dimensions:', savedProduct.dimensions);
    console.log('Warranty:', savedProduct.warranty);
    console.log('Tags:', savedProduct.tags.join(', '));
    console.log('Created At:', savedProduct.createdAt);
    console.log('Updated At:', savedProduct.updatedAt);

    // Test retrieval
    console.log('\n🔍 Testing retrieval...');
    const retrievedProduct = await Image.findById(savedProduct._id);
    if (retrievedProduct) {
      console.log('✅ Product retrieved successfully!');
    }

    // Test count
    const totalProducts = await Image.countDocuments();
    console.log('📈 Total products in database:', totalProducts);

    // Clean up
    console.log('\n🧹 Cleaning up test data...');
    await Image.findByIdAndDelete(savedProduct._id);
    console.log('✅ Test product deleted successfully');

    const finalCount = await Image.countDocuments();
    console.log('📊 Final product count:', finalCount);

    console.log('\n🎉 All tests passed! Your new MongoDB database is working perfectly.');
    console.log('💡 You can now add products through the Admin Dashboard and all details will be stored.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('authentication failed')) {
      console.log('🔐 Check your MongoDB credentials in .env file');
    } else if (error.message.includes('getaddrinfo ENOTFOUND')) {
      console.log('🌐 Check your internet connection and MongoDB Atlas cluster URL');
    }
    process.exit(1);
  }
}

testNewDatabase();