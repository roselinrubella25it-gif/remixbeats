const mongoose = require('mongoose');
const Image = require('./models/Image');
require('dotenv').config();

const sampleProducts = [
  {
    title: 'Studio3 Wireless Headphones',
    description: 'Premium wireless headphones with Pure Adaptive Noise Cancelling',
    imageUrl: 'https://example.com/studio3-black.jpg',
    category: 'headphones',
    altText: 'Studio3 Wireless Headphones Black',
    order: 1,
    isActive: true,
    price: 349.99,
    brand: 'Beats by Dre',
    color: 'Black',
    specifications: 'Active Noise Cancellation, Spatial Audio, 22-hour battery, Wireless charging',
    stock: 45,
    weight: '260g',
    dimensions: '18.4 x 15.4 x 8.1 cm',
    warranty: '1 year',
    tags: ['wireless', 'noise-cancelling', 'premium', 'spatial-audio']
  },
  {
    title: 'Powerbeats Pro',
    description: 'True wireless earbuds with adjustable fit and powerful sound',
    imageUrl: 'https://example.com/powerbeats-pro.jpg',
    category: 'earbuds',
    altText: 'Powerbeats Pro True Wireless Earbuds',
    order: 2,
    isActive: true,
    price: 249.99,
    brand: 'Beats by Dre',
    color: 'Navy',
    specifications: 'True wireless, Sweat resistant, 9-hour battery, Secure fit',
    stock: 60,
    weight: '11.5g each',
    dimensions: '3.0 x 2.5 x 2.2 cm',
    warranty: '1 year',
    tags: ['true-wireless', 'sports', 'sweat-resistant', 'secure-fit']
  },
  {
    title: 'Solo3 Wireless Headphones',
    description: 'On-ear wireless headphones with Fast Fuel charging',
    imageUrl: 'https://example.com/solo3-white.jpg',
    category: 'headphones',
    altText: 'Solo3 Wireless Headphones White',
    order: 3,
    isActive: true,
    price: 199.99,
    brand: 'Beats by Dre',
    color: 'White',
    specifications: 'Fast Fuel charging, 40-hour battery, Wireless, Adjustable fit',
    stock: 30,
    weight: '205g',
    dimensions: '16.3 x 13.6 x 7.7 cm',
    warranty: '1 year',
    tags: ['wireless', 'fast-charging', 'on-ear', 'adjustable']
  },
  {
    title: 'Beats Pill+ Portable Speaker',
    description: 'Portable Bluetooth speaker with up to 12 hours of playback',
    imageUrl: 'https://example.com/beats-pill-plus.jpg',
    category: 'speakers',
    altText: 'Beats Pill+ Portable Speaker',
    order: 4,
    isActive: true,
    price: 179.99,
    brand: 'Beats by Dre',
    color: 'Black',
    specifications: 'Bluetooth 4.0, 12-hour battery, Waterproof, Built-in microphone',
    stock: 25,
    weight: '406g',
    dimensions: '9.8 x 6.9 x 4.8 cm',
    warranty: '1 year',
    tags: ['portable', 'bluetooth', 'waterproof', 'wireless']
  },
  {
    title: 'Beats Flex Wireless Earbuds',
    description: 'All-day wireless earbuds with Magnetic charging case',
    imageUrl: 'https://example.com/beats-flex.jpg',
    category: 'earbuds',
    altText: 'Beats Flex Wireless Earbuds',
    order: 5,
    isActive: true,
    price: 49.99,
    brand: 'Beats by Dre',
    color: 'Sage Gray',
    specifications: 'Magnetic charging, 12-hour battery, Sweat resistant, Wireless',
    stock: 80,
    weight: '5.6g each',
    dimensions: '3.0 x 3.0 x 2.0 cm',
    warranty: '1 year',
    tags: ['budget', 'all-day', 'magnetic-charging', 'sweat-resistant']
  }
];

async function populateDatabase() {
  try {
    console.log('🌟 Populating Remixbeatsadmin database with sample products...');
    console.log('📍 MongoDB URI:', process.env.MONGODB_URI);

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing products
    const deletedCount = await Image.deleteMany({});
    console.log(`🗑️  Cleared ${deletedCount.deletedCount} existing products`);

    // Insert sample products
    console.log('📝 Inserting sample products...');
    const insertedProducts = await Image.insertMany(sampleProducts);
    console.log(`✅ Successfully inserted ${insertedProducts.length} products`);

    // Display inserted products
    console.log('\n🎯 Products added to your database:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    for (let i = 0; i < insertedProducts.length; i++) {
      const product = insertedProducts[i];
      console.log(`${i + 1}. ${product.title}`);
      console.log(`   📂 Category: ${product.category}`);
      console.log(`   💰 Price: $${product.price}`);
      console.log(`   🎨 Color: ${product.color}`);
      console.log(`   📦 Stock: ${product.stock} units`);
      console.log(`   🏷️  Tags: ${product.tags.join(', ')}`);
      console.log(`   🆔 ID: ${product._id}`);
      console.log('');
    }

    // Verify database state
    const totalProducts = await Image.countDocuments();
    console.log(`📊 Total products in database: ${totalProducts}`);

    // Show collections in database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Collections in database:', collections.map(c => c.name));

    console.log('\n🎉 Sample data population completed successfully!');
    console.log('💡 You can now view these products in your Admin Dashboard.');
    console.log('🔗 Admin Dashboard: http://localhost:3000/admin');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error populating database:', error.message);
    process.exit(1);
  }
}

populateDatabase();