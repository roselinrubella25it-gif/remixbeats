const mongoose = require('mongoose');
const Image = require('./models/Image');
const { assets } = require('../src/assets/assets.js');
require('dotenv').config();

async function populateExistingAssets() {
  try {
    console.log('🌟 Populating database with existing assets from assets.js...');
    console.log('📍 MongoDB URI:', process.env.MONGODB_URI);

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing products
    const deletedCount = await Image.deleteMany({});
    console.log(`🗑️  Cleared ${deletedCount.deletedCount} existing products`);

    // Transform assets to database format
    const productsToInsert = [];
    let productCounter = 1;

    Object.keys(assets).forEach(category => {
      if (assets[category] && Array.isArray(assets[category])) {
        assets[category].forEach(asset => {
          // Generate realistic product data based on existing assets
          const productData = generateProductData(asset, productCounter);
          productsToInsert.push(productData);
          productCounter++;
        });
      }
    });

    console.log(`📝 Preparing to insert ${productsToInsert.length} products...`);
    const insertedProducts = await Image.insertMany(productsToInsert);
    console.log(`✅ Successfully inserted ${insertedProducts.length} products`);

    // Display inserted products
    console.log('\n🎯 Existing Assets Added to Database:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    insertedProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.title}`);
      console.log(`   📂 Category: ${product.category}`);
      console.log(`   💰 Price: $${product.price}`);
      console.log(`   🎨 Color: ${product.color}`);
      console.log(`   📦 Stock: ${product.stock} units`);
      console.log(`   🏷️  Tags: ${product.tags.join(', ')}`);
      console.log(`   🆔 ID: ${product._id}`);
      console.log('');
    });

    // Verify database state
    const totalProducts = await Image.countDocuments();
    console.log(`📊 Total products in database: ${totalProducts}`);

    console.log('\n🎉 Existing assets population completed successfully!');
    console.log('💡 You can now view these products in your Admin Dashboard.');
    console.log('🔗 Admin Dashboard: http://localhost:3000/admin');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error populating database:', error.message);
    process.exit(1);
  }
}

