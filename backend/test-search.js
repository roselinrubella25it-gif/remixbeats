const mongoose = require('mongoose');
const Image = require('./models/Image');
require('dotenv').config();

async function testSearch() {
  try {
    console.log('🔍 Testing search functionality...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Test search queries
    const searchTests = [
      'Beats',
      'Wireless',
      'Black',
      'Headphones',
      'Powerbeats'
    ];

    for (const searchTerm of searchTests) {
      console.log(`\n📝 Searching for: "${searchTerm}"`);

      const searchRegex = new RegExp(searchTerm, 'i');
      const query = {
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { brand: searchRegex },
          { category: searchRegex },
          { color: searchRegex },
          { tags: { $in: [searchRegex] } }
        ]
      };

      const results = await Image.find(query).limit(5);
      console.log(`   Found ${results.length} results:`);

      results.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.title} - ${product.brand} - $${product.price}`);
      });
    }

    console.log('\n🎉 Search functionality test completed!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error testing search:', error.message);
    process.exit(1);
  }
}

testSearch();