// Function to generate realistic product data based on existing assets
function generateProductData(asset, counter) {
  const baseData = {
    title: asset.title,
    description: generateDescription(asset.title, asset.category),
    imageUrl: asset.imageUrl,
    category: asset.category,
    altText: asset.altText,
    order: asset.order || counter,
    isActive: true,
    brand: 'Beats by Dre',
    warranty: '1 year',
    tags: generateTags(asset.title, asset.category)
  };

  // Add specific data based on category and title
  if (asset.category === 'headphones') {
    if (asset.title.includes('Black') || asset.title.includes('Android')) {
      Object.assign(baseData, {
        price: 299.99,
        color: 'Black',
        specifications: 'Wireless, Active Noise Cancellation, 30-hour battery',
        stock: 45,
        weight: '250g',
        dimensions: '18x15x8 cm'
      });
    } else if (asset.title.includes('White')) {
      Object.assign(baseData, {
        price: 299.99,
        color: 'White',
        specifications: 'Wireless, Active Noise Cancellation, 30-hour battery',
        stock: 35,
        weight: '250g',
        dimensions: '18x15x8 cm'
      });
    } else if (asset.title.includes('Blue') || asset.title.includes('Wired')) {
      Object.assign(baseData, {
        price: 149.99,
        color: 'Blue',
        specifications: 'Wired connection, Adjustable fit, 3.5mm jack',
        stock: 60,
        weight: '200g',
        dimensions: '16x14x7 cm'
      });
    } else if (asset.title.includes('Apple')) {
      Object.assign(baseData, {
        price: 199.99,
        color: 'Red',
        specifications: 'Wireless, Apple H1 chip, 22-hour battery',
        stock: 40,
        weight: '240g',
        dimensions: '17x14x8 cm'
      });
    }
  } else if (asset.category === 'earbuds') {
    if (asset.title.includes('Wood') || asset.title.includes('Bluetooth')) {
      Object.assign(baseData, {
        price: 199.99,
        color: 'Wood Finish',
        specifications: 'True wireless, 8-hour battery, Touch controls',
        stock: 55,
        weight: '8g each',
        dimensions: '2.5x2x2 cm'
      });
    } else if (asset.title.includes('Brown')) {
      Object.assign(baseData, {
        price: 179.99,
        color: 'Brown',
        specifications: 'True wireless, 6-hour battery, Sweat resistant',
        stock: 42,
        weight: '7g each',
        dimensions: '2.3x2x2 cm'
      });
    } else if (asset.title.includes('Grey')) {
      Object.assign(baseData, {
        price: 179.99,
        color: 'Grey',
        specifications: 'True wireless, 6-hour battery, Sweat resistant',
        stock: 38,
        weight: '7g each',
        dimensions: '2.3x2x2 cm'
      });
    }
  } else if (asset.category === 'speakers') {
    Object.assign(baseData, {
      price: 149.99,
      color: 'Black',
      specifications: 'Bluetooth 4.0, 12-hour battery, Waterproof',
      stock: 25,
      weight: '400g',
      dimensions: '10x7x5 cm'
    });
  } else if (asset.category === 'accessories') {
    if (asset.title.includes('Gift')) {
      Object.assign(baseData, {
        price: 29.99,
        color: 'Assorted',
        specifications: 'Gift packaging, Brand box, Warranty card',
        stock: 100,
        weight: '150g',
        dimensions: '25x20x5 cm'
      });
    } else {
      Object.assign(baseData, {
        price: 49.99,
        color: 'Black',
        specifications: 'Accessory kit, Cables included',
        stock: 75,
        weight: '200g',
        dimensions: '15x10x3 cm'
      });
    }
  } else {
    // Default for other categories
    Object.assign(baseData, {
      price: 99.99,
      color: 'Various',
      specifications: 'Premium quality product',
      stock: 20,
      weight: '100g',
      dimensions: '10x10x5 cm'
    });
  }

  return baseData;
}

function generateDescription(title, category) {
  const descriptions = {
    headphones: [
      'Premium wireless headphones with exceptional sound quality and comfort.',
      'Experience immersive audio with advanced noise cancellation technology.',
      'Professional-grade headphones designed for music enthusiasts.'
    ],
    earbuds: [
      'True wireless earbuds delivering crystal-clear sound in a compact design.',
      'Comfortable earbuds with secure fit for active lifestyles.',
      'Advanced wireless earbuds with premium audio performance.'
    ],
    speakers: [
      'Portable Bluetooth speaker with powerful sound and long battery life.',
      'Compact speaker delivering rich, room-filling audio.',
      'Wireless speaker with waterproof design for outdoor use.'
    ],
    accessories: [
      'Essential accessories to enhance your Beats experience.',
      'Premium accessories designed to complement your audio gear.',
      'Quality accessories for protection and extended functionality.'
    ]
  };

  const categoryDescriptions = descriptions[category] || descriptions.headphones;
  return categoryDescriptions[Math.floor(Math.random() * categoryDescriptions.length)];
}

function generateTags(title, category) {
  const baseTags = [category, 'beats'];

  if (category === 'headphones') {
    baseTags.push('wireless', 'premium');
    if (title.includes('Black') || title.includes('White')) {
      baseTags.push('noise-cancelling');
    }
    if (title.includes('Wired')) {
      baseTags.push('wired');
    }
  } else if (category === 'earbuds') {
    baseTags.push('true-wireless', 'compact');
    if (title.includes('Bluetooth')) {
      baseTags.push('bluetooth');
    }
  } else if (category === 'speakers') {
    baseTags.push('portable', 'bluetooth', 'wireless');
  } else if (category === 'accessories') {
    baseTags.push('accessory');
    if (title.includes('Gift')) {
      baseTags.push('gift');
    }
  }

  return baseTags;
}

populateExistingAssets